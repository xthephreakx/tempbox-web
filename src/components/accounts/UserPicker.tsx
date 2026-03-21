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
  const { users, setActiveUser, addUser, removeUser } = useApp()
  const t = useT()
  const [showAdd, setShowAdd] = useState(false)
  const [name, setName] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const handleAdd = () => {
    if (!name.trim()) return
    const user = addUser(name.trim())
    setActiveUser(user.id)
    setName('')
    setShowAdd(false)
  }

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (confirmDeleteId === id) {
      removeUser(id)
      setConfirmDeleteId(null)
    } else {
      setConfirmDeleteId(id)
    }
  }

  return (
    <div className="user-picker-overlay">
      <div className="user-picker">
        <h1 className="user-picker-title">{t('Who\'s using TempBox?')}</h1>

        <div className="user-picker-grid">
          {users.map((user) => {
            const color = getAvatarColor(user.name)
            const confirming = confirmDeleteId === user.id
            return (
              <div key={user.id} className="user-card-wrapper">
                <button
                  className={`user-card${confirming ? ' user-card--confirming' : ''}`}
                  onClick={() => !confirming && setActiveUser(user.id)}
                >
                  <div className="user-avatar" style={{ '--avatar-color': color } as React.CSSProperties}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="user-name">{user.name}</span>
                  <span className="user-count">
                    {user.accounts.length} {user.accounts.length === 1 ? t('inbox') : t('inboxes')}
                  </span>
                </button>
                <button
                  className={`user-card-delete${confirming ? ' user-card-delete--confirm' : ''}`}
                  onClick={(e) => handleDelete(e, user.id)}
                  title={confirming ? t('Confirm delete') : t('Delete user')}
                >
                  {confirming ? t('Delete?') : '✕'}
                </button>
              </div>
            )
          })}

          {!showAdd && (
            <button className="user-card user-card--add" onClick={() => { setShowAdd(true); setConfirmDeleteId(null) }}>
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
