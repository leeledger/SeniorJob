import { useState } from 'react'
import styles from './JobDetail.module.css'

export default function JobDetail({ job, nav }) {
  const [applied, setApplied] = useState(false)

  if (!job) return null

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => nav('back')}>← 뒤로</button>
        {job.urgent && <span className={styles.urgentBadge}>🔥 급구</span>}
      </div>

      <div className={styles.hero} style={{ borderBottom: `4px solid ${job.color}` }}>
        <div className={styles.logoLarge} style={{ background: job.color + '20' }}>
          <span style={{ color: job.color, fontSize: '1.4rem', fontWeight: 700 }}>{job.logo.slice(0, 2)}</span>
        </div>
        <div className={styles.company}>{job.company}</div>
        <div className={styles.task}>{job.task}</div>
        <div className={styles.address}>📍 {job.address}</div>
      </div>

      <div className={styles.payBar}>
        <div className={styles.payItem}>
          <span className={styles.piLabel}>급여</span>
          <span className={styles.piVal} style={{ color: job.color }}>{job.pay.toLocaleString()}원</span>
        </div>
        <div className={styles.piDiv}></div>
        <div className={styles.payItem}>
          <span className={styles.piLabel}>시간</span>
          <span className={styles.piVal}>{job.hours}시간</span>
        </div>
        <div className={styles.piDiv}></div>
        <div className={styles.payItem}>
          <span className={styles.piLabel}>시급</span>
          <span className={styles.piVal}>{Math.round(job.pay / job.hours).toLocaleString()}원</span>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>근무 일시</div>
        <div className={styles.infoRow}>
          <span>🗓️</span>
          <span>{job.dateLabel} · {job.timeSlot}</span>
        </div>
        <div className={styles.infoRow}>
          <span>📍</span>
          <span>{job.address} · 도보 {job.distance}</span>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>업무 내용</div>
        <p className={styles.desc}>{job.desc}</p>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>필요 조건</div>
        <div className={styles.tagRow}>
          {job.requirements.map(r => (
            <span key={r} className={styles.tag}>{r}</span>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.qrBox}>
          <div className={styles.qrTitle}>⚡ 당일 입금 보장</div>
          <div className={styles.qrDesc}>퇴근 시 매장 내 QR을 찍으면 당일 계좌로 입금됩니다. 면접 없이 바로 출근 가능.</div>
        </div>
      </div>

      <div className={styles.cta}>
        <button
          className={`${styles.applyBtn} ${applied ? styles.applied : ''}`}
          onClick={() => { setApplied(true); setTimeout(() => nav('qr-complete', job), 600) }}
          disabled={applied}
        >
          {applied ? '신청 완료! 이동 중...' : '지금 바로 신청하기'}
        </button>
        <p className={styles.ctaSub}>면접 없음 · 즉시 확정 · 당일 입금</p>
      </div>
    </div>
  )
}
