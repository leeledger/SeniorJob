import styles from './LandingPage.module.css'

export default function LandingPage({ onSelect, nav }) {
  return (
    <div className={styles.wrap}>

      {/* ── Hero ── */}
      <div className={styles.hero}>
        <div className={styles.heroBadge}>🇰🇷 통계로 증명된 플랫폼</div>
        <h1 className={styles.heroTitle}>
          일하고 싶은 마음,<br />
          <span>이어드립니다</span>
        </h1>
        <p className={styles.heroSub}>
          시니어 10명 중 7명은 계속 일하기를 원합니다.<br />
          연결할 플랫폼만 없었을 뿐입니다.
        </p>

        {/* 핵심 통계 3개 */}
        <div className={styles.heroStats}>
          <div className={styles.heroStat}>
            <div className={styles.heroStatNum}>69.4%</div>
            <div className={styles.heroStatLabel}>시니어 근로 희망</div>
          </div>
          <div className={styles.heroStatDiv} />
          <div className={styles.heroStat}>
            <div className={styles.heroStatNum}>50만원</div>
            <div className={styles.heroStatLabel}>월 연금 부족분</div>
          </div>
          <div className={styles.heroStatDiv} />
          <div className={styles.heroStat}>
            <div className={styles.heroStatNum}>39.8%</div>
            <div className={styles.heroStatLabel}>OECD 빈곤율 1위</div>
          </div>
        </div>
      </div>

      {/* ── 문제 스트립 ── */}
      <div className={styles.problemStrip}>
        <div className={styles.problemItem}>
          <span className={styles.problemIcon}>😰</span>
          <div>
            <div className={styles.problemTitle}>연금만으론 부족</div>
            <div className={styles.problemDesc}>월 86만원 vs 최소생활비 136만원</div>
          </div>
        </div>
        <div className={styles.problemItem}>
          <span className={styles.problemIcon}>🔍</span>
          <div>
            <div className={styles.problemTitle}>구직 수단이 없음</div>
            <div className={styles.problemDesc}>67.5%가 공공기관·지인에만 의존</div>
          </div>
        </div>
        <div className={styles.problemItem}>
          <span className={styles.problemIcon}>⏳</span>
          <div>
            <div className={styles.problemTitle}>20년의 공백</div>
            <div className={styles.problemDesc}>퇴직 52.9세 → 희망근로 73.4세</div>
          </div>
        </div>
      </div>

      {/* ── 시니어잡 솔루션 ── */}
      <div className={styles.solutionWrap}>
        <div className={styles.solutionLabel}>시니어잡이 해결합니다</div>
        <div className={styles.featureGrid}>
          {[
            { icon: '🚀', title: '면접 없음', desc: '신청 즉시 매칭' },
            { icon: '⚡', title: '당일 시작', desc: '오늘 일자리, 오늘 출근' },
            { icon: '💰', title: '당일 정산', desc: 'QR 퇴근 후 즉시 입금' },
            { icon: '📍', title: '위치 기반', desc: '내 주변 가까운 순' },
            { icon: '🏛', title: '공공 연계', desc: '노인인력개발원 통합' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className={styles.featureItem}>
              <span className={styles.featureIcon}>{icon}</span>
              <div className={styles.featureTitle}>{title}</div>
              <div className={styles.featureDesc}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 역할 선택 카드 ── */}
      <div className={styles.cards}>
        <button className={styles.card} onClick={() => onSelect('senior')}>
          <div className={styles.cardIcon}>👴</div>
          <div className={styles.cardTitle}>일자리 찾기</div>
          <div className={styles.cardDesc}>근처 단기 일자리를 찾고<br />당일 바로 일하세요</div>
          <div className={styles.timeeRow}>
            <span className={styles.timeeBadge}>🚀 면접 없음</span>
            <span className={styles.timeeBadge}>⚡ 당일 정산</span>
          </div>
          <div className={styles.cardCta}>시작하기 →</div>
        </button>

        <button className={`${styles.card} ${styles.cardEmployer}`} onClick={() => onSelect('employer')}>
          <div className={styles.cardIcon}>🏪</div>
          <div className={styles.cardTitle}>인력 구하기</div>
          <div className={styles.cardDesc}>공고 등록하고 검증된<br />시니어 인력을 매칭받으세요</div>
          <div className={styles.timeeRow}>
            <span className={`${styles.timeeBadge} ${styles.timeeBadgeBlue}`}>📍 위치 기반</span>
            <span className={`${styles.timeeBadge} ${styles.timeeBadgeBlue}`}>✓ 즉시 매칭</span>
          </div>
          <div className={styles.cardCta}>공고 올리기 →</div>
        </button>
      </div>

      {/* ── 통계 보기 링크 ── */}
      {nav && (
        <button className={styles.statsLink} onClick={() => nav('stats')}>
          📊 통계로 보는 시니어잡 필요성 →
        </button>
      )}

      {/* ── 일본 벤치마크 ── */}
      <div className={styles.benchmarkBox}>
        <div className={styles.benchmarkTitle}>🇯🇵 일본 타이미(Timee)의 증명</div>
        <div className={styles.benchmarkDesc}>
          동일한 개념으로 <strong>1,400만 가입자</strong>를 확보한<br />
          단기 일자리 매칭 플랫폼. 한국엔 아직 없습니다.
        </div>
      </div>

      <p className={styles.source}>출처: 통계청 경제활동인구조사 고령층 부가조사 2025 · OECD 2023</p>
    </div>
  )
}
