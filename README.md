# flowdash-search

`flowdash-search` 是一个面向起始页、仪表盘和桌面式主页的 Vue 3 搜索区域组件。它只负责交互和 URL 生成，不会在组件内部发起网络请求，宿主可以在 `submit` 事件里接入自己的搜索 API。

## 安装

```bash
npm i flowdash-search
```

```ts
import { SearchBox } from 'flowdash-search'
import 'flowdash-search/style.css'
```

## JSON 配置

组件接收一个普通 JSON `config`，因此可以直接从后端或用户配置文件渲染：

```vue
<SearchBox
  :config="{
    placeholder: '搜索网站、文档或书签…',
    recent: true,
    providers: [
      { id: 'google', name: 'Google', searchUrl: 'https://www.google.com/search?q={query}' },
      { id: 'baidu', name: '百度', searchUrl: 'https://www.baidu.com/s?wd={query}' }
    ]
  }"
  @submit="onSubmit"
/>
```

`searchUrl` 用 `{query}` 标记搜索词，组件会进行 `encodeURIComponent`。只允许 `http:` 和 `https:` URL；没有 `searchUrl` 时仍会触发事件，但不会自动请求。

## API

- `config.placeholder`、`config.providers`、`config.defaultProvider`、`config.shortcuts`（默认启用 `/` 和 `Ctrl/Cmd+K`）、`config.recent`、`config.recentStorageKey`、`config.maxRecent`
- `openOnSubmit`：设为 `true` 后，在 `submit` 事件之后用新标签打开生成的 URL，默认 `false`
- `v-model`：绑定当前输入
- `submit(payload)`：`{ query, provider, url, source }`
- `provider-change(provider)`、`clear`、`recent-change(items)`
- `#suggestion` 插槽：接收 `{ query, provider }`，可以渲染自定义建议或 API 结果

`createSearchUrl(provider, query)` 和 `isSearchShortcut(event, config)` 也从包入口导出，适合和自定义搜索 UI 组合使用。

## 本地开发

```bash
npm install
npm run dev
npm test
npm run build
```

组件的视觉变量可通过 `--fd-accent`、`--fd-paper` 等 CSS 自定义属性覆盖，默认使用安静的绿色与暖白色调，移动端会自动收起快捷键提示。
