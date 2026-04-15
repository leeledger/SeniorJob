import styles from './StatsPage.module.css'

/* ── 공통 차트 컴포넌트 ── */
function Bar({ label, value, max = 100, color = 'var(--accent)', suffix = '%', sublabel }) {
  const pct = Math.round((value / max) * 100)
  return (
    <div className={styles.barRow}>
      <div className={styles.barLabel}>{label}</div>
      <div className={styles.barTrack}>
        <div
          className={styles.barFill}
          style={{ width: `${pct}%`, background: color }}
        >
          <span className={styles.barVal}>{value}{suffix}</span>
        </div>
      </div>
      {sublabel && <div className={styles.barSub}>{sublabel}</div>}
    </div>
  )
}

function StatCard({ num, unit = '', label, color = 'var(--accent)', note }) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statNum} style={{ color }}>
        {num}<span className={styles.statUnit}>{unit}</span>
      </div>
      <div className={styles.statLabel}>{label}</div>
      {note && <div className={styles.statNote}>{note}</div>}
    </div>
  )
}

function Section({ badge, badgeColor = 'var(--accent)', title, children }) {
  return (
    <section className={styles.section}>
      <div className={styles.sectionBadge} style={{ background: badgeColor + '18', color: badgeColor, borderColor: badgeColor + '40' }}>
        {badge}
      </div>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {children}
    </section>
  )
}

