import type { SearchProvider, SearchShortcutConfig } from './types'

const DEFAULT_STORAGE_KEY = 'flowdash-search:recent'

/** Safely create a provider URL. Only http(s) URLs are returned. */
export function createSearchUrl(provider: SearchProvider, query: string): string | undefined {
  const raw = provider.searchUrl?.trim()
  if (!raw || !query.trim()) return undefined
  const encoded = encodeURIComponent(query.trim())
  const template = raw.includes('{query}') ? raw.split('{query}').join(encoded) : `${raw}${raw.includes('?') ? '&' : '?'}q=${encoded}`
  try {
    const url = new URL(template, typeof window === 'undefined' ? 'https://flowdash.local' : window.location.origin)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return undefined
    return url.href.replace('https://flowdash.local', '') || url.href
  } catch {
    return undefined
  }
}

export function isSearchShortcut(event: KeyboardEvent, shortcuts: SearchShortcutConfig = {}): boolean {
  const key = event.key.toLowerCase()
  const commandK = shortcuts.commandK !== false && key === 'k' && (event.metaKey || event.ctrlKey)
  const slash = shortcuts.slash !== false && key === '/' && !event.metaKey && !event.ctrlKey && !event.altKey && !isEditableTarget(event.target)
  return commandK || slash
}

export function isEditableTarget(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null
  if (!el) return false
  const tag = el.tagName?.toLowerCase()
  return tag === 'input' || tag === 'textarea' || tag === 'select' || el.isContentEditable
}

export function readRecent(key = DEFAULT_STORAGE_KEY): string[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || '[]')
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : []
  } catch { return [] }
}

export function writeRecent(query: string, max = 6, key = DEFAULT_STORAGE_KEY): string[] {
  const next = [query.trim(), ...readRecent(key).filter((item) => item !== query.trim())].filter(Boolean).slice(0, max)
  try { localStorage.setItem(key, JSON.stringify(next)) } catch { /* storage is optional */ }
  return next
}
