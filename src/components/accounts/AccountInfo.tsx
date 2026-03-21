import { useState, useEffect } from 'react'
import type { StoredAccount, Account } from '../../types'
import { getAccount } from '../../lib/api'
import { copyToClipboard } from '../../lib/utils'
import { useApp } from '../../context/AppContext'
import { useT } from '../../hooks/useT'

interface Props {
  account: StoredAccount
}

export function AccountInfo({ account }: Props) {
  const { removeAccount } = useApp()
  const t = useT()
  const [info, setInfo] = useState<Account | null>(null)
  const [pwCopied, setPwCopied] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Verwijder ${account.address}?`)) return
    setDeleting(true)
    await removeAccount(account.id)
  }

  useEffect(() => {
    setInfo(null)
    getAccount(account.id, account.token)
      .then(setInfo)
      .catch(() => {})
  }, [account.id])

  const handleCopyPassword = async () => {
    await copyToClipboard(account.password)
    setPwCopied(true)
    setTimeout(() => setPwCopied(false), 1500)
  }

  const isActive = info ? !info.isDisabled && !info.isDeleted : null
  const quotaUsed = info?.used ?? 0
  const quotaTotal = info?.quota ?? 40000000
  const quotaPct = Math.min(100, (quotaUsed / quotaTotal) * 100)
  const fmtBytes = (b: number) => {
    if (b === 0) return '0 KB'
    if (b < 1024 * 1024) return `${Math.round(b / 1024)} KB`
    return `${(b / 1024 / 1024).toFixed(1)} MB`
  }

  return (
    <div className="account-info">
      <div className="account-info-title">{t('Account info')}</div>
      <div className="account-info-address">{account.address}</div>

      <div className="account-info-row">
        <span className="account-info-label">{t('Status')}</span>
        <span className={`account-info-status ${isActive === null ? '' : isActive ? 'account-info-status--active' : 'account-info-status--inactive'}`}>
          <span className="status-dot" />
          {isActive === null ? '…' : isActive ? t('Active') : t('Inactive')}
        </span>
      </div>

      <div className="account-info-row">
        <span className="account-info-label">{t('Password')}</span>
        <div className="account-info-pw">
          <span className="account-info-pw-value">••••••••••••</span>
          <button
            className={`icon-btn ${pwCopied ? 'icon-btn--success' : ''}`}
            onClick={handleCopyPassword}
            title="Copy password"
          >
            {pwCopied ? '✓' : '⎘'}
          </button>
        </div>
      </div>

      <div className="account-info-quota">
        <div className="account-info-quota-header">
          <span className="account-info-label">{t('Quota')}</span>
          <span className="account-info-quota-value">
            {fmtBytes(quotaUsed)} / {fmtBytes(quotaTotal)}
          </span>
        </div>
        <div className="quota-bar">
          <div
            className={`quota-bar-fill ${quotaPct > 80 ? 'quota-bar-fill--warn' : ''}`}
            style={{ width: `${quotaPct}%` }}
          />
        </div>
      </div>

      <button
        className="account-delete-btn"
        onClick={handleDelete}
        disabled={deleting}
      >
        {deleting ? t('Verwijderen…') : t('⌫ Verwijder adres')}
      </button>
    </div>
  )
}
