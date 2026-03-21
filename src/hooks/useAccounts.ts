import { useState } from 'react'
import { createAccount, getToken } from '../lib/api'
import { generatePassword, generateUsername } from '../lib/utils'
import { useApp } from '../context/AppContext'
import type { StoredAccount } from '../types'

interface CreateAccountOptions {
  usernamePrefix: string
  domainId: string
  domainName: string
}

interface UseAccountsResult {
  creating: boolean
  createError: string | null
  create: (opts: CreateAccountOptions) => Promise<StoredAccount | null>
}

export function useAccounts(): UseAccountsResult {
  const { addAccount } = useApp()
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  const create = async (opts: CreateAccountOptions): Promise<StoredAccount | null> => {
    setCreating(true)
    setCreateError(null)
    try {
      const username = generateUsername(opts.usernamePrefix)
      const address = `${username}@${opts.domainName}`
      const password = generatePassword()

      const account = await createAccount(address, password)
      const tokenRes = await getToken(address, password)

      const stored: StoredAccount = {
        id: account.id,
        address: account.address,
        password,
        token: tokenRes.token,
        createdAt: account.createdAt,
      }

      addAccount(stored)
      return stored
    } catch (err: unknown) {
      const apiErr = err as { message?: string }
      setCreateError(apiErr?.message ?? 'Failed to create account')
      return null
    } finally {
      setCreating(false)
    }
  }

  return { creating, createError, create }
}
