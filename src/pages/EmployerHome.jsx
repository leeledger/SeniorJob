import { useState, useEffect, useRef } from 'react'
import { APPLICANTS } from '../data/mockData.js'
import { postJob } from '../hooks/useJobs.js'
import useApplicantDecisions from '../hooks/useApplicantDecisions.js'
import { supabase } from '../supabase.js'
import BottomNav from '../components/BottomNav.jsx'
import styles from './EmployerHome.module.css'

const FORM_INIT = {
  company: '', task: '', category: '매장', pay: '', hours: '', timeSlot: '', date: '', address: '', desc: '', urgent: false,
}

const STATUS_TABS = [
  { id: 'pending', label: '대기 중' },
  { id: 'accepted', label: '수락' },
  { id: 'rejected', label: '거절' },
]

function formatDecidedAt(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  const now = new Date()
  const sameDay = d.toDateString() === now.toDateString()
  const h = d.getHours()
  const m = String(d.getMinutes()).padStart(2, '0')
  const ampm = h < 12 ? '오전' : '오후'
  const h12 = ((h + 11) % 12) + 1
  const time = `${ampm} ${h12}:${m}`
  if (sameDay) return `오늘 ${time}`
  return `${d.getMonth() + 1}월 ${d.getDate()}일 ${time}`
}

