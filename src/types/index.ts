export interface Domain {
  id: string
  domain: string
  isActive: boolean
  isPrivate: boolean
  createdAt: string
  updatedAt: string
}

export interface Account {
  id: string
  address: string
  quota: number
  used: number
  isDisabled: boolean
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export interface TokenResponse {
  token: string
  id: string
}

export interface MessageAddress {
  address: string
  name: string
}

export interface MessageSummary {
  id: string
  accountId: string
  msgid: string
  from: MessageAddress
  to: MessageAddress[]
  subject: string
  intro: string
  seen: boolean
  isDeleted: boolean
  hasAttachments: boolean
  size: number
  downloadUrl: string
  createdAt: string
  updatedAt: string
}

export interface Attachment {
  id: string
  filename: string
  contentType: string
  disposition: string
  transferEncoding: string
  related: boolean
  size: number
  downloadUrl: string
}

export interface FullMessage extends MessageSummary {
  cc: MessageAddress[]
  bcc: MessageAddress[]
  flagged: boolean
  verifications: string[]
  retention: boolean
  retentionDate: string
  text: string
  html: string[]
  attachments: Attachment[]
}

export interface MessageList {
  'hydra:totalItems': number
  'hydra:member': MessageSummary[]
}

export interface StoredAccount {
  id: string
  address: string
  password: string
  token: string
  createdAt: string
}

export interface User {
  id: string
  name: string
  accounts: StoredAccount[]
}

export interface ApiError extends Error {
  status: number
}
