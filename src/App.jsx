import { useState } from 'react'
import SeniorHome from './pages/SeniorHome.jsx'
import EmployerHome from './pages/EmployerHome.jsx'
import JobDetail from './pages/JobDetail.jsx'
import QRComplete from './pages/QRComplete.jsx'
import LandingPage from './pages/LandingPage.jsx'

export default function App() {
  const [screen, setScreen] = useState('landing') // landing | senior | employer | job-detail | qr-complete
  const [mode, setMode] = useState(null) // 'senior' | 'employer'
  const [selectedJob, setSelectedJob] = useState(null)

  const nav = (to, data = null) => {
    setScreen(to)
    if (data) setSelectedJob(data)
    window.scrollTo(0, 0)
  }

  if (screen === 'landing') return <LandingPage onSelect={(m) => { setMode(m); nav(m) }} />
  if (screen === 'senior') return <SeniorHome nav={nav} />
  if (screen === 'employer') return <EmployerHome nav={nav} />
  if (screen === 'job-detail') return <JobDetail job={selectedJob} nav={nav} />
  if (screen === 'qr-complete') return <QRComplete job={selectedJob} nav={nav} />

  return null
}
