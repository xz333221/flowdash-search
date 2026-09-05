export interface SearchProvider {
  id: string
  name: string
  /** URL or template. Use `{query}` where the encoded query should be inserted. */
  searchUrl?: string
  icon?: string
  color?: string
  shortcut?: string
}

export interface SearchShortcutConfig {
  slash?: boolean
  commandK?: boolean
}

export interface SearchConfig {
  placeholder?: string
  providers?: SearchProvider[]
  defaultProvider?: string
  shortcuts?: SearchShortcutConfig
  recent?: boolean
  recentStorageKey?: string
  maxRecent?: number
}

export interface SearchSubmitPayload {
  query: string
  provider: SearchProvider
  url?: string
  source: 'enter' | 'recent' | 'suggestion'
}
