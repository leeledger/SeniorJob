import { useState, useEffect, useRef } from 'react'
import { geocodeAddress, haversine, formatDistance } from './useLocation.js'

const ENDPOINT = '/odcloud/api/15050148/v1/uddi:5a9fe759-5344-41ef-94c1-9de71e3e156f'
const SERVICE_KEY = import.meta.env.VITE_ODCLOUD_KEY

// 세션 내 지역 좌표 캐시 (동일 지역 중복 요청 방지)
const regionCache = new Map()

const TYPE_COLOR = {
  '공공형':       '#15803D',
  '시장형':       '#1D4ED8',
  '사회서비스형': '#9333EA',
  '인력파견형':   '#B45309',
  '취업알선형':   '#0E7490',
  '기타':         '#374151',
}

function transform(item) {
  const start = item['사업기간시작일'] ?? ''
  const end   = item['사업기간종료일'] ?? ''
  const period = (start && end)
    ? `${start.slice(0, 7).replace('-', '.')} ~ ${end.slice(0, 7).replace('-', '.')}`
    : '기간 미정'

  const typeAlias = {
    '공익활동': '공공형',
    '사회서비스형': '사회서비스형',
    '시장형': '시장형',
    '인력파견형': '인력파견형',
    '취업알선형': '취업알선형',
  }
  const rawType = item['사업유형'] ?? ''
  const type    = typeAlias[rawType] || rawType || '기타'

  const region  = item['관할시군구'] ?? ''
  const orgName = item['수행기관명'] ?? ''

  return {
    id:           item['사업번호'] ?? Math.random().toString(36).slice(2),
    programName:  item['사업명'] ?? '사업명 미상',
    executingOrg: orgName,
    agencyName:   '한국노인인력개발원',
    type,
    color:        TYPE_COLOR[type] ?? '#374151',
    period,
    region,
    address:      region,
    targetAge:    '60세 이상',
    slots:        Number(item['목표일자리수']) || 0,
    remaining:    null,
    pay:          null,
    hours:        null,
    contact:      item['연락처'] ?? item['담당자연락처'] ?? null,
    year:         item['사업년도'] ?? '',
    _km:          null,
    distance:     null,
  }
}

// 고유 지역들을 순차 지오코딩 (Nominatim 1req/s 정책 준수)
async function geocodeRegions(regions, onUpdate, cancelRef) {
  for (let i = 0; i < regions.length; i++) {
    if (cancelRef.current) return
    const region = regions[i]
    if (!regionCache.has(region)) {
      if (i > 0) await new Promise(r => setTimeout(r, 1100))
      if (cancelRef.current) return
      const geo = await geocodeAddress(region)
      regionCache.set(region, geo ?? null)
    }
    onUpdate(region, regionCache.get(region))
  }
}

export function usePublicJobs(coords) {
  const [jobs, setJobs]       = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const cancelRef             = useRef(false)

  // 공공 API 페치
  useEffect(() => {
    cancelRef.current = false
    setLoading(true)
    setError(null)

    const url = `${ENDPOINT}?serviceKey=${encodeURIComponent(SERVICE_KEY)}&page=1&perPage=100&returnType=JSON`

    fetch(url)
      .then(r => { if (!r.ok) throw new Error(`API ${r.status}`); return r.json() })
      .then(json => {
        if (cancelRef.current) return
        setJobs((json.data ?? []).map(transform))
      })
      .catch(e => { if (!cancelRef.current) setError(e.message) })
      .finally(() => { if (!cancelRef.current) setLoading(false) })

    return () => { cancelRef.current = true }
  }, [])

  // 좌표 확보 후 → 지역 지오코딩 → 거리 계산 → 정렬
  useEffect(() => {
    if (!coords || jobs.length === 0) return
    cancelRef.current = false

    const uniqueRegions = [...new Set(jobs.map(j => j.region).filter(Boolean))]

    geocodeRegions(
      uniqueRegions.filter(r => !regionCache.has(r)),
      (region, geo) => {
        if (cancelRef.current || !geo) return
        setJobs(prev =>
          prev.map(j => {
            if (j.region !== region || j._km != null) return j
            const km = haversine(coords.lat, coords.lng, geo.lat, geo.lng)
            return { ...j, _km: km, distance: formatDistance(km) }
          })
        )
      },
      cancelRef
    ).then(() => {
      if (cancelRef.current) return
      // 이미 캐시된 지역들도 거리 반영
      setJobs(prev => {
        const updated = prev.map(j => {
          if (j._km != null) return j
          const geo = regionCache.get(j.region)
          if (!geo) return j
          const km = haversine(coords.lat, coords.lng, geo.lat, geo.lng)
          return { ...j, _km: km, distance: formatDistance(km) }
        })
        return [...updated].sort((a, b) => {
          if (a._km == null && b._km == null) return 0
          if (a._km == null) return 1
          if (b._km == null) return -1
          return a._km - b._km
        })
      })
    })

    return () => { cancelRef.current = true }
  }, [coords, jobs.length === 0])

  return { jobs, loading, error }
}
