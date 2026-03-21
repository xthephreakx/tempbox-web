import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { useAccounts } from '../../hooks/useAccounts'
import { useT } from '../../hooks/useT'

export function AccountPicker() {
  const { accounts, domains, setActiveAccount } = useApp()
  const { creating, createError, create } = useAccounts()
  const t = useT()
  const [prefix, setPrefix] = useState('')
  const [showCreate, setShowCreate] = useState(accounts.length === 0)

  const handleCreate = async () => {
    const domain = domains[0]
    if (!domain) return
    const result = await create({
      usernamePrefix: prefix,
      domainId: domain.id,
      domainName: domain.domain,
    })
    if (result) setShowCreate(false)
  }

  return (
    <div className="account-picker-overlay">
      <div className="account-picker">
        <div className="account-picker-logo">TEMPBOX</div>
        <p className="account-picker-sub">
          {t('Choose an inbox or create a new one')}
        </p>

        {accounts.length > 0 && (
          <div className="account-picker-list">
            {accounts.map((acc) => (
              <button
                key={acc.id}
                className="account-picker-item"
                onClick={() => setActiveAccount(acc.id)}
              >
                <span className="account-picker-addr">{acc.address}</span>
                <span className="account-picker-arrow">→</span>
              </button>
            ))}
          </div>
        )}

        {!showCreate && (
          <button
            className="account-picker-new"
            onClick={() => setShowCreate(true)}
          >
            + {t('Create new address')}
          </button>
        )}

        {showCreate && (
          <div className="account-picker-create">
            <input
              className="account-picker-input"
              type="text"
              placeholder={t('prefix (optional)')}
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              autoFocus
            />
            <div className="account-picker-actions">
              <button
                className="account-picker-btn-create"
                onClick={handleCreate}
                disabled={creating || domains.length === 0}
              >
                {creating ? t('Creating…') : t('Create')}
              </button>
              {accounts.length > 0 && (
                <button
                  className="account-picker-btn-cancel"
                  onClick={() => setShowCreate(false)}
                >
                  {t('Cancel')}
                </button>
              )}
            </div>
            {createError && (
              <p className="account-picker-error">{createError}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
