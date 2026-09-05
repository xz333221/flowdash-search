<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { SearchConfig, SearchProvider, SearchSubmitPayload } from './types'
import { createSearchUrl, isSearchShortcut, readRecent, writeRecent } from './utils'

const props = withDefaults(defineProps<{
  config?: SearchConfig
  modelValue?: string
  autoFocus?: boolean
  disabled?: boolean
  openOnSubmit?: boolean
}>(), {
  config: () => ({}), modelValue: '', autoFocus: false, disabled: false, openOnSubmit: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  submit: [payload: SearchSubmitPayload]
  'provider-change': [provider: SearchProvider]
  clear: []
  'recent-change': [items: string[]]
}>()

defineSlots<{
  leading?: () => unknown
  providerIcon?: (props: { provider: SearchProvider }) => unknown
  suggestion?: (props: { query: string; provider: SearchProvider }) => unknown
}>()

const input = ref<HTMLInputElement>()
const query = ref(props.modelValue)
const focused = ref(false)
const selectedId = ref(props.config.defaultProvider)
const recent = ref<string[]>([])
const config = computed(() => props.config || {})
const providers = computed<SearchProvider[]>(() => config.value.providers?.length ? config.value.providers! : [{ id: 'web', name: 'Web', searchUrl: 'https://www.google.com/search?q={query}' }])
const provider = computed(() => providers.value.find((item) => item.id === selectedId.value) || providers.value[0])
const showRecent = computed(() => focused.value && !query.value.trim() && config.value.recent === true && recent.value.length > 0)
const placeholder = computed(() => config.value.placeholder || `Search with ${provider.value.name}…`)
const commandLabel = computed(() => typeof navigator !== 'undefined' && navigator.platform.includes('Mac') ? '⌘' : 'Ctrl')

watch(() => props.modelValue, (value) => { if (value !== query.value) query.value = value })
watch(provider, (value) => { if (value) emit('provider-change', value) })
watch(() => [config.value.recent, config.value.recentStorageKey], () => {
  if (config.value.recent) recent.value = readRecent(config.value.recentStorageKey)
}, { immediate: true })

function focusInput() { nextTick(() => input.value?.focus()) }
function selectProvider(id: string) { selectedId.value = id }
function setQuery(value: string) { query.value = value; emit('update:modelValue', value) }
function clear() { setQuery(''); emit('clear'); focusInput() }
function submit(source: SearchSubmitPayload['source'] = 'enter') {
  const value = query.value.trim()
  if (!value || !provider.value) return
  const url = createSearchUrl(provider.value, value)
  const payload: SearchSubmitPayload = { query: value, provider: provider.value, url, source }
  if (config.value.recent) {
    recent.value = writeRecent(value, config.value.maxRecent || 6, config.value.recentStorageKey)
    emit('recent-change', recent.value)
  }
  emit('submit', payload)
  if (props.openOnSubmit && url) window.open(url, '_blank', 'noopener,noreferrer')
}
function chooseRecent(value: string) { setQuery(value); submit('recent') }
function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') { event.preventDefault(); submit() }
  else if (event.key === 'Escape' && query.value) clear()
}
function globalKeydown(event: KeyboardEvent) {
  if (isSearchShortcut(event, config.value.shortcuts)) { event.preventDefault(); focusInput() }
}
onMounted(() => { window.addEventListener('keydown', globalKeydown); if (props.autoFocus) focusInput() })
onBeforeUnmount(() => window.removeEventListener('keydown', globalKeydown))
</script>

<template>
  <div class="flowdash-search" :class="{ 'is-focused': focused, 'is-disabled': disabled }">
    <div class="search-shell">
      <span class="search-leading" aria-hidden="true"><slot name="leading"><svg viewBox="0 0 24 24"><path d="m21 21-4.5-4.5m2-5.25a7.25 7.25 0 1 1-14.5 0 7.25 7.25 0 0 1 14.5 0Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.8"/></svg></slot></span>
      <input ref="input" v-model="query" :placeholder="placeholder" :disabled="disabled" role="combobox" aria-label="Search" :aria-expanded="showRecent" @focus="focused = true" @blur="focused = false" @keydown="onKeydown" @input="emit('update:modelValue', query)" />
      <button v-if="query" class="clear-button" type="button" aria-label="Clear search" @mousedown.prevent @click="clear">×</button>
      <div v-if="providers.length > 1" class="provider-picker">
        <span v-if="provider.icon || $slots.providerIcon" class="provider-mark" aria-hidden="true"><slot name="providerIcon" :provider="provider"><img v-if="provider.icon" :src="provider.icon" alt="" /></slot></span>
        <select v-model="selectedId" :disabled="disabled" aria-label="Search provider">
          <option v-for="item in providers" :key="item.id" :value="item.id">{{ item.name }}</option>
        </select>
        <span class="provider-chevron" aria-hidden="true">⌄</span>
      </div>
      <kbd class="search-hint">{{ commandLabel }} K</kbd>
      <button class="submit-button" type="button" :disabled="disabled || !query.trim()" aria-label="Submit search" @click="submit()"><span>Search</span><span aria-hidden="true">↵</span></button>
    </div>
    <div v-if="showRecent" class="recent-panel" role="listbox" aria-label="Recent searches">
      <div class="recent-heading">Recent searches</div>
      <button v-for="item in recent" :key="item" type="button" class="recent-item" role="option" @mousedown.prevent @click="chooseRecent(item)"><span aria-hidden="true">↗</span>{{ item }}</button>
    </div>
    <div v-if="$slots.suggestion && query.trim()" class="suggestion-panel"><slot name="suggestion" :query="query" :provider="provider" /></div>
  </div>
</template>


