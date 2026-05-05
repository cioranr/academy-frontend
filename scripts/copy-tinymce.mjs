import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const src  = resolve(root, 'node_modules/tinymce')
const dest = resolve(root, 'public/tinymce')

if (!existsSync(src)) {
  console.warn('[copy-tinymce] node_modules/tinymce not found — run `npm install` first.')
  process.exit(0)
}

if (existsSync(dest)) rmSync(dest, { recursive: true, force: true })
mkdirSync(dest, { recursive: true })
cpSync(src, dest, { recursive: true, dereference: true })
console.log('[copy-tinymce] copied tinymce assets → public/tinymce')
