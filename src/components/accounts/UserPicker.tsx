import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { useT } from '../../hooks/useT'

const AVATAR_COLORS = [
  '#00FEA2', '#FF007C', '#00A2FF', '#904CFE',
  '#FFD300', '#FF0036', '#A8C832',
]

function getAvatarColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

export function UserPicker() {
  const { users, setActiveUser, addUser } = useApp()
  const t = useT()
  const [showAdd, setShowAdd] = useState(false)
  const [name, setName] = useState('')

  const handleAdd = () => {
    if (!name.trim()) return
    const user = addUser(name.trim())
    setActiveUser(user.id)
    setName('')
    setShowAdd(false)
  }

  return (
    <div className="user-picker-overlay">
      <div className="user-picker">
        <h1 className="user-picker-title">{t('Who\'s using TempBox?')}</h1>

        <div className="user-picker-grid">
          {users.map((user) => {
            const color = getAvatarColor(user.name)
            return (
              <button
                key={user.id}
                className="user-card"
                onClick={() => setActiveUser(user.id)}
              >
                <div className="user-avatar" style={{ '--avatar-color': color } as React.CSSProperties}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="user-name">{user.name}</span>
                <span className="user-count">
                  {user.accounts.length} {user.accounts.length === 1 ? t('inbox') : t('inboxes')}
                </span>
              </button>
            )
          })}

          {!showAdd && (
            <button className="user-card user-card--add" onClick={() => setShowAdd(true)}>
              <div className="user-avatar user-avatar--add">+</div>
              <span className="user-name">{t('Add user')}</span>
            </button>
          )}
        </div>

        {showAdd && (
          <div className="user-picker-add">
            <input
              className="user-picker-input"
              type="text"
              placeholder={t('Your name')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              autoFocus
              maxLength={32}
            />
            <div className="user-picker-add-actions">
              <button
                className="user-picker-btn-confirm"
                onClick={handleAdd}
                disabled={!name.trim()}
              >
                {t('Continue')}
              </button>
              <button
                className="user-picker-btn-cancel"
                onClick={() => { setShowAdd(false); setName('') }}
              >
                {t('Cancel')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
