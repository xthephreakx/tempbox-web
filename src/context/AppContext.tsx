import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import type { StoredAccount, Domain, User } from '../types'
import * as storage from '../lib/storage'
import { getDomains, deleteAccount } from '../lib/api'

interface AppContextValue {
  users: User[]
  activeUserId: string | null
  activeUser: User | null
  accounts: StoredAccount[]
  activeAccountId: string | null
  domains: Domain[]
  loading: boolean
  setActiveUser: (id: string) => void
  clearActiveUser: () => void
  addUser: (name: string) => User
  removeUser: (id: string) => void
  setActiveAccount: (id: string) => void
  addAccount: (account: StoredAccount) => void
  removeAccount: (id: string) => Promise<void>
  updateAccountToken: (id: string, token: string) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [users, setUsersState] = useState<User[]>([])
  const [activeUserId, setActiveUserIdState] = useState<string | null>(() =>
    storage.loadActiveUserId()
  )
  const [activeAccountId, setActiveAccountIdState] = useState<string | null>(
    () => storage.loadActiveAccountId()
  )
  const [domains, setDomains] = useState<Domain[]>([])
  const [loading, setLoading] = useState(true)

  const activeUser = users.find((u) => u.id === activeUserId) ?? null
  const accounts = activeUser?.accounts ?? []

  const saveUsers = useCallback((next: User[]) => {
    setUsersState(next)
    storage.saveUsersToServer(next)
  }, [])

  // Load users from server on mount
  useEffect(() => {
    storage.loadUsersFromServer().then((serverUsers) => {
      if (serverUsers !== null) {
        setUsersState(serverUsers)
        // Validate saved activeUserId still exists
        setActiveUserIdState((current) => {
          if (current && serverUsers.find((u) => u.id === current)) return current
          return null
        })
      }
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    getDomains().then(setDomains).catch(() => {})
  }, [])

  const setActiveUser = useCallback((id: string) => {
    setActiveUserIdState(id)
    storage.saveActiveUserId(id)
    // Reset active account for this user
    setActiveAccountIdState(null)
    storage.saveActiveAccountId(null)
  }, [])

  const clearActiveUser = useCallback(() => {
    setActiveUserIdState(null)
    storage.saveActiveUserId(null)
  }, [])

  const addUser = useCallback(
    (name: string): User => {
      const newUser: User = {
        id: crypto.randomUUID(),
        name: name.trim(),
        accounts: [],
      }
      saveUsers([...users, newUser])
      return newUser
    },
    [users, saveUsers]
  )

  const removeUser = useCallback(
    (id: string) => {
      saveUsers(users.filter((u) => u.id !== id))
      if (activeUserId === id) {
        setActiveUserIdState(null)
        storage.saveActiveUserId(null)
      }
    },
    [users, activeUserId, saveUsers]
  )

  const setActiveAccount = useCallback((id: string) => {
    setActiveAccountIdState(id)
    storage.saveActiveAccountId(id)
  }, [])

  const addAccount = useCallback(
    (account: StoredAccount) => {
      const next = users.map((u) =>
        u.id === activeUserId
          ? { ...u, accounts: [...u.accounts, account] }
          : u
      )
      saveUsers(next)
      setActiveAccountIdState(account.id)
      storage.saveActiveAccountId(account.id)
    },
    [users, activeUserId, saveUsers]
  )

  const removeAccount = useCallback(
    async (id: string) => {
      const account = accounts.find((a) => a.id === id)
      if (account) {
        try {
          await deleteAccount(account.id, account.token)
        } catch {}
      }
      const next = users.map((u) =>
        u.id === activeUserId
          ? { ...u, accounts: u.accounts.filter((a) => a.id !== id) }
          : u
      )
      saveUsers(next)
      setActiveAccountIdState((current) => {
        if (current !== id) return current
        const remaining = accounts.filter((a) => a.id !== id)
        const nextId = remaining[0]?.id ?? null
        storage.saveActiveAccountId(nextId)
        return nextId
      })
    },
    [users, activeUserId, accounts, saveUsers]
  )

  const updateAccountToken = useCallback(
    (id: string, token: string) => {
      const next = users.map((u) =>
        u.id === activeUserId
          ? {
              ...u,
              accounts: u.accounts.map((a) =>
                a.id === id ? { ...a, token } : a
              ),
            }
          : u
      )
      saveUsers(next)
    },
    [users, activeUserId, saveUsers]
  )

  return (
    <AppContext.Provider
      value={{
        users,
        activeUserId,
        activeUser,
        accounts,
        activeAccountId,
        domains,
        loading,
        setActiveUser,
        clearActiveUser,
        addUser,
        removeUser,
        setActiveAccount,
        addAccount,
        removeAccount,
        updateAccountToken,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
