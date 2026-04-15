import styles from './PublicJobCard.module.css'

const TYPE_COLOR = {
  '공공형':       '#15803D',
  '시장형':       '#1D4ED8',
  '사회서비스형': '#9333EA',
  '인력파견형':   '#B45309',
  '취업알선형':   '#0E7490',
}

export default function PublicJobCard({ job, onApply, applied }) {
  const typeColor = job.color || TYPE_COLOR[job.type] || '#374151'

  return (
    <div className={styles.card}>
      {/* 상단: 정부 배지 + 유형 + 거리 */}
      <div className={styles.top}>
        <div className={styles.topLeft}>
          <div className={styles.govBadge}>
            <span>🏛</span>
            <span>공공일자리</span>
          </div>
          <span
            className={styles.typePill}
            style={{ background: typeColor + '18', color: typeColor, borderColor: typeColor + '40' }}
          >
            {job.type}
          </span>
        </div>
        {job.distance && (
          <span className={styles.distBadge}>{job.distance}</span>
        )}
      </div>

      {/* 사업명 */}
      <div className={styles.title}>{job.programName}</div>

      {/* 수행기관 */}
      {job.executingOrg && (
        <div className={styles.orgRow}>
          <span className={styles.orgLabel}>수행기관</span>
          <span className={styles.orgName}>{job.executingOrg}</span>
        </div>
      )}

      {/* 정보 그리드 */}
      <div className={styles.infoGrid}>
        <div className={styles.infoItem}>
          <span className={styles.infoIcon}>💰</span>
          <span className={styles.infoVal}>
            {job.pay != null ? `${job.pay.toLocaleString()}원` : '활동비 문의'}
          </span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoIcon}>👤</span>
          <span className={styles.infoVal}>{job.targetAge}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoIcon}>📍</span>
          <span className={styles.infoVal}>{job.region}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoIcon}>📅</span>
          <span className={styles.infoVal}>{job.period}</span>
        </div>
      </div>

      {/* 연락처 */}
      <div className={styles.contactBox}>
        {job.contact ? (
          <>
            <span className={styles.contactIcon}>📞</span>
            <span className={styles.contactText}>{job.contact}</span>
            <a href={`tel:${job.contact.replace(/[^0-9]/g, '')}`} className={styles.callBtn}>
              전화하기
            </a>
          </>
        ) : (
          <>
            <span className={styles.contactIcon}>📞</span>
            <span className={styles.contactText}>
              {job.executingOrg || job.agencyName}
            </span>
            <span className={styles.contactHint}>에 직접 문의</span>
          </>
        )}
      </div>

      {/* 모집 현황 + 관심 버튼 */}
      <div className={styles.bottom}>
        <div className={styles.slotsInfo}>
          {job.slots > 0 ? (
            <span className={styles.slotsText}>
              목표 <strong>{job.slots.toLocaleString()}</strong>명
              {job.year ? ` · ${job.year}년 사업` : ''}
            </span>
          ) : (
            <span className={styles.slotsText}>모집 인원 문의</span>
          )}
        </div>
        <button
          className={`${styles.applyBtn} ${applied ? styles.applied : ''}`}
          onClick={onApply}
          disabled={applied}
        >
          {applied ? '관심 등록됨 ✓' : '관심 등록'}
        </button>
      </div>
    </div>
  )
}
