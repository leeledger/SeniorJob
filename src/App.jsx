import { useState, useEffect } from 'react'
import SeniorHome from './pages/SeniorHome.jsx'
import EmployerHome from './pages/EmployerHome.jsx'
import JobDetail from './pages/JobDetail.jsx'
import QRComplete from './pages/QRComplete.jsx'
import LandingPage from './pages/LandingPage.jsx'
import StatsPage from './pages/StatsPage.jsx'
import PublicJobDetail from './pages/PublicJobDetail.jsx'

export default function App() {
  // 히스토리 스택 — back()은 스택에서 pop
  const [history, setHistory] = useState(['landing'])
  const [selectedJob, setSelectedJob] = useState(null)

  const screen = history[history.length - 1]

  const nav = (to, data = null, { reset = false } = {}) => {
    if (data !== null) setSelectedJob(data)

    if (to === 'back') {
      setHistory(prev => prev.length > 1 ? prev.slice(0, -1) : prev)
      return
    }

    // reset: 특정 화면으로 히스토리 초기화 (예: QR완료 후 홈으로)
    setHistory(prev => reset ? ['landing', to] : [...prev, to])
    window.scrollTo(0, 0)
  }

  // 브라우저/모바일 뒤로가기 버튼 인터셉트
  useEffect(() => {
    window.history.pushState(null, '')

    const handlePopstate = () => {
      window.history.pushState(null, '') // 앱을 떠나지 않도록 유지
      setHistory(prev => prev.length > 1 ? prev.slice(0, -1) : prev)
    }

    window.addEventListener('popstate', handlePopstate)
    return () => window.removeEventListener('popstate', handlePopstate)
  }, [])

  if (screen === 'landing')          return <LandingPage onSelect={(m) => nav(m)} nav={nav} />
  if (screen === 'senior')           return <SeniorHome nav={nav} />
  if (screen === 'employer')         return <EmployerHome nav={nav} />
  if (screen === 'job-detail')       return <JobDetail job={selectedJob} nav={nav} />
  if (screen === 'qr-complete')      return <QRComplete job={selectedJob} nav={nav} />
  if (screen === 'stats')            return <StatsPage nav={nav} />
  if (screen === 'public-job-detail') return <PublicJobDetail job={selectedJob} nav={nav} />

  return null
}
