import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { useT } from '../../hooks/useT'
import { AccountCard } from '../accounts/AccountCard'
import { AccountInfo } from '../accounts/AccountInfo'
import { CreateAccountForm } from '../accounts/CreateAccountForm'
import { ThemePicker } from './ThemePicker'

export function Sidebar({ onNavigateToInbox }: { onNavigateToInbox?: () => void }) {
  const { accounts, activeAccountId, activeUser, clearActiveUser, setActiveAccount } = useApp()
  const [showCreate, setShowCreate] = useState(false)
  const activeAccount = accounts.find((a) => a.id === activeAccountId) ?? null
  const t = useT()

  const handleSelectAccount = (id: string) => {
    setActiveAccount(id)
    onNavigateToInbox?.()
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-logo">{t('tempbox')}</span>
        <button
          className="btn-new"
          onClick={() => setShowCreate((v) => !v)}
          title="New address"
        >
          {showCreate ? '✕' : '+'}
        </button>
      </div>

      {activeUser && (
        <button className="sidebar-user-badge" onClick={clearActiveUser} title="Switch user">
          <span className="sidebar-user-name">{activeUser.name}</span>
          <span className="sidebar-user-switch">⇄</span>
        </button>
      )}

      {showCreate && (
        <CreateAccountForm onCreated={() => setShowCreate(false)} />
      )}

      <div className="account-list">
        {accounts.length === 0 && !showCreate && (
          <div className="empty-accounts">
            <p>{t('No addresses yet.')}</p>
            <p>{t('Click')} <strong>+</strong> {t('to create one.')}</p>
          </div>
        )}
        {accounts.map((account, i) => (
          <AccountCard key={account.id} account={account} index={i} onSelect={() => handleSelectAccount(account.id)} />
        ))}
      </div>

      <ThemePicker />
      {activeAccount && <AccountInfo account={activeAccount} />}
    </aside>
  )
}
