import { readFile, writeFile } from 'node:fs/promises'
const file = 'dist/types/src/index.d.ts'
const source = await readFile(file, 'utf8')
await writeFile(file, source.replace("import './style.css';\n", ''))
