<script setup lang="ts">
import { SearchBox, type SearchSubmitPayload } from '../src'
import { ref } from 'vue'
const last = ref('')
function search(payload: SearchSubmitPayload) { last.value = `${payload.provider.name}: ${payload.query}` }
</script>
<template>
  <main class="demo"><p class="eyebrow">FLOWDASH / SEARCH</p><h1>Search the quiet web.</h1><p class="intro">A composable search area for start pages, dashboards and desktop-like home screens.</p>
    <SearchBox :config="{ placeholder: 'Search anything…', recent: true, providers: [{ id: 'web', name: 'Web', searchUrl: 'https://www.google.com/search?q={query}' }, { id: 'docs', name: 'Docs', searchUrl: 'https://developer.mozilla.org/en-US/search?q={query}' }] }" @submit="search" />
    <p v-if="last" class="result">Last search · {{ last }}</p>
  </main>
</template>
<style>
:root { color: #1c2a26; background: #e9f0e8; } * { box-sizing: border-box; } body { margin: 0; }
.demo { display: grid; align-content: center; min-height: 100vh; max-width: 760px; margin: auto; padding: 32px; background: radial-gradient(circle at 15% 20%, #f8fbf5, transparent 55%); }
.eyebrow { color: #4b8069; font: 700 11px/1.2 ui-monospace, SFMono-Regular, monospace; letter-spacing: .16em; }
h1 { max-width: 580px; margin: 12px 0; font: 500 clamp(40px, 7vw, 72px)/.98 Georgia, serif; letter-spacing: -.05em; }
.intro { max-width: 500px; margin: 0 0 34px; color: #71817a; font: 16px/1.6 ui-sans-serif, system-ui; }.result { color: #4b8069; font: 13px ui-monospace, monospace; }
</style>
