// Copies the pdf.js worker into public/ as a .js file so it is always served
// with a JavaScript MIME type (Apache maps .js but not always .mjs).
// Runs automatically before dev/build via the npm scripts.
import { copyFile, access } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const src = path.join(__dirname, 'node_modules/pdfjs-dist/build/pdf.worker.min.mjs')
const dest = path.join(__dirname, 'public/pdf.worker.min.js')

try {
  await access(src)
  await copyFile(src, dest)
  console.log('pdf.js worker copied -> public/pdf.worker.min.js')
} catch (e) {
  console.warn('pdf.js worker copy skipped:', e.message)
}
