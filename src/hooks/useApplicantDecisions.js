import { useEffect, useState, useCallback, useRef } from 'react'
import { supabase } from '../supabase.js'
import { getOwnerId } from '../lib/owner.js'

// DB row -> 화면용 객체
function fromRow(row) {
  return {
    id: row.applicant_id,
    name: row.applicant_name,
    age: row.applicant_age,
    region: row.applicant_region,
    badge: row.applicant_badge,
    rating: row.applicant_rating != null ? Number(row.applicant_rating) : null,
    jobs: row.applicant_jobs,
    available: row.applicant_available,
    phone: row.applicant_phone,
    status: row.status,
    matchedAt: row.matched_at ? new Date(row.matched_at).getTime() : null,
    decidedAt: row.decided_at ? new Date(row.decided_at).getTime() : Date.now(),
    note: row.note || '',
    _rowId: row.id,
  }
}

function toRow(applicant, status, extra = {}) {
  return {
    applicant_id:        applicant.id,
    applicant_name:      applicant.name,
    applicant_age:       applicant.age,
    applicant_region:    applicant.region,
    applicant_badge:     applicant.badge,
    applicant_rating:    applicant.rating,
    applicant_jobs:      applicant.jobs,
    applicant_available: applicant.available,
    applicant_phone:     applicant.phone || null,
    status,
    matched_at: extra.matchedAt ? new Date(extra.matchedAt).toISOString() : null,
    note: extra.note ?? null,
    decided_at: new Date().toISOString(),
    owner_id: getOwnerId(),
  }
}

export default function useApplicantDecisions() {
  const [decisions, setDecisions] = useState({}) // keyed by applicant_id
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const cancelled = useRef(false)

  // 초기 로드 + 실시간 구독 (incremental)
  useEffect(() => {
    cancelled.current = false
    const ownerId = getOwnerId()

    supabase
      .from('applicant_decisions')
      .select('*')
      .eq('owner_id', ownerId)
      .order('decided_at', { ascending: false })
      .then(({ data, error: err }) => {
        if (cancelled.current) return
        if (err) {
          console.error('applicant_decisions 로드 실패:', err)
          setError(err.message || String(err))
          setLoading(false)
          return
        }
        const map = {}
        ;(data || []).forEach(r => { map[r.applicant_id] = fromRow(r) })
        setDecisions(map)
        setLoading(false)
      })

    // 실시간: payload만 사용해 incremental merge — owner_id 가 일치하는 row만 반영
    const channel = supabase
      .channel('applicant_decisions-changes')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'applicant_decisions' },
        ({ new: row }) => {
          if (cancelled.current || !row || row.owner_id !== ownerId) return
          setDecisions(prev => ({ ...prev, [row.applicant_id]: fromRow(row) }))
        })
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'applicant_decisions' },
        ({ new: row }) => {
          if (cancelled.current || !row || row.owner_id !== ownerId) return
          setDecisions(prev => ({ ...prev, [row.applicant_id]: fromRow(row) }))
        })
      .on('postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'applicant_decisions' },
        ({ old: row }) => {
          if (cancelled.current || !row?.applicant_id) return
          if (row.owner_id && row.owner_id !== ownerId) return
          setDecisions(prev => {
            if (!prev[row.applicant_id]) return prev
            const next = { ...prev }
            delete next[row.applicant_id]
            return next
          })
        })
      .subscribe()

    return () => {
      cancelled.current = true
      supabase.removeChannel(channel)
    }
  }, [])

  // 낙관적 갱신 + DB upsert
  const decide = useCallback(async (applicant, status, extra = {}) => {
    const optimistic = {
      ...applicant,
      status,
      decidedAt: Date.now(),
      matchedAt: extra.matchedAt ?? null,
      note: extra.note ?? '',
    }
    setDecisions(prev => ({ ...prev, [applicant.id]: optimistic }))

    const payload = toRow(applicant, status, extra)
    const { error: err } = await supabase
      .from('applicant_decisions')
      .upsert(payload, { onConflict: 'owner_id,applicant_id' })

    if (err) {
      console.error('decide 실패:', err)
      setDecisions(prev => {
        const next = { ...prev }
        delete next[applicant.id]
        return next
      })
      throw err
    }
  }, [])

  const accept = useCallback((applicant) => decide(applicant, 'accepted'), [decide])
  const reject = useCallback((applicant) => decide(applicant, 'rejected'), [decide])

  const reset = useCallback(async (applicantId) => {
    let snapshot
    setDecisions(prev => {
      snapshot = prev[applicantId]
      const next = { ...prev }
      delete next[applicantId]
      return next
    })
    const { error: err } = await supabase
      .from('applicant_decisions')
      .delete()
      .eq('applicant_id', applicantId)
      .eq('owner_id', getOwnerId())
    if (err) {
      console.error('reset 실패:', err)
      if (snapshot) setDecisions(prev => ({ ...prev, [applicantId]: snapshot }))
      throw err
    }
  }, [])

  const update = useCallback(async (applicantId, patch) => {
    let prevSnapshot
    setDecisions(prev => {
      prevSnapshot = prev[applicantId]
      if (!prevSnapshot) return prev
      return { ...prev, [applicantId]: { ...prevSnapshot, ...patch } }
    })
    if (!prevSnapshot) return

    const dbPatch = {}
    if ('matchedAt' in patch) dbPatch.matched_at = patch.matchedAt ? new Date(patch.matchedAt).toISOString() : null
    if ('note' in patch)      dbPatch.note = patch.note
    if ('status' in patch)    dbPatch.status = patch.status
    if (Object.keys(dbPatch).length === 0) return

    const { error: err } = await supabase
      .from('applicant_decisions')
      .update(dbPatch)
      .eq('applicant_id', applicantId)
      .eq('owner_id', getOwnerId())
    if (err) {
      console.error('update 실패:', err)
      setDecisions(prev => ({ ...prev, [applicantId]: prevSnapshot }))
      throw err
    }
  }, [])

  const byStatus = (status) =>
    Object.values(decisions)
      .filter(d => d.status === status)
      .sort((a, b) => b.decidedAt - a.decidedAt)

  const statusOf = (id) => decisions[id]?.status || 'pending'

  return {
    decisions,
    loading,
    error,
    accept,
    reject,
    reset,
    update,
    byStatus,
    statusOf,
    accepted: byStatus('accepted'),
    rejected: byStatus('rejected'),
  }
}
