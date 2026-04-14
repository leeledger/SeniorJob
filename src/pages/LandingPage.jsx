import styles from './LandingPage.module.css'

export default function LandingPage({ onSelect }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.hero}>
        <div className={styles.badge}>시니어잡 SeniorJob</div>
        <h1 className={styles.title}>
          일하고 싶은 마음,<br />
          <span>이어드립니다</span>
        </h1>
        <p className={styles.sub}>
          면접 없이, 당일 입금.<br />
          내 페이스대로 일하는 시니어 단기 일자리
        </p>
      </div>

      <div className={styles.cards}>
        <button className={styles.card} onClick={() => onSelect('senior')}>
          <div className={styles.cardIcon}>👴</div>
          <div className={styles.cardTitle}>일자리 찾기</div>
          <div className={styles.cardDesc}>근처 단기 일자리를 찾고<br />당일 바로 일하세요</div>
          <div className={styles.cardCta}>시작하기 →</div>
        </button>

        <button className={`${styles.card} ${styles.cardEmployer}`} onClick={() => onSelect('employer')}>
          <div className={styles.cardIcon}>🏪</div>
          <div className={styles.cardTitle}>인력 구하기</div>
          <div className={styles.cardDesc}>공고 등록하고 검증된<br />시니어 인력을 매칭받으세요</div>
          <div className={styles.cardCta}>공고 올리기 →</div>
        </button>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statNum}>69.4%</span>
          <span className={styles.statLabel}>시니어 근로 희망률</span>
        </div>
        <div className={styles.statDiv}></div>
        <div className={styles.stat}>
          <span className={styles.statNum}>73.4세</span>
          <span className={styles.statLabel}>평균 희망 근로 연령</span>
        </div>
        <div className={styles.statDiv}></div>
        <div className={styles.stat}>
          <span className={styles.statNum}>당일</span>
          <span className={styles.statLabel}>QR 퇴근 후 즉시 입금</span>
        </div>
      </div>

      <p className={styles.source}>출처: 통계청 경제활동인구조사 고령층 부가조사 2025</p>
    </div>
  )
}
