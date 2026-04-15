import { useState } from 'react'
import styles from './PublicJobDetail.module.css'

const TYPE_COLOR = {
  '공공형':       '#15803D',
  '시장형':       '#1D4ED8',
  '사회서비스형': '#9333EA',
  '인력파견형':   '#B45309',
  '취업알선형':   '#0E7490',
  '기타':         '#374151',
}

export default function PublicJobDetail({ job, nav, onBack }) {
  const [interested, setInterested] = useState(false)

  if (!job) return null

  const typeColor = job.color || TYPE_COLOR[job.type] || '#374151'
  const handleBack = onBack ?? (() => nav('back'))

  return (
    <div className={styles.wrap}>
      {/* 헤더 */}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={handleBack}>← 뒤로</button>
        <span
          className={styles.typePill}
          style={{ background: typeColor + '18', color: typeColor, borderColor: typeColor + '40' }}
        >
          {job.type}
        </span>
      </div>

      {/* 히어로 */}
      <div className={styles.hero} style={{ borderBottom: `4px solid ${typeColor}` }}>
        <div className={styles.govBadge}>
          <span>🏛</span>
          <span>한국노인인력개발원 공식 사업</span>
        </div>
        <div className={styles.programName}>{job.programName}</div>
        {job.executingOrg && (
          <div className={styles.orgName}>수행기관 · {job.executingOrg}</div>
        )}
        {job.distance && (
          <div className={styles.distBadge}>📍 내 위치에서 {job.distance}</div>
        )}
      </div>

      {/* 핵심 정보 바 */}
      <div className={styles.infoBar}>
        <div className={styles.infoItem}>
          <div className={styles.infoLabel}>대상 연령</div>
          <div className={styles.infoVal}>{job.targetAge}</div>
        </div>
        <div className={styles.infoDiv} />
        <div className={styles.infoItem}>
          <div className={styles.infoLabel}>모집 인원</div>
          <div className={styles.infoVal}>{job.slots > 0 ? `${job.slots.toLocaleString()}명` : '문의'}</div>
        </div>
        <div className={styles.infoDiv} />
        <div className={styles.infoItem}>
          <div className={styles.infoLabel}>사업 연도</div>
          <div className={styles.infoVal}>{job.year ? `${job.year}년` : '–'}</div>
        </div>
      </div>

      {/* 사업 기간 */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>사업 기간</div>
        <div className={styles.infoRow}>
          <span className={styles.rowIcon}>📅</span>
          <span>{job.period}</span>
        </div>
      </div>

      {/* 활동 지역 */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>활동 지역</div>
        <div className={styles.infoRow}>
          <span className={styles.rowIcon}>📍</span>
          <span>{job.region}</span>
        </div>
      </div>

      {/* 급여/활동비 */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>급여 / 활동비</div>
        <div className={styles.infoRow}>
          <span className={styles.rowIcon}>💰</span>
          <span>{job.pay != null ? `월 ${job.pay.toLocaleString()}원` : '수행기관에 문의'}</span>
        </div>
        {job.hours && (
          <div className={styles.infoRow}>
            <span className={styles.rowIcon}>⏰</span>
            <span>주 {job.hours}시간</span>
          </div>
        )}
      </div>

      {/* 공공 일자리 안내 */}
      <div className={styles.noticeBox}>
        <div className={styles.noticeTitle}>📋 공공 일자리란?</div>
        <div className={styles.noticeDesc}>
          한국노인인력개발원이 운영하는 노인일자리 사업으로, 지역 수행기관을 통해 신청할 수 있습니다.
          온라인 신청 후 기관 담당자가 안내해 드립니다.
        </div>
      </div>

      {/* 연락처 / 신청 방법 */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>문의 및 신청</div>
        {job.contact ? (
          <div className={styles.contactBox}>
            <div className={styles.contactRow}>
              <span className={styles.rowIcon}>📞</span>
              <span className={styles.contactNum}>{job.contact}</span>
            </div>
            <a
              href={`tel:${job.contact.replace(/[^0-9]/g, '')}`}
              className={styles.callBtn}
            >
              📞 전화 연결하기
            </a>
          </div>
        ) : (
          <div className={styles.contactBox}>
            <div className={styles.contactRow}>
              <span className={styles.rowIcon}>🏛</span>
              <span>{job.executingOrg || job.agencyName}</span>
            </div>
            <div className={styles.contactHint}>수행기관에 직접 방문 또는 전화 문의</div>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className={styles.cta}>
        <button
          className={`${styles.interestBtn} ${interested ? styles.interested : ''}`}
          onClick={() => setInterested(true)}
          disabled={interested}
        >
          {interested ? '관심 등록 완료 ✓' : '관심 등록하기'}
        </button>
        {job.contact && (
          <a
            href={`tel:${job.contact.replace(/[^0-9]/g, '')}`}
            className={styles.callBtnLarge}
          >
            📞 전화로 신청하기
          </a>
        )}
        <p className={styles.ctaSub}>60세 이상 · 한국노인인력개발원 공식 사업</p>
      </div>
    </div>
  )
}
