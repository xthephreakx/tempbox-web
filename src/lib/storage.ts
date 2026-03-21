import type { StoredAccount, User } from '../types'

// Per-device localStorage keys
const ACTIVE_USER_KEY = 'tempbox_active_user_id'
const ACTIVE_ACCOUNT_KEY = 'tempbox_active_account_id'

// ─── Active user (per device) ─────────────────────────────
export function loadActiveUserId(): string | null {
  return localStorage.getItem(ACTIVE_USER_KEY)
}
export function saveActiveUserId(id: string | null): void {
  if (id === null) localStorage.removeItem(ACTIVE_USER_KEY)
  else localStorage.setItem(ACTIVE_USER_KEY, id)
}

// ─── Active account (per device) ─────────────────────────
export function loadActiveAccountId(): string | null {
  return localStorage.getItem(ACTIVE_ACCOUNT_KEY)
}
export function saveActiveAccountId(id: string | null): void {
  if (id === null) localStorage.removeItem(ACTIVE_ACCOUNT_KEY)
  else localStorage.setItem(ACTIVE_ACCOUNT_KEY, id)
}

// ─── Server sync ──────────────────────────────────────────
export async function loadUsersFromServer(): Promise<User[] | null> {
  try {
    const res = await fetch('/api/users')
    if (!res.ok) return null
    const data = await res.json()
    return (data.users as User[]) ?? []
  } catch {
    return null
  }
}

export function saveUsersToServer(users: User[]): void {
  fetch('/api/users', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ users }),
  }).catch(() => {})
}

// Keep for backward compat (unused but avoids import errors)
export function loadAccounts(): StoredAccount[] { return [] }
export function saveAccounts(_: StoredAccount[]): void {}
export function loadActiveAccountIdLegacy(): string | null { return null }
