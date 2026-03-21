import { formatRelativeTime } from '../../lib/utils'
import { useT } from '../../hooks/useT'
import type { MessageSummary, StoredAccount } from '../../types'

interface Props {
  messages: MessageSummary[]
  loading: boolean
  error: string | null
  lastRefreshed: Date | null
  selectedId: string | null
  onSelect: (id: string | null) => void
  onRefresh: () => void
  account: StoredAccount
  onMessagesUpdated: (messages: MessageSummary[]) => void
}

export function InboxList({
  messages,
  loading,
  error,
  lastRefreshed,
  selectedId,
  onSelect,
  onRefresh,
}: Props) {
  const t = useT()
  const unreadCount = messages.filter((m) => !m.seen).length

  return (
    <div className="inbox-list">
      <div className="inbox-header">
        <div className="inbox-header-left">
          <span className="inbox-title">{t('inbox')}</span>
          {unreadCount > 0 && (
            <span className="inbox-badge">{unreadCount}</span>
          )}
        </div>
        <button
          className={`refresh-btn ${loading ? 'refresh-btn--spinning' : ''}`}
          onClick={onRefresh}
          disabled={loading}
          title="Refresh"
        >
          ↻
        </button>
      </div>

      {error && <div className="inbox-error">{error}</div>}

      <div className="message-list">
        {messages.length === 0 && !loading && (
          <div className="inbox-empty">
            <p>{t('No messages yet.')}</p>
            <p className="inbox-empty-sub">{t('Send an email to this address to get started.')}</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <MessageRow
            key={msg.id}
            message={msg}
            isSelected={msg.id === selectedId}
            index={i}
            onClick={() => onSelect(msg.id)}
          />
        ))}
      </div>

      {lastRefreshed && (
        <div className="inbox-footer">
          {t('Updated')} {formatRelativeTime(lastRefreshed.toISOString())}
        </div>
      )}
    </div>
  )
}

interface MessageRowProps {
  message: MessageSummary
  isSelected: boolean
  index: number
  onClick: () => void
}

function MessageRow({ message, isSelected, index, onClick }: MessageRowProps) {
  const senderName = message.from.name || message.from.address

  return (
    <div
      className={`message-row ${isSelected ? 'message-row--selected' : ''} ${!message.seen ? 'message-row--unread' : ''}`}
      style={{ animationDelay: `${index * 30}ms` }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      {!message.seen && <span className="unread-dot" />}
      <div className="message-row-content">
        <div className="message-row-top">
          <span className="message-from">{senderName}</span>
          <span className="message-date">{formatRelativeTime(message.createdAt)}</span>
        </div>
        <div className="message-subject">{message.subject || '(no subject)'}</div>
        <div className="message-intro">{message.intro}</div>
      </div>
    </div>
  )
}
