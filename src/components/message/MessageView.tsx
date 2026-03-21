import { useState, useEffect } from 'react'
import type { FullMessage, StoredAccount } from '../../types'
import { getMessage, deleteMessage, markRead } from '../../lib/api'
import { formatDate } from '../../lib/utils'
import { useT } from '../../hooks/useT'

interface Props {
  messageId: string | null
  account: StoredAccount
  onDelete: () => void
  onMarkRead: () => void
  onClose: () => void
}

export function MessageView({ messageId, account, onDelete, onMarkRead, onClose }: Props) {
  const t = useT()
  const [message, setMessage] = useState<FullMessage | null>(null)
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!messageId) {
      setMessage(null)
      return
    }

    setLoading(true)
    setError(null)
    getMessage(messageId, account.token)
      .then((msg) => {
        setMessage(msg)
        if (!msg.seen) {
          markRead(messageId, account.token).then(onMarkRead).catch(() => {})
        }
      })
      .catch(() => setError('Could not load message'))
      .finally(() => setLoading(false))
  }, [messageId]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async () => {
    if (!message) return
    if (!confirm('Delete this message?')) return
    setDeleting(true)
    try {
      await deleteMessage(message.id, account.token)
      onDelete()
    } catch {
      setDeleting(false)
    }
  }

  if (!messageId) {
    return (
      <div className="message-view message-view--empty">
        <div className="message-empty-state">
          <div className="message-empty-icon">↖</div>
          <p>{t('Select a message to read')}</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="message-view message-view--loading">
        <div className="loading-spinner">{t('Loading…')}</div>
      </div>
    )
  }

  if (error || !message) {
    return (
      <div className="message-view message-view--error">
        <p>{error ?? 'Message not found'}</p>
      </div>
    )
  }

  const rawHtml = message.html?.join('') ?? ''
  const hasHtml = rawHtml.trim().length > 0

  // Inject a readable base style so email text is always visible
  const htmlBody = hasHtml
    ? `<style>html,body{background:#ffffff;color:#111111;font-family:sans-serif;font-size:14px;line-height:1.6;margin:16px;}</style>${rawHtml}`
    : ''

  return (
    <div className="message-view">
      <div className="message-view-header">
        <div className="message-meta">
          <h2 className="message-view-subject">{message.subject || '(no subject)'}</h2>
          <div className="message-view-from">
            <span className="meta-label">{t('From')}</span>
            <span className="meta-value">
              {message.from.name ? `${message.from.name} ` : ''}
              <span className="meta-address">&lt;{message.from.address}&gt;</span>
            </span>
          </div>
          <div className="message-view-date">
            <span className="meta-label">{t('Date')}</span>
            <span className="meta-value">{formatDate(message.createdAt)}</span>
          </div>
        </div>
        <div className="message-header-actions">
          <button
            className="close-btn"
            onClick={onClose}
            title="Close message"
          >
            ✕
          </button>
          <button
            className="delete-btn"
            onClick={handleDelete}
            disabled={deleting}
            title="Delete message"
          >
            {deleting ? '…' : t('⌫ Delete')}
          </button>
        </div>
      </div>

      <div className="message-body">
        {hasHtml ? (
          <iframe
            className="message-iframe"
            srcDoc={htmlBody}
            sandbox="allow-same-origin"
            title="Message content"
          />
        ) : (
          <pre className="message-text">{message.text}</pre>
        )}
      </div>
    </div>
  )
}
