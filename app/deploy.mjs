// Deploy script: copy the Vite build output (dist/) into the live phpstudy
// web root that serves http://localhost/pdf/  (D:/phpstudy_pro/WWW/pdf).
// Only index.html + assets/ are replaced; clone/ and app/ are preserved.
import { cp, rm, mkdir, readdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dist = path.join(__dirname, 'dist')
const target = 'D:/phpstudy_pro/WWW/pdf'

if (!existsSync(dist)) {
  console.error('dist/ not found. Run `npm run build` first.')
  process.exit(1)
}

const copyDir = async (src, dest) => {
  await mkdir(dest, { recursive: true })
  const entries = await readdir(src, { withFileTypes: true })
  for (const e of entries) {
    const s = path.join(src, e.name)
    const d = path.join(dest, e.name)
    if (e.isDirectory()) await copyDir(s, d)
    else await cp(s, d, { force: true })
  }
}

// Remove old assets then copy fresh build
const oldAssets = path.join(target, 'assets')
if (existsSync(oldAssets)) await rm(oldAssets, { recursive: true, force: true })

await cp(path.join(dist, 'index.html'), path.join(target, 'index.html'), { force: true })
await copyDir(path.join(dist, 'assets'), path.join(target, 'assets'))

console.log('Deployed to', target, '(served at http://localhost/pdf/)')
