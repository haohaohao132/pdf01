// PDF.js 配置（用于 OCR 文本提取）
import * as pdfjsLib from 'pdfjs-dist'

// 使用 public/ 下复制过来的 worker（命名为 .js 以兼容 Apache 的 MIME 配置）
pdfjsLib.GlobalWorkerOptions.workerSrc = import.meta.env.BASE_URL + 'pdf.worker.min.js'

/** 提取 PDF 每页文本，返回 [{ page, text }] */
export async function extractText(bytes) {
  const doc = await pdfjsLib.getDocument({ data: new Uint8Array(bytes) }).promise
  const pages = []
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i)
    const content = await page.getTextContent()
    const text = content.items.map((it) => it.str).join(' ')
    pages.push({ page: i, text })
  }
  await doc.destroy()
  return pages
}
