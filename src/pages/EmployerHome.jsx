import { useState } from 'react'
import { APPLICANTS } from '../data/mockData.js'
import BottomNav from '../components/BottomNav.jsx'
import styles from './EmployerHome.module.css'

const FORM_INIT = {
  task: '', category: '매장', pay: '', hours: '', timeSlot: '', date: '', address: '', desc: '', urgent: false,
}

export default function EmployerHome({ nav }) {
  const [tab, setTab] = useState('home')
  const [form, setForm] = useState(FORM_INIT)
  const [posted, setPosted] = useState(false)
  const [postedJobs, setPostedJobs] = useState([
    { id: 1, task: '매장 상품 진열', date: '오늘', applicants: 3, status: '매칭 완료' },
    { id: 2, task: '재고 정리 및 검수', date: '내일', applicants: 1, status: '구인 중' },
  ])

  const handlePost = () => {
    if (!form.task || !form.pay || !form.hours) return
    setPostedJobs(prev => [
      { id: Date.now(), task: form.task, date: form.date || '오늘', applicants: 0, status: '구인 중' },
      ...prev,
    ])
    setPosted(true)
    setForm(FORM_INIT)
    setTimeout(() => { setPosted(false); setTab('manage') }, 1500)
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
            <div className={styles.headerBadge}>고용주</div>
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
          <div className={styles.sectionTitle}>오늘 신청한 시니어</div>
          {APPLICANTS.map(a => (
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
                <button className={styles.acceptBtn}>수락</button>
                <button className={styles.rejectBtn}>거절</button>
              </div>
            </div>
          ))}

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
                className={`${styles.postBtn} ${(!form.task || !form.pay || !form.hours) ? styles.postBtnDisabled : ''}`}
                onClick={handlePost}
              >
                공고 등록하기
              </button>
            </div>
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

      <BottomNav tab={tab} setTab={setTab} mode="employer" />
    </div>
  )
}