export default function EmployerHome({ nav }) {
  const [tab, setTab] = useState('home')
  const [form, setForm] = useState(FORM_INIT)
  const [posted, setPosted] = useState(false)
  const [posting, setPosting] = useState(false)
  const [postedJobs, setPostedJobs] = useState([])
  const [statusTab, setStatusTab] = useState('pending')
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)
  const decisions = useApplicantDecisions()

  const showToast = (message, tone = 'default') => {
    setToast({ message, tone })
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 1800)
  }

  // unmount 시 토스트 timer 정리
  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current) }, [])

  const handleAccept = async (applicant) => {
    try {
      await decisions.accept(applicant)
      showToast(`${applicant.name}님을 수락했어요`, 'success')
    } catch {
      showToast('저장 실패 — 잠시 후 다시 시도해 주세요', 'muted')
    }
  }
  const handleReject = async (applicant) => {
    try {
      await decisions.reject(applicant)
      showToast(`${applicant.name}님을 거절했어요`, 'muted')
    } catch {
      showToast('저장 실패 — 잠시 후 다시 시도해 주세요', 'muted')
    }
  }
  const handleReopen = async (applicant) => {
    try {
      await decisions.reset(applicant.id)
      showToast(`${applicant.name}님을 대기 목록으로 되돌렸어요`)
    } catch {
      showToast('저장 실패 — 잠시 후 다시 시도해 주세요', 'muted')
    }
  }
  const handleMatch = async (applicant) => {
    const matched = !applicant.matchedAt
    try {
      await decisions.update(applicant.id, { matchedAt: matched ? Date.now() : null })
      showToast(matched ? `${applicant.name}님 매칭을 확정했어요` : `${applicant.name}님 매칭을 취소했어요`, matched ? 'success' : 'muted')
    } catch {
      showToast('저장 실패 — 잠시 후 다시 시도해 주세요', 'muted')
    }
  }
  const handleContact = (applicant) => {
    const phone = applicant.phone || '010-0000-0000'
    showToast(`📞 ${applicant.name}님 — ${phone} (데모)`)
  }

  // 로딩 중에는 결정 상태를 모르므로 결정 가능한 카드를 노출하지 않음 (플리커 방지)
  const pendingApplicants = decisions.loading
    ? []
    : APPLICANTS.filter(a => decisions.statusOf(a.id) === 'pending')
  const acceptedList = decisions.accepted
  const rejectedList = decisions.rejected
  const matchedCount = acceptedList.filter(a => a.matchedAt).length

  // Supabase에서 내 공고 목록 로드
  useEffect(() => {
    supabase
      .from('jobs')
      .select('id, task, date_label, status')
      .order('created_at', { ascending: false })
      .limit(20)
      .then(({ data }) => {
        if (data) {
          setPostedJobs(data.map(j => ({
            id: j.id,
            task: j.task,
            date: j.date_label,
            applicants: 0,
            status: j.status === '구인중' ? '구인 중' : j.status,
          })))
        }
      })
  }, [tab]) // 탭 전환 시마다 갱신

  // 지원자 수 로드
  useEffect(() => {
    if (postedJobs.length === 0) return
    const ids = postedJobs.map(j => j.id)
    supabase
      .from('applications')
      .select('job_id')
      .in('job_id', ids)
      .then(({ data }) => {
        if (!data) return
        const counts = {}
        data.forEach(a => { counts[a.job_id] = (counts[a.job_id] || 0) + 1 })
        setPostedJobs(prev => prev.map(j => ({ ...j, applicants: counts[j.id] || 0 })))
      })
  }, [postedJobs.length])

  const handlePost = async () => {
    if (!form.task || !form.pay || !form.hours) return
    setPosting(true)
    try {
      await postJob(form)
      setPosted(true)
      setForm(FORM_INIT)
      setTimeout(() => { setPosted(false); setTab('manage') }, 1500)
    } catch (e) {
      console.error('공고 등록 실패:', e)
    } finally {
      setPosting(false)
    }
  }

  return (
    <div className={styles.wrap}>
      {/* HOME: 대시보드 */}
      {tab === 'home' && (
        <div className={styles.content}>
          <div className={styles.header}>
            <div>
              <div className={styles.greeting}>안녕하세요, 사장님 👋</div>
              <div className={styles.location}>이마트 해운대점</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className={styles.headerBadge}>고용주</div>
              <button className={styles.exitBtn} onClick={() => nav('back')}>나가기</button>
            </div>
          </div>

          {/* 통계 요약 */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statNum}>12</div>
              <div className={styles.statLabel}>이번 달 총 채용</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNum} style={{ color: 'var(--accent-2)' }}>2</div>
              <div className={styles.statLabel}>진행 중 공고</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNum}>4.8</div>
              <div className={styles.statLabel}>평균 시니어 평점</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNum}>48h</div>
              <div className={styles.statLabel}>절약된 채용 시간</div>
            </div>
          </div>

          {/* 지원자 현황 */}
          <div className={styles.sectionHead}>
            <div className={styles.sectionTitle}>오늘 신청한 시니어</div>
            <button className={styles.sectionLink} onClick={() => setTab('applicants')}>
              전체 관리 →
            </button>
          </div>
          {decisions.loading ? (
            <div className={styles.emptyMini}>지원자 정보를 불러오는 중...</div>
          ) : pendingApplicants.length === 0 ? (
            <div className={styles.emptyMini}>
              모든 지원자를 확인했어요. 수락한 시니어는 <strong>지원자</strong> 탭에서 관리해요.
            </div>
          ) : (
            pendingApplicants.map(a => (
              <div key={a.id} className={styles.applicantCard}>
                <div className={styles.applicantAvatar}>{a.name[0]}</div>
                <div className={styles.applicantInfo}>
                  <div className={styles.applicantName}>
                    {a.name}
                    <span className={`${styles.aBadge} ${a.badge === '베테랑' ? styles.badgeGold : a.badge === '성실왕' ? styles.badgeGreen : ''}`}>
                      {a.badge}
                    </span>
                  </div>
                  <div className={styles.applicantMeta}>{a.age}세 · {a.region} · {a.available}</div>
                  <div className={styles.applicantRating}>★ {a.rating} · {a.jobs}건 완료</div>
                </div>
                <div className={styles.applicantActions}>
                  <button className={styles.acceptBtn} onClick={() => handleAccept(a)}>수락</button>
                  <button className={styles.rejectBtn} onClick={() => handleReject(a)}>거절</button>
                </div>
              </div>
            ))
          )}

          <div className={styles.ctaBox}>
            <div className={styles.ctaTitle}>새 인력이 필요하신가요?</div>
            <button className={styles.ctaBtn} onClick={() => setTab('post')}>공고 올리기 →</button>
          </div>
        </div>
      )}

      {/* POST: 공고 등록 */}
      {tab === 'post' && (
        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles.pageTitle}>공고 올리기</div>
          </div>

          {posted ? (
            <div className={styles.successBox}>
              <div className={styles.successIcon}>✓</div>
              <div className={styles.successTitle}>공고가 등록됐어요!</div>
              <div className={styles.successSub}>시니어 분들에게 알림이 발송됩니다</div>
            </div>
          ) : (
            <div className={styles.formWrap}>
              <div className={styles.formGroup}>
                <label className={styles.label}>업체명</label>
                <input
                  className={styles.input}
                  placeholder="예: 이마트 해운대점"
                  value={form.company}
                  onChange={e => setForm(p => ({ ...p, company: e.target.value }))}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>업무 내용 *</label>
                <input
                  className={styles.input}
                  placeholder="예: 매장 상품 진열 및 정리"
                  value={form.task}
                  onChange={e => setForm(p => ({ ...p, task: e.target.value }))}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>급여 (원) *</label>
                  <input
                    className={styles.input}
                    type="number"
                    placeholder="30000"
                    value={form.pay}
                    onChange={e => setForm(p => ({ ...p, pay: e.target.value }))}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>근무 시간 *</label>
                  <input
                    className={styles.input}
                    type="number"
                    placeholder="3"
                    value={form.hours}
                    onChange={e => setForm(p => ({ ...p, hours: e.target.value }))}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>근무 시간대</label>
                <input
                  className={styles.input}
                  placeholder="예: 오전 9:00 ~ 12:00"
                  value={form.timeSlot}
                  onChange={e => setForm(p => ({ ...p, timeSlot: e.target.value }))}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>근무 날짜</label>
                <input
                  className={styles.input}
                  type="date"
                  value={form.date}
                  onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>근무지 주소</label>
                <input
                  className={styles.input}
                  placeholder="부산시 해운대구 ..."
                  value={form.address}
                  onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>상세 내용</label>
                <textarea
                  className={styles.textarea}
                  placeholder="업무 설명, 주의사항 등을 자유롭게 적어주세요"
                  value={form.desc}
                  onChange={e => setForm(p => ({ ...p, desc: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className={styles.urgentToggle}>
                <label className={styles.toggleLabel}>
                  <input
                    type="checkbox"
                    checked={form.urgent}
                    onChange={e => setForm(p => ({ ...p, urgent: e.target.checked }))}
                    className={styles.checkbox}
                  />
                  <span>🔥 급구 표시 (더 많은 시니어에게 알림)</span>
                </label>
              </div>

              {form.pay && form.hours && (
                <div className={styles.previewBox}>
                  <span>시급 환산</span>
                  <span className={styles.previewPay}>
                    {Math.round(Number(form.pay) / Number(form.hours)).toLocaleString()}원/시간
                  </span>
                </div>
              )}

              <button
                className={`${styles.postBtn} ${(!form.task || !form.pay || !form.hours || posting) ? styles.postBtnDisabled : ''}`}
                onClick={handlePost}
                disabled={!form.task || !form.pay || !form.hours || posting}
              >
                {posting ? '등록 중...' : '공고 등록하기'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* APPLICANTS: 지원자 관리 */}
      {tab === 'applicants' && (
        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles.pageTitle}>지원자 관리</div>
          </div>

          {decisions.error && (
            <div className={styles.errorBanner}>
              지원자 결정 데이터를 불러올 수 없어요. <code>supabase_migration_applicant_decisions.sql</code>이 적용됐는지 확인해 주세요.
            </div>
          )}

          {/* 상단 요약 */}
          <div className={styles.summaryStrip}>
            <div className={styles.summaryItem}>
              <div className={styles.summaryNum}>{pendingApplicants.length}</div>
              <div className={styles.summaryLabel}>대기 중</div>
            </div>
            <div className={styles.summaryDivider} />
            <div className={styles.summaryItem}>
              <div className={styles.summaryNum} style={{ color: 'var(--accent)' }}>{acceptedList.length}</div>
              <div className={styles.summaryLabel}>수락</div>
            </div>
            <div className={styles.summaryDivider} />
            <div className={styles.summaryItem}>
              <div className={styles.summaryNum} style={{ color: 'var(--accent-2)' }}>{matchedCount}</div>
              <div className={styles.summaryLabel}>매칭 확정</div>
            </div>
            <div className={styles.summaryDivider} />
            <div className={styles.summaryItem}>
              <div className={styles.summaryNum} style={{ color: 'var(--ink-3)' }}>{rejectedList.length}</div>
              <div className={styles.summaryLabel}>거절</div>
            </div>
          </div>

          {/* 세그먼트 토글 */}
          <div className={styles.segments} role="tablist">
            {STATUS_TABS.map(s => {
              const count = s.id === 'pending' ? pendingApplicants.length
                : s.id === 'accepted' ? acceptedList.length
                : rejectedList.length
              return (
                <button
                  key={s.id}
                  role="tab"
                  aria-selected={statusTab === s.id}
                  className={`${styles.segmentBtn} ${statusTab === s.id ? styles.segmentBtnActive : ''}`}
                  onClick={() => setStatusTab(s.id)}
                >
                  {s.label} <span className={styles.segmentCount}>{count}</span>
                </button>
              )
            })}
          </div>

          {/* 대기 중 */}
          {statusTab === 'pending' && (
            <>
              {decisions.loading ? (
                <div className={styles.emptyState}>
                  <div className={styles.emptyTitle}>불러오는 중...</div>
                </div>
              ) : pendingApplicants.length === 0 ? (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>✓</div>
                  <div className={styles.emptyTitle}>대기 중인 지원자가 없어요</div>
                  <div className={styles.emptySub}>새 지원자가 들어오면 여기에 표시됩니다.</div>
                </div>
              ) : (
                pendingApplicants.map(a => (
                  <div key={a.id} className={styles.applicantCard}>
                    <div className={styles.applicantAvatar}>{a.name[0]}</div>
                    <div className={styles.applicantInfo}>
                      <div className={styles.applicantName}>
                        {a.name}
                        <span className={`${styles.aBadge} ${a.badge === '베테랑' ? styles.badgeGold : a.badge === '성실왕' ? styles.badgeGreen : ''}`}>
                          {a.badge}
                        </span>
                      </div>
                      <div className={styles.applicantMeta}>{a.age}세 · {a.region} · {a.available}</div>
                      <div className={styles.applicantRating}>★ {a.rating} · {a.jobs}건 완료</div>
                    </div>
                    <div className={styles.applicantActions}>
                      <button className={styles.acceptBtn} onClick={() => handleAccept(a)}>수락</button>
                      <button className={styles.rejectBtn} onClick={() => handleReject(a)}>거절</button>
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {/* 수락 */}
          {statusTab === 'accepted' && (
            <>
              {acceptedList.length === 0 ? (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>👥</div>
                  <div className={styles.emptyTitle}>아직 수락한 시니어가 없어요</div>
                  <div className={styles.emptySub}>대기 중 탭에서 시니어를 수락해 보세요.</div>
                </div>
              ) : (
                acceptedList.map(a => (
                  <div key={a.id} className={`${styles.decisionCard} ${a.matchedAt ? styles.matchedCard : ''}`}>
                    <div className={styles.decisionHead}>
                      <div className={styles.applicantAvatar}>{a.name?.[0] || '?'}</div>
                      <div className={styles.applicantInfo}>
                        <div className={styles.applicantName}>
                          {a.name}
                          {a.matchedAt ? (
                            <span className={`${styles.aBadge} ${styles.badgeMatched}`}>매칭 확정</span>
                          ) : (
                            <span className={`${styles.aBadge} ${styles.badgeGreen}`}>수락됨</span>
                          )}
                        </div>
                        <div className={styles.applicantMeta}>{a.age}세 · {a.region} · {a.available}</div>
                        <div className={styles.applicantRating}>★ {a.rating} · {a.jobs}건 완료</div>
                      </div>
                    </div>
                    <div className={styles.decisionMeta}>
                      <span>수락 {formatDecidedAt(a.decidedAt)}</span>
                      {a.matchedAt && <span>· 매칭 {formatDecidedAt(a.matchedAt)}</span>}
                    </div>
                    <div className={styles.decisionActions}>
                      <button className={styles.actionGhost} onClick={() => handleContact(a)}>📞 연락처</button>
                      <button
                        className={a.matchedAt ? styles.actionGhost : styles.actionPrimary}
                        onClick={() => handleMatch(a)}
                      >
                        {a.matchedAt ? '매칭 취소' : '✓ 매칭 확정'}
                      </button>
                      <button className={styles.actionGhost} onClick={() => handleReopen(a)}>대기로</button>
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {/* 거절 */}
          {statusTab === 'rejected' && (
            <>
              {rejectedList.length === 0 ? (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>—</div>
                  <div className={styles.emptyTitle}>거절한 시니어가 없어요</div>
                  <div className={styles.emptySub}>거절 이력은 여기에 보관됩니다.</div>
                </div>
              ) : (
                rejectedList.map(a => (
                  <div key={a.id} className={`${styles.decisionCard} ${styles.rejectedCard}`}>
                    <div className={styles.decisionHead}>
                      <div className={styles.applicantAvatar}>{a.name?.[0] || '?'}</div>
                      <div className={styles.applicantInfo}>
                        <div className={styles.applicantName}>
                          {a.name}
                          <span className={`${styles.aBadge} ${styles.badgeRejected}`}>거절</span>
                        </div>
                        <div className={styles.applicantMeta}>{a.age}세 · {a.region} · {a.available}</div>
                      </div>
                    </div>
                    <div className={styles.decisionMeta}>
                      <span>거절 {formatDecidedAt(a.decidedAt)}</span>
                    </div>
                    <div className={styles.decisionActions}>
                      <button className={styles.actionPrimary} onClick={() => handleAccept(a)}>다시 수락</button>
                      <button className={styles.actionGhost} onClick={() => handleReopen(a)}>대기로</button>
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      )}

      {/* MANAGE: 공고 관리 */}
      {tab === 'manage' && (
        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles.pageTitle}>공고 관리</div>
          </div>
          {postedJobs.map(j => (
            <div key={j.id} className={styles.manageCard}>
              <div className={styles.manageLeft}>
                <div className={styles.manageTask}>{j.task}</div>
                <div className={styles.manageMeta}>{j.date} · 지원자 {j.applicants}명</div>
              </div>
              <span className={`${styles.statusBadge} ${j.status === '매칭 완료' ? styles.statusDone : styles.statusActive}`}>
                {j.status}
              </span>
            </div>
          ))}
          <button className={styles.newPostBtn} onClick={() => setTab('post')}>+ 새 공고 올리기</button>
        </div>
      )}

      {toast && (
        <div className={`${styles.toast} ${toast.tone === 'success' ? styles.toastSuccess : toast.tone === 'muted' ? styles.toastMuted : ''}`}>
          {toast.message}
        </div>
      )}

      <BottomNav tab={tab} setTab={setTab} mode="employer" />
    </div>
  )
}
