import { useState, useEffect, useCallback, useRef } from 'react'
import type { MessageSummary, StoredAccount } from '../types'
import { listMessages, getToken } from '../lib/api'
import { useApp } from '../context/AppContext'

const POLL_INTERVAL = 10_000

interface UseMessagesResult {
  messages: MessageSummary[]
  loading: boolean
  error: string | null
  refresh: () => void
  lastRefreshed: Date | null
}

export function useMessages(account: StoredAccount | null): UseMessagesResult {
  const { updateAccountToken } = useApp()
  const [messages, setMessages] = useState<MessageSummary[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null)
  const accountRef = useRef(account)
  accountRef.current = account

  const fetchMessages = useCallback(async (acc: StoredAccount) => {
    try {
      const data = await listMessages(acc.token)
      setMessages(data['hydra:member'])
      setError(null)
      setLastRefreshed(new Date())
    } catch (err: unknown) {
      const apiErr = err as { status?: number }
      if (apiErr?.status === 401) {
        // token expired — re-auth
        try {
          const tokenRes = await getToken(acc.address, acc.password)
          updateAccountToken(acc.id, tokenRes.token)
          const data = await listMessages(tokenRes.token)
          setMessages(data['hydra:member'])
          setError(null)
          setLastRefreshed(new Date())
        } catch {
          setError('Authentication failed')
        }
      } else {
        setError('Failed to load messages')
      }
    }
  }, [updateAccountToken])

  const refresh = useCallback(() => {
    if (!accountRef.current) return
    setLoading(true)
    fetchMessages(accountRef.current).finally(() => setLoading(false))
  }, [fetchMessages])

  useEffect(() => {
    if (!account) {
      setMessages([])
      setError(null)
      return
    }

    setMessages([])
    setLoading(true)
    fetchMessages(account).finally(() => setLoading(false))

    const interval = setInterval(() => {
      if (accountRef.current) fetchMessages(accountRef.current)
    }, POLL_INTERVAL)

    return () => clearInterval(interval)
  }, [account?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  return { messages, loading, error, refresh, lastRefreshed }
}