/* ── 메인 컴포넌트 ── */
export default function StatsPage({ nav, embedded = false }) {
  return (
    <div className={`${styles.wrap} ${embedded ? styles.embedded : ''}`}>

      {/* 헤더 */}
      <div className={styles.hero}>
        {!embedded && (
          <button className={styles.backBtn} onClick={() => nav('landing')}>
            ← 돌아가기
          </button>
        )}
        <div className={styles.heroTag}>통계로 보는 시니어잡</div>
        <h1 className={styles.heroTitle}>
          일하고 싶은 마음은<br />
          <span>어디로 가는가</span>
        </h1>
        <p className={styles.heroSub}>
          통계청 · OECD · 국민연금연구원 데이터로 본<br />
          시니어 단기 일자리 플랫폼의 필요성
        </p>
      </div>

      {/* ── Section 1: 초고령사회 ── */}
      <Section badge="📈 인구 구조" badgeColor="#2563EB" title="대한민국은 이미 초고령사회">
        <p className={styles.desc}>
          2025년, 65세 이상 인구가 전체의 <strong>20.3%</strong>를 넘어서며
          공식적으로 초고령사회에 진입했습니다. 이 흐름은 멈추지 않습니다.
        </p>
        <div className={styles.timeline}>
          {[
            { year: '2025', pct: 20.3, label: '초고령사회 진입', now: true },
            { year: '2036', pct: 30.0, label: '전망', now: false },
            { year: '2050', pct: 40.0, label: '전망', now: false },
          ].map(({ year, pct, label, now }) => (
            <div key={year} className={`${styles.timelineItem} ${now ? styles.timelineNow : ''}`}>
              <div className={styles.timelineYear}>{year}</div>
              <div className={styles.timelineBar}>
                <div className={styles.timelineFill} style={{ height: `${pct * 2.5}px`, background: now ? '#2563EB' : '#93C5FD' }} />
              </div>
              <div className={styles.timelinePct}>{pct}%</div>
              <div className={styles.timelineLabel}>{label}</div>
            </div>
          ))}
        </div>
        <div className={styles.sourceTag}>출처: 통계청 장래인구추계</div>
      </Section>

      {/* ── Section 2: 일하고 싶은 시니어 ── */}
      <Section badge="💼 근로 희망" badgeColor="var(--accent)" title="시니어 10명 중 7명은 계속 일하고 싶다">
        <p className={styles.desc}>
          55~79세 고령층의 <strong>69.4%</strong>가 앞으로도 계속 일하기를 희망합니다.
          희망 근로 연령은 평균 <strong>73.4세</strong>로 역대 최고치입니다.
        </p>

        <div className={styles.bigBarWrap}>
          <div className={styles.bigBarLabel}>일하기 희망하는 시니어</div>
          <div className={styles.bigBarTrack}>
            <div className={styles.bigBarFill} style={{ width: '69.4%' }}>
              <span>69.4%</span>
            </div>
            <div className={styles.bigBarRest}>
              <span>30.6%</span>
            </div>
          </div>
          <div className={styles.bigBarLegend}>
            <span className={styles.legendDot} style={{ background: 'var(--accent)' }} />희망
            <span className={styles.legendDot} style={{ background: '#E5E7EB', marginLeft: 12 }} />비희망
          </div>
        </div>

        <div className={styles.cardGrid}>
          <StatCard num="73.4" unit="세" label="평균 희망 근로 연령" note="역대 최고치" />
          <StatCard num="54.4" unit="%" label="근로 희망 이유 1위" note="생활비에 보탬" color="#D97706" />
        </div>
        <div className={styles.callout}>
          <span className={styles.calloutIcon}>💬</span>
          취미나 사회참여가 아닌, <strong>생존과 직결된 이유</strong>로 일을 원하고 있습니다.
        </div>
        <div className={styles.sourceTag}>출처: 통계청 경제활동인구조사 고령층 부가조사 2025</div>
      </Section>

      {/* ── Section 3: 연금 갭 ── */}
      <Section badge="💰 경제적 현실" badgeColor="#DC2626" title="연금만으로는 살 수 없다">
        <p className={styles.desc}>
          월평균 연금 <strong>86만원</strong>은 최소 생활비 <strong>136만원</strong>의
          63%에 불과합니다. 매달 <strong>50만원</strong>이 부족합니다.
        </p>

        <div className={styles.gapWrap}>
          <div className={styles.gapRow}>
            <div className={styles.gapLabel}>월평균 연금</div>
            <div className={styles.gapBarTrack}>
              <div className={styles.gapBarFill} style={{ width: '63.2%', background: '#DC2626' }} />
            </div>
            <div className={styles.gapAmt} style={{ color: '#DC2626' }}>86만원</div>
          </div>
          <div className={styles.gapRow}>
            <div className={styles.gapLabel}>최소 생활비</div>
            <div className={styles.gapBarTrack}>
              <div className={styles.gapBarFill} style={{ width: '100%', background: '#374151' }} />
            </div>
            <div className={styles.gapAmt} style={{ color: '#374151' }}>136만원</div>
          </div>
          <div className={styles.gapMarker}>
            <div className={styles.gapArrow}>↑ 매달 50만원 부족</div>
          </div>
        </div>

        <div className={styles.oecdBox}>
          <div className={styles.oecdTitle}>🌏 OECD 은퇴연령층 상대적 빈곤율</div>
          <Bar label="한국" value={39.8} color="#DC2626" sublabel="OECD 회원국 중 1위" />
          <Bar label="OECD 평균" value={14.2} color="#9CA3AF" sublabel="한국의 1/3 수준" />
          <div className={styles.oecdNote}>
            한국은 OECD 평균의 <strong style={{ color: '#DC2626' }}>2.8배</strong> — 고령층 10명 중 4명이 빈곤선 이하
          </div>
        </div>
        <div className={styles.sourceTag}>출처: 국민연금연구원 2024 · OECD Pensions at a Glance 2023</div>
      </Section>

      {/* ── Section 4: 구직 수단 문제 ── */}
      <Section badge="🔍 구직 수단" badgeColor="#D97706" title="연결 수단이 없다">
        <p className={styles.desc}>
          고령층의 구직 경로 중 <strong>67.5%</strong>가 공공 취업알선과 지인 소개에 의존합니다.
          시니어를 위한 디지털 매칭 플랫폼은 사실상 존재하지 않습니다.
        </p>

        <div className={styles.routeWrap}>
          {[
            { label: '공공 취업알선기관', pct: 36.5, color: '#6B7280' },
            { label: '친구·친지 소개', pct: 31.0, color: '#9CA3AF' },
            { label: '직업정보 제공 사이트', pct: 11.8, color: '#D1D5DB' },
            { label: '디지털 전용 매칭 앱', pct: 0.0, color: '#FEE2E2', textColor: '#DC2626', note: '사실상 없음' },
          ].map(({ label, pct, color, textColor, note }) => (
            <div key={label} className={styles.routeRow}>
              <div className={styles.routeLabel}>{label}</div>
              <div className={styles.routeBarTrack}>
                {pct > 0 ? (
                  <div className={styles.routeBarFill} style={{ width: `${pct}%`, background: color }}>
                    <span style={{ color: textColor }}>{pct}%</span>
                  </div>
                ) : (
                  <div className={styles.routeBarFill} style={{ width: '8%', background: color, border: '1.5px dashed #DC2626' }}>
                    <span style={{ color: '#DC2626', fontSize: '0.68rem' }}>{note}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.callout} style={{ borderLeftColor: '#D97706', background: '#FFFBEB' }}>
          <span className={styles.calloutIcon}>⚠️</span>
          일하고 싶은 시니어의 구직 수단이 <strong>20년 전 수준</strong>에 머물러 있습니다.
        </div>

        <div className={styles.retireNote}>
          <strong>평균 퇴직 연령 52.9세 → 희망 근로 연령 73.4세</strong><br />
          <span>약 20년의 공백을 메울 디지털 인프라가 없습니다</span>
        </div>
        <div className={styles.sourceTag}>출처: 통계청 경제활동인구조사 고령층 부가조사 2025</div>
      </Section>

      {/* ── Section 5: 해외 사례 ── */}
      <Section badge="🇯🇵 해외 사례" badgeColor="#7C3AED" title="일본은 이미 해답을 찾았다">
        <p className={styles.desc}>
          일본의 <strong>타이미(Timee)</strong>는 '스키마바이토(빈틈 아르바이트)' 개념으로
          단기 일자리 매칭 문제를 해결했습니다.
        </p>
        <div className={styles.timeeGrid}>
          <div className={styles.timeeCard}>
            <div className={styles.timeeNum}>1,400만</div>
            <div className={styles.timeeLabel}>가입자 수<br />(2024년 기준)</div>
          </div>
          <div className={styles.timeeFeatures}>
            {[
              { icon: '🚀', text: '면접 없이 바로 신청' },
              { icon: '⚡', text: '당일 일하고 당일 정산' },
              { icon: '📍', text: '현재 위치 주변 일자리' },
            ].map(({ icon, text }) => (
              <div key={text} className={styles.timeeFeature}>
                <span>{icon}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.callout} style={{ borderLeftColor: '#7C3AED', background: '#F5F3FF' }}>
          <span className={styles.calloutIcon}>💡</span>
          <span>단시간·유연 근무에 대한 <strong>수요는 충분</strong>했습니다.
          그것을 연결할 <strong>플랫폼만 없었을 뿐</strong>입니다.</span>
        </div>
        <div className={styles.sourceTag}>출처: Timee Inc. IR 자료 2024</div>
      </Section>

      {/* ── Section 6: 결론 & 시니어잡 ── */}
      <Section badge="✅ 해결책" badgeColor="var(--accent)" title="시니어잡이 연결합니다">
        <div className={styles.conclusionGrid}>
          {[
            { icon: '📊', label: '수요는 충분', desc: '69.4%가 일하기 원하며, 이유는 생활비 부족(54.4%)' },
            { icon: '💸', label: '경제적 필요', desc: '연금 86만원, 최소 생활비 136만원 — 매달 50만원 부족' },
            { icon: '🔗', label: '연결 수단 없음', desc: '구직경로 67.5%가 오프라인 · 디지털 매칭 플랫폼 부재' },
          ].map(({ icon, label, desc }) => (
            <div key={label} className={styles.conclusionCard}>
              <div className={styles.conclusionIcon}>{icon}</div>
              <div className={styles.conclusionLabel}>{label}</div>
              <div className={styles.conclusionDesc}>{desc}</div>
            </div>
          ))}
        </div>

        <div className={styles.featureStrip}>
          {[
            { icon: '🚀', title: '면접 없음', desc: '신청 즉시 매칭' },
            { icon: '⚡', title: '당일 신청', desc: '오늘 일자리, 오늘 출근' },
            { icon: '💰', title: '당일 정산', desc: 'QR 퇴근 후 즉시 입금' },
            { icon: '📍', title: '위치 기반', desc: '내 주변 가까운 순 정렬' },
            { icon: '🏛', title: '공공 연계', desc: '한국노인인력개발원 API 통합' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className={styles.featureItem}>
              <span className={styles.featureIcon}>{icon}</span>
              <div className={styles.featureTitle}>{title}</div>
              <div className={styles.featureDesc}>{desc}</div>
            </div>
          ))}
        </div>

        {!embedded && (
          <div className={styles.ctaRow}>
            <button className={styles.ctaBtn} onClick={() => nav('senior')}>
              시니어로 시작하기 →
            </button>
            <button className={`${styles.ctaBtn} ${styles.ctaBtnSecondary}`} onClick={() => nav('employer')}>
              고용주로 시작하기 →
            </button>
          </div>
        )}
      </Section>

      {/* ── 데이터 출처 ── */}
      <div className={styles.sources}>
        <div className={styles.sourcesTitle}>📚 데이터 출처</div>
        {[
          '통계청 — 2025년 5월 경제활동인구조사 고령층 부가조사',
          '통계청 — 2025 고령자 통계',
          '통계청 — 장래인구추계',
          '국민연금연구원 — 적정 노후생활비 연구 2024',
          'OECD — Pensions at a Glance 2023',
          'Timee Inc. — IR 자료 2024',
        ].map((s, i) => (
          <div key={i} className={styles.sourceItem}>{i + 1}. {s}</div>
        ))}
      </div>

    </div>
  )
}
