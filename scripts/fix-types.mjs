import { readFile, writeFile, rm } from 'node:fs/promises'
const file = 'dist/types/src/index.d.ts'
const source = await readFile(file, 'utf8')
await writeFile(file, source.replace("import './style.css';\n", ''))
await writeFile('dist/style.d.ts', 'export {};\n')
for (const directory of ['dist/types/demo', 'dist/types/tests', 'dist/types/vite.config.d.ts']) {
  await rm(directory, { recursive: true, force: true })
}
