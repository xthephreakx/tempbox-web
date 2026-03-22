import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { copyToClipboard } from '../../lib/utils'
import type { StoredAccount } from '../../types'

interface Props {
  account: StoredAccount
  index: number
  onSelect?: () => void
}

export function AccountCard({ account, index, onSelect }: Props) {
  const { activeAccountId, setActiveAccount, removeAccount } = useApp()
  const isActive = activeAccountId === account.id
  const [copied, setCopied] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await copyToClipboard(account.address)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm(`Delete ${account.address}?`)) return
    setDeleting(true)
    await removeAccount(account.id)
  }

  return (
    <div
      className={`account-card ${isActive ? 'account-card--active' : ''}`}
      style={{ animationDelay: `${index * 60}ms` }}
      onClick={() => { setActiveAccount(account.id); onSelect?.() }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') { setActiveAccount(account.id); onSelect?.() } }}
    >
      <div className="account-card-address">{account.address}</div>
      <div className="account-card-actions">
        <button
          className={`icon-btn ${copied ? 'icon-btn--success' : ''}`}
          onClick={handleCopy}
          title="Copy address"
        >
          {copied ? '✓' : '⎘'}
        </button>
        <button
          className="icon-btn icon-btn--danger"
          onClick={handleDelete}
          disabled={deleting}
          title="Delete address"
        >
          {deleting ? '…' : '⌫'}
        </button>
      </div>
    </div>
  )
}
