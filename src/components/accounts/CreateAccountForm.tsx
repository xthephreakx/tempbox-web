import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { useAccounts } from '../../hooks/useAccounts'
import { useT } from '../../hooks/useT'

interface Props {
  onCreated: () => void
}

export function CreateAccountForm({ onCreated }: Props) {
  const { domains } = useApp()
  const { creating, createError, create } = useAccounts()
  const t = useT()
  const [prefix, setPrefix] = useState('')
  const [selectedDomainId, setSelectedDomainId] = useState('')

  const activeDomains = domains.filter((d) => d.isActive)
  const selectedDomain = activeDomains.find((d) => d.id === selectedDomainId) ?? activeDomains[0]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDomain) return
    const result = await create({
      usernamePrefix: prefix,
      domainId: selectedDomain.id,
      domainName: selectedDomain.domain,
    })
    if (result) {
      setPrefix('')
      onCreated()
    }
  }

  return (
    <form className="create-form" onSubmit={handleSubmit}>
      <div className="create-form-row">
        <input
          className="create-form-input"
          type="text"
          placeholder={t('username (optional)')}
          value={prefix}
          onChange={(e) => setPrefix(e.target.value)}
          disabled={creating}
          autoFocus
        />
        {activeDomains.length > 1 && (
          <select
            className="create-form-select"
            value={selectedDomainId}
            onChange={(e) => setSelectedDomainId(e.target.value)}
            disabled={creating}
          >
            {activeDomains.map((d) => (
              <option key={d.id} value={d.id}>
                @{d.domain}
              </option>
            ))}
          </select>
        )}
        {activeDomains.length === 1 && selectedDomain && (
          <span className="create-form-domain">@{selectedDomain.domain}</span>
        )}
      </div>
      {createError && <p className="create-form-error">{createError}</p>}
      <button
        className="create-form-submit"
        type="submit"
        disabled={creating || activeDomains.length === 0}
      >
        {creating ? t('Creating…') : t('Generate address')}
      </button>
    </form>
  )
}
