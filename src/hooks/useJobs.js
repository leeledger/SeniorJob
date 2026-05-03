import { useState, useEffect } from 'react'
import { supabase } from '../supabase.js'
import { geocodeAddress } from './useLocation.js'
import { getOwnerId } from '../lib/owner.js'

// 좌표 없는 공고 자동 지오코딩 (Nominatim, 1.1초 간격)
async function backfillCoords(jobs) {
  const missing = jobs.filter(j => j.address && !j.lat)
  for (let i = 0; i < missing.length; i++) {
    await new Promise(r => setTimeout(r, i === 0 ? 0 : 1100))
    const geo = await geocodeAddress(missing[i].address)
    if (!geo) continue
    await supabase
      .from('jobs')
      .update({ lat: geo.lat, lng: geo.lng })
      .eq('id', missing[i].id)
    // 로컬 상태도 즉시 업데이트
    missing[i]._resolved = geo
  }
}

// 민간 구인 공고 목록 — 실시간 구독 + 자동 좌표 보완
export function useJobs() {
  const [jobs, setJobs]       = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    let cancelled = false

    // Supabase snake_case → JobCard/JobDetail 기대 필드명 정규화
    const normalize = (j) => ({
      ...j,
      timeSlot:     j.time_slot   ?? j.timeSlot   ?? '',
      dateLabel:    j.date_label  ?? j.dateLabel  ?? '오늘',
      desc:         j.desc        ?? j.description ?? '',
      requirements: j.requirements ?? [],
      qr:           true,
    })

    const fetchJobs = () =>
      supabase
        .from('jobs')
        .select('*')
        .eq('status', '구인중')
        .order('created_at', { ascending: false })

    fetchJobs().then(({ data, error: err }) => {
      if (cancelled) return
      if (err) { setError(err.message); setLoading(false); return }
      const list = (data ?? []).map(normalize)
      setJobs(list)
      setLoading(false)
      if (list.some(j => j.address && !j.lat)) {
        backfillCoords(list).then(() => {
          if (cancelled) return
          fetchJobs().then(({ data: d }) => { if (d && !cancelled) setJobs(d.map(normalize)) })
        })
      }
    })

    // 실시간 구독
    const channel = supabase
      .channel('jobs-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'jobs' }, () => {
        fetchJobs().then(({ data: d }) => { if (d && !cancelled) setJobs(d.map(normalize)) })
      })
      .subscribe()

    return () => { cancelled = true; supabase.removeChannel(channel) }
  }, [])

  return { jobs, loading, error }
}

// 공고 등록 (주소 → 좌표 자동 변환)
export async function postJob(form) {
  const company = (form.company || '').trim()
  const task    = (form.task    || '').trim()
  const pay     = Number(form.pay)
  const hours   = Number(form.hours)

  // 클라이언트 검증 (400 전에 친절한 메시지)
  if (!task)                    throw new Error('업무 내용을 입력해 주세요')
  if (!Number.isFinite(pay))    throw new Error('급여는 숫자로 입력해 주세요')
  if (!Number.isFinite(hours))  throw new Error('근무 시간은 숫자로 입력해 주세요')

  const geo = form.address ? await geocodeAddress(form.address) : null

  // 옵션 필드는 값이 있을 때만 포함 — 누락 컬럼 / 빈값으로 인한 400 회피
  const row = {
    company:  company || '우리 가게',
    logo:     (company || '우리').slice(0, 2),
    task,
    category: form.category || '기타',
    pay,
    hours,
    color:    '#2D6A4F',
    urgent:   Boolean(form.urgent),
    owner_id: getOwnerId(),
  }
  if (form.timeSlot) row.time_slot   = form.timeSlot
  if (form.date)     row.date_label  = form.date
  if (form.address)  row.address     = form.address
  if (form.desc)     row.description = form.desc
  if (geo)           { row.lat = geo.lat; row.lng = geo.lng }

  const { data, error } = await supabase
    .from('jobs')
    .insert([row])
    .select()
    .single()

  if (error) {
    // PostgREST 에러 전체 정보 보존 (message + details + hint + code)
    const detail = [error.message, error.details, error.hint].filter(Boolean).join(' · ')
    const enriched = new Error(detail || `Supabase 에러 (code ${error.code || 'unknown'})`)
    enriched.code = error.code
    enriched.details = error.details
    enriched.hint = error.hint
    throw enriched
  }
  return data
}

// 지원하기
export async function applyToJob(jobId, seniorInfo = {}) {
  const { data, error } = await supabase
    .from('applications')
    .insert([{
      job_id:        jobId,
      senior_name:   seniorInfo.name   || '김영자',
      senior_age:    seniorInfo.age    || 67,
      senior_region: seniorInfo.region || '해운대구',
    }])
    .select()
    .single()

  if (error) throw error
  return data
}

// 특정 공고의 지원자 목록
export function useApplicants(jobId) {
  const [applicants, setApplicants] = useState([])

  useEffect(() => {
    if (!jobId) return
    supabase
      .from('applications')
      .select('*')
      .eq('job_id', jobId)
      .order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setApplicants(data) })
  }, [jobId])

  return applicants
}

// 지원 상태 변경 (수락/거절)
export async function updateApplicationStatus(appId, status) {
  const { error } = await supabase
    .from('applications')
    .update({ status })
    .eq('id', appId)

  if (error) throw error
}
