import styles from './BottomNav.module.css'

const SENIOR_TABS = [
  { id: 'home', icon: '🏠', label: '홈' },
  { id: 'history', icon: '📋', label: '이력' },
  { id: 'stats', icon: '📊', label: '통계' },
  { id: 'profile', icon: '👤', label: '내 정보' },
]

const EMPLOYER_TABS = [
  { id: 'home', icon: '🏠', label: '홈' },
  { id: 'post', icon: '✏️', label: '공고 올리기' },
  { id: 'manage', icon: '📊', label: '관리' },
]

export default function BottomNav({ tab, setTab, mode }) {
  const tabs = mode === 'senior' ? SENIOR_TABS : EMPLOYER_TABS
  return (
    <nav className={styles.nav}>
      {tabs.map(t => (
        <button
          key={t.id}
          className={`${styles.btn} ${tab === t.id ? styles.active : ''}`}
          onClick={() => setTab(t.id)}
        >
          <span className={styles.icon}>{t.icon}</span>
          <span className={styles.label}>{t.label}</span>
        </button>
      ))}
    </nav>
  )
}
