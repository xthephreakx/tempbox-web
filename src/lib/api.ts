import type {
  Domain,
  Account,
  TokenResponse,
  MessageList,
  FullMessage,
  ApiError,
} from '../types'

const BASE = 'https://api.mail.tm'

function createApiError(status: number, message: string): ApiError {
  const err = new Error(message) as ApiError
  err.status = status
  return err
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!res.ok) {
    let message = `HTTP ${res.status}`
    try {
      const body = await res.json()
      message = body['hydra:description'] || body.message || message
    } catch {}
    throw createApiError(res.status, message)
  }

  if (res.status === 204) return undefined as T
  return res.json()
}

function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` }
}

export async function getDomains(): Promise<Domain[]> {
  const data = await request<{ 'hydra:member': Domain[] }>('/domains')
  return data['hydra:member']
}

export async function createAccount(
  address: string,
  password: string
): Promise<Account> {
  return request<Account>('/accounts', {
    method: 'POST',
    body: JSON.stringify({ address, password }),
  })
}

export async function getToken(
  address: string,
  password: string
): Promise<TokenResponse> {
  return request<TokenResponse>('/token', {
    method: 'POST',
    body: JSON.stringify({ address, password }),
  })
}

export async function getAccount(
  accountId: string,
  token: string
): Promise<Account> {
  return request<Account>(`/accounts/${accountId}`, {
    headers: authHeader(token),
  })
}

export async function deleteAccount(
  accountId: string,
  token: string
): Promise<void> {
  return request<void>(`/accounts/${accountId}`, {
    method: 'DELETE',
    headers: authHeader(token),
  })
}

export async function listMessages(
  token: string,
  page = 1
): Promise<MessageList> {
  return request<MessageList>(`/messages?page=${page}`, {
    headers: authHeader(token),
  })
}

export async function getMessage(
  messageId: string,
  token: string
): Promise<FullMessage> {
  return request<FullMessage>(`/messages/${messageId}`, {
    headers: authHeader(token),
  })
}

export async function markRead(
  messageId: string,
  token: string
): Promise<void> {
  return request<void>(`/messages/${messageId}`, {
    method: 'PATCH',
    headers: {
      ...authHeader(token),
      'Content-Type': 'application/merge-patch+json',
    },
    body: JSON.stringify({ seen: true }),
  })
}

export async function deleteMessage(
  messageId: string,
  token: string
): Promise<void> {
  return request<void>(`/messages/${messageId}`, {
    method: 'DELETE',
    headers: authHeader(token),
  })
}
