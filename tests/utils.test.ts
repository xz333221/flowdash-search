import { describe, expect, it } from 'vitest'
import { createSearchUrl, isSearchShortcut } from '../src/utils'

describe('createSearchUrl', () => {
  it('encodes query in template', () => expect(createSearchUrl({ id: 'x', name: 'X', searchUrl: 'https://example.com/s?q={query}' }, 'hello world & tea')).toBe('https://example.com/s?q=hello%20world%20%26%20tea'))
  it('rejects unsafe protocols', () => expect(createSearchUrl({ id: 'x', name: 'X', searchUrl: 'javascript:alert(1)' }, 'x')).toBeUndefined())
  it('appends q when template is absent', () => expect(createSearchUrl({ id: 'x', name: 'X', searchUrl: 'https://example.com/search' }, 'a')).toBe('https://example.com/search?q=a'))
})

describe('isSearchShortcut', () => {
  const event = (key: string, extra: Partial<KeyboardEvent> = {}) => ({ key, target: document.body, ...extra }) as KeyboardEvent
  it('supports command or ctrl K', () => { expect(isSearchShortcut(event('k', { ctrlKey: true }))).toBe(true); expect(isSearchShortcut(event('k', { metaKey: true }))).toBe(true) })
  it('supports slash outside editable controls', () => { expect(isSearchShortcut(event('/'))).toBe(true); const input = document.createElement('input'); expect(isSearchShortcut({ ...event('/'), target: input })).toBe(false) })
})
