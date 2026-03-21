import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { useMessages } from '../../hooks/useMessages'
import { useT } from '../../hooks/useT'
import { InboxList } from '../inbox/InboxList'
import { MessageView } from '../message/MessageView'

export function MainPanel() {
  const { accounts, activeAccountId } = useApp()
  const activeAccount = accounts.find((a) => a.id === activeAccountId) ?? null
  const { messages, loading, error, refresh, lastRefreshed } = useMessages(activeAccount)
  const t = useT()
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null)

  // Clear selected message when switching accounts
  const handleSelectMessage = (id: string | null) => {
    setSelectedMessageId(id)
  }

  if (!activeAccount) {
    return (
      <main className="main-panel main-panel--empty">
        <div className="welcome">
          <div className="welcome-icon">✉</div>
          <h2>{t('Disposable inbox')}</h2>
          <p>{t('Create a temporary address to start receiving mail.')}</p>
        </div>
      </main>
    )
  }

  return (
    <main className="main-panel">
      <InboxList
        messages={messages}
        loading={loading}
        error={error}
        lastRefreshed={lastRefreshed}
        selectedId={selectedMessageId}
        onSelect={handleSelectMessage}
        onRefresh={refresh}
        account={activeAccount}
        onMessagesUpdated={(updatedMessages) => {
          // If selected message was deleted, deselect
          if (selectedMessageId && !updatedMessages.find(m => m.id === selectedMessageId)) {
            setSelectedMessageId(null)
          }
        }}
      />
      <MessageView
        messageId={selectedMessageId}
        account={activeAccount}
        onDelete={() => {
          setSelectedMessageId(null)
          refresh()
        }}
        onClose={() => setSelectedMessageId(null)}
        onMarkRead={refresh}
      />
    </main>
  )
}
