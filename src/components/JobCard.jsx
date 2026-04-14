import styles from './JobCard.module.css'

export default function JobCard({ job, applied, onClick, onApply }) {
  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.top}>
        <div className={styles.logoWrap} style={{ background: job.color + '20' }}>
          <span className={styles.logoText} style={{ color: job.color }}>{job.logo.slice(0, 2)}</span>
        </div>
        <div className={styles.info}>
          <div className={styles.company}>{job.company}</div>
          <div className={styles.task}>{job.task}</div>
          <div className={styles.meta}>
            <span>{job.timeSlot}</span>
            <span className={styles.dot}></span>
            <span>{job.dateLabel}</span>
            <span className={styles.dot}></span>
            <span>{job.distance}</span>
          </div>
        </div>
        {job.urgent && <span className={styles.urgentPill}>급구</span>}
      </div>

      <div className={styles.bottom}>
        <div className={styles.payRow}>
          <span className={styles.pay}>{job.pay.toLocaleString()}원</span>
          <span className={styles.hours}>{job.hours}시간</span>
          {job.qr && <span className={styles.qrBadge}>⚡ 당일 입금</span>}
        </div>
        <button
          className={`${styles.applyBtn} ${applied ? styles.applied : ''}`}
          onClick={onApply}
          disabled={applied}
        >
          {applied ? '신청 완료' : '바로 신청'}
        </button>
      </div>
    </div>
  )
}
