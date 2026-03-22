import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { MainPanel } from './MainPanel'

export function Shell() {
  const [mobileView, setMobileView] = useState<'sidebar' | 'inbox'>('inbox')

  return (
    <div className="shell" data-mobile-view={mobileView}>
      <Sidebar onNavigateToInbox={() => setMobileView('inbox')} />
      <MainPanel />
      <nav className="mobile-tab-bar">
        <button
          className={`mobile-tab ${mobileView === 'sidebar' ? 'mobile-tab--active' : ''}`}
          onClick={() => setMobileView('sidebar')}
        >
          <span className="mobile-tab-icon">☰</span>
          <span className="mobile-tab-label">Accounts</span>
        </button>
        <button
          className={`mobile-tab ${mobileView === 'inbox' ? 'mobile-tab--active' : ''}`}
          onClick={() => setMobileView('inbox')}
        >
          <span className="mobile-tab-icon">✉</span>
          <span className="mobile-tab-label">Inbox</span>
        </button>
      </nav>
    </div>
  )
}
