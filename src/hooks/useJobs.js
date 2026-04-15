import { useState, useEffect } from 'react'
import { supabase } from '../supabase.js'
import { geocodeAddress } from './useLocation.js'

// 민간 구인 공고 목록 — 실시간 구독
export function useJobs() {
  const [jobs, setJobs]       = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    // 초기 로드
    supabase
      .from('jobs')
      .select('*')
      .eq('status', '구인중')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message)
        else setJobs(data ?? [])
        setLoading(false)
      })

    // 실시간 구독 (새 공고 즉시 반영)
    const channel = supabase
      .channel('jobs-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'jobs' }, () => {
        supabase
          .from('jobs')
          .select('*')
          .eq('status', '구인중')
          .order('created_at', { ascending: false })
          .then(({ data }) => { if (data) setJobs(data) })
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  return { jobs, loading, error }
}

// 공고 등록 (주소 → 좌표 자동 변환)
export async function postJob(form) {
  const geo = form.address ? await geocodeAddress(form.address) : null

  const { data, error } = await supabase
    .from('jobs')
    .insert([{
      company:     form.company || '우리 가게',
      logo:        (form.company || '우리').slice(0, 2),
      task:        form.task,
      category:    form.category || '기타',
      pay:         Number(form.pay),
      hours:       Number(form.hours),
      time_slot:   form.timeSlot,
      date_label:  form.date || '오늘',
      address:     form.address,
      urgent:      form.urgent || false,
      description: form.desc,
      color:       '#2D6A4F',
      lat:         geo?.lat ?? null,
      lng:         geo?.lng ?? null,
    }])
    .select()
    .single()

  if (error) throw error
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
