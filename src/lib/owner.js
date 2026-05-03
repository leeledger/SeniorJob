// 인증 도입 전 임시 — 기기 단위 식별자 (브라우저별 1개)
// localStorage에 UUID 저장. 브라우저 데이터 삭제 시 새로 발급됨.
const KEY = 'seniorjob.ownerId.v1'

export function getOwnerId() {
  let id = null
  try { id = localStorage.getItem(KEY) } catch {}
  if (id) return id

  id = (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : `ow-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`

  try { localStorage.setItem(KEY, id) } catch {}
  return id
}
