import { useState, useEffect } from 'react'

// Haversine 거리 계산 (km)
export function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// km → 표시 문자열
export function formatDistance(km) {
  if (km == null) return null
  return km < 1 ? `${Math.round(km * 1000)}m` : `${km.toFixed(1)}km`
}

// 주소 → 좌표 (공고 등록 시 사용)
export async function geocodeAddress(address) {
  try {
    const q = encodeURIComponent(address)
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1&countrycodes=kr`
    )
    const data = await res.json()
    if (data[0]) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
  } catch {}
  return null
}

export function useLocation() {
  const [coords, setCoords]   = useState(null)    // { lat, lng }
  const [address, setAddress] = useState('')       // 역지오코딩 결과
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('위치 정보 미지원')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords: c }) => {
        const { latitude: lat, longitude: lng } = c
        setCoords({ lat, lng })

        // 역지오코딩 — 읍/면/동 수준 주소 추출
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=ko&zoom=14`
          )
          const data = await res.json()
          const a = data.address || {}
          // 한국 주소: city_district(구) > suburb(동) > county(군)
          const district = a.city_district || a.county || ''
          const suburb   = a.suburb || a.neighbourhood || ''
          setAddress([district, suburb].filter(Boolean).join(' ') || a.city || '내 위치')
        } catch {
          setAddress('내 위치')
        }
        setLoading(false)
      },
      () => {
        setError('위치 권한 거부됨')
        setLoading(false)
      },
      { timeout: 8000, maximumAge: 60000 }
    )
  }, [])

  return { coords, address, loading, error }
}
