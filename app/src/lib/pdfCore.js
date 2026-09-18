// ============================================================================
//  核心 PDF 操作 (基于 pdf-lib)
//  全部为「纯函数」：输入 ArrayBuffer / Uint8Array，输出 PDFDocument 或字节。
//  不依赖浏览器 API，因此可用 Node 单独做单元验证。
// ============================================================================
import { PDFDocument, degrees, rgb, StandardFonts } from 'pdf-lib'

/** 浏览器：File -> ArrayBuffer */
export function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(r.result)
    r.onerror = () => reject(r.error)
    r.readAsArrayBuffer(file)
  })
}

/** 加载 PDF（忽略加密以便处理普通文件） */
export async function loadPdf(bytes) {
  return PDFDocument.load(bytes, { ignoreEncryption: true })
}

/** 保存为字节 */
export async function savePdf(doc) {
  return doc.save()
}

/** 浏览器：触发下载 */
export function downloadBytes(bytes, filename) {
  const blob = new Blob([bytes], { type: 'application/pdf' })
  downloadBlob(blob, filename)
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

// ---------------------------------------------------------------------------
//  合并
// ---------------------------------------------------------------------------
export async function mergePdfs(buffers) {
  const merged = await PDFDocument.create()
  for (const buf of buffers) {
    const src = await PDFDocument.load(buf, { ignoreEncryption: true })
    const indices = src.getPages().map((_, i) => i)
    const pages = await merged.copyPages(src, indices)
    pages.forEach((p) => merged.addPage(p))
  }
  return merged.save()
}

// ---------------------------------------------------------------------------
//  拆分（按范围，每段输出一个文件）
// ---------------------------------------------------------------------------
export function parsePageRanges(str, total) {
  const groups = []
  for (const part of String(str).split(',')) {
    const p = part.trim()
    if (!p) continue
    const nums = []
    if (p.includes('-')) {
      const [a, b] = p.split('-').map((x) => parseInt(x, 10))
      if (!isNaN(a) && !isNaN(b)) {
        const lo = Math.min(a, b)
        const hi = Math.max(a, b)
        for (let i = lo; i <= hi; i++) nums.push(i)
      }
    } else {
      const n = parseInt(p, 10)
      if (!isNaN(n)) nums.push(n)
    }
    nums.forEach((n) => {
      if (n >= 1 && n <= total) groups.push(n - 1) // 转为 0-based
    })
  }
  return groups
}

export async function splitPdf(bytes, rangesStr) {
  const doc = await loadPdf(bytes)
  const total = doc.getPages().length
  const groups = String(rangesStr)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((part) => {
      const idx = parsePageRanges(part, total)
      return idx
    })
    .filter((g) => g.length)

  const outputs = []
  for (const idx of groups) {
    const out = await PDFDocument.create()
    const pages = await out.copyPages(doc, idx)
    pages.forEach((p) => out.addPage(p))
    const name = idx.length === 1 ? `page-${idx[0] + 1}.pdf` : `pages-${idx[0] + 1}-${idx[idx.length - 1] + 1}.pdf`
    outputs.push({ name, bytes: await out.save() })
  }
  return outputs
}

// ---------------------------------------------------------------------------
//  图片转 PDF
// ---------------------------------------------------------------------------
export async function imagesToPdf(buffers, types) {
  const doc = await PDFDocument.create()
  for (let i = 0; i < buffers.length; i++) {
    const buf = buffers[i]
    const type = (types && types[i]) || ''
    let image
    if (/png/i.test(type)) image = await doc.embedPng(buf)
    else image = await doc.embedJpg(buf) // 默认按 JPG 处理
    const { width, height } = image.scale(1)
    const page = doc.addPage([width, height])
    page.drawImage(image, { x: 0, y: 0, width, height })
  }
  return doc.save()
}

// ---------------------------------------------------------------------------
//  压缩（重建以去除增量更新与冗余对象；如原文件已最优则体积可能不变）
// ---------------------------------------------------------------------------
export async function compressPdf(bytes) {
  const doc = await loadPdf(bytes)
  return doc.save({
    useObjectStreams: true,
    objectsPerTick: 200,
  })
}

// ---------------------------------------------------------------------------
//  水印
// ---------------------------------------------------------------------------
export async function addWatermark(bytes, opts) {
  const { text, fontSize = 32, opacity = 0.2, angle = 30, count = 9 } = opts
  const doc = await loadPdf(bytes)
  const font = await doc.embedFont(StandardFonts.Helvetica)
  const pages = doc.getPages()
  const side = Math.ceil(Math.sqrt(count))
  for (const page of pages) {
    const { width, height } = page.getSize()
    let n = 0
    for (let r = 0; r < side; r++) {
      for (let c = 0; c < side; c++) {
        if (n >= count) break
        const x = (width / (side + 1)) * (c + 1)
        const y = (height / (side + 1)) * (r + 1)
        page.drawText(text, {
          x,
          y,
          size: fontSize,
          font,
          color: rgb(0.5, 0.5, 0.5),
          opacity,
          rotate: degrees(angle),
        })
        n++
      }
    }
  }
  return doc.save()
}

// ---------------------------------------------------------------------------
//  页码
// ---------------------------------------------------------------------------
export async function addPageNumbers(bytes, opts) {
  const { position = '底部居中', start = 1 } = opts
  const doc = await loadPdf(bytes)
  const font = await doc.embedFont(StandardFonts.Helvetica)
  const pages = doc.getPages()
  const size = 11
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i]
    const { width, height } = page.getSize()
    const num = String(start + i)
    const tw = font.widthOfTextAtSize(num, size)
    let x
    let y
    const top = position.startsWith('顶部')
    const vert = top ? height - 24 : 18
    y = vert
    if (position.includes('左侧')) x = 24
    else if (position.includes('右侧')) x = width - tw - 24
    else x = (width - tw) / 2
    page.drawText(num, {
      x,
      y,
      size,
      font,
      color: rgb(0.45, 0.45, 0.5),
    })
  }
  return doc.save()
}

// ---------------------------------------------------------------------------
//  旋转
// ---------------------------------------------------------------------------
export async function rotatePdf(bytes, delta, pagesScope) {
  const doc = await loadPdf(bytes)
  const pages = doc.getPages()
  pages.forEach((page, i) => {
    const target = pagesScope === 'all' || !Array.isArray(pagesScope) ? true : pagesScope.includes(i)
    if (!target) return
    const cur = page.getRotation().angle
    page.setRotation(degrees((cur + delta) % 360))
  })
  return doc.save()
}

// ---------------------------------------------------------------------------
//  删除页面（保留选中页）
// ---------------------------------------------------------------------------
export async function deletePages(bytes, keepIndicesZeroBased) {
  if (!keepIndicesZeroBased.length) throw new Error('请至少保留一个页面')
  const doc = await loadPdf(bytes)
  const out = await PDFDocument.create()
  const pages = await out.copyPages(doc, keepIndicesZeroBased)
  pages.forEach((p) => out.addPage(p))
  return out.save()
}
