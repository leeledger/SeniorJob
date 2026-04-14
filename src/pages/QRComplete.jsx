import { useEffect, useState } from 'react'
import styles from './QRComplete.module.css'

export default function QRComplete({ job, nav }) {
  const [step, setStep] = useState('qr') // qr | scanning | done

  useEffect(() => {
    if (step === 'scanning') {
      const t = setTimeout(() => setStep('done'), 2000)
      return () => clearTimeout(t)
    }
  }, [step])

  if (!job) return null

  return (
    <div className={styles.wrap}>
      {step === 'qr' && (
        <div className={styles.content}>
          <button className={styles.backBtn} onClick={() => nav('senior')}>← 홈으로</button>
          <div className={styles.title}>신청 완료!</div>
          <div className={styles.sub}>{job.company}에서 {job.dateLabel} 근무 확정</div>
          <div className={styles.infoCard}>
            <div className={styles.infoRow}><span>📍 장소</span><span>{job.address}</span></div>
            <div className={styles.infoRow}><span>🕐 시간</span><span>{job.timeSlot}</span></div>
            <div className={styles.infoRow}><span>💰 급여</span><span>{job.pay.toLocaleString()}원</span></div>
          </div>
          <div className={styles.qrSection}>
            <div className={styles.qrLabel}>퇴근 시 이 QR을 제시하세요</div>
            <div className={styles.qrBox}>
              <svg width="140" height="140" viewBox="0 0 140 140">
                <rect width="140" height="140" fill="white" rx="8"/>
                {/* QR 패턴 모의 */}
                <rect x="10" y="10" width="40" height="40" fill="none" stroke="#1A1814" strokeWidth="4" rx="4"/>
                <rect x="18" y="18" width="24" height="24" fill="#1A1814" rx="2"/>
                <rect x="90" y="10" width="40" height="40" fill="none" stroke="#1A1814" strokeWidth="4" rx="4"/>
                <rect x="98" y="18" width="24" height="24" fill="#1A1814" rx="2"/>
                <rect x="10" y="90" width="40" height="40" fill="none" stroke="#1A1814" strokeWidth="4" rx="4"/>
                <rect x="18" y="98" width="24" height="24" fill="#1A1814" rx="2"/>
                {[0,1,2,3,4].map(i => [0,1,2,3,4].map(j => (
                  (i + j) % 2 === 0 &&
                  <rect key={`${i}-${j}`} x={58 + j*8} y={58 + i*8} width="6" height="6" fill="#1A1814" rx="1"/>
                )))}
                <rect x="58" y="10" width="6" height="6" fill="#1A1814"/>
                <rect x="70" y="10" width="6" height="6" fill="#1A1814"/>
                <rect x="66" y="18" width="6" height="6" fill="#1A1814"/>
                <rect x="10" y="58" width="6" height="6" fill="#1A1814"/>
                <rect x="18" y="66" width="6" height="6" fill="#1A1814"/>
                <rect x="10" y="74" width="6" height="6" fill="#1A1814"/>
              </svg>
            </div>
            <div className={styles.qrHint}>퇴근 후 → QR 스캔 → 즉시 입금</div>
          </div>
          <button className={styles.simulateBtn} onClick={() => setStep('scanning')}>
            🔍 QR 스캔 시뮬레이션
          </button>
        </div>
      )}

      {step === 'scanning' && (
        <div className={styles.scanWrap}>
          <div className={styles.scanAnim}></div>
          <div className={styles.scanText}>QR 스캔 중...</div>
        </div>
      )}

      {step === 'done' && (
        <div className={styles.doneWrap}>
          <div className={styles.checkCircle}>✓</div>
          <div className={styles.doneTitle}>입금 완료!</div>
          <div className={styles.doneAmount}>{job.pay.toLocaleString()}원</div>
          <div className={styles.doneSub}>카카오페이 계좌로 입금됐어요</div>
          <div className={styles.doneCard}>
            <div className={styles.doneRow}>
              <span>근무지</span><span>{job.company}</span>
            </div>
            <div className={styles.doneRow}>
              <span>업무</span><span>{job.task}</span>
            </div>
            <div className={styles.doneRow}>
              <span>근무 시간</span><span>{job.hours}시간</span>
            </div>
            <div className={styles.doneRow}>
              <span>입금액</span><span className={styles.donePayVal}>{job.pay.toLocaleString()}원</span>
            </div>
          </div>
          <div className={styles.ratingSection}>
            <div className={styles.ratingTitle}>근무는 어땠나요?</div>
            <div className={styles.stars}>
              {[1,2,3,4,5].map(s => <span key={s} className={styles.star}>★</span>)}
            </div>
          </div>
          <button className={styles.homeBtn} onClick={() => nav('senior')}>홈으로 돌아가기</button>
        </div>
      )}
    </div>
  )
}
