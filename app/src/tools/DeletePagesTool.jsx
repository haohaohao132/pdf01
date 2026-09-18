import { useState } from 'react'
import ToolShell from '../components/ToolShell'
import { deletePages, readFileAsArrayBuffer, loadPdf } from '../lib/pdfCore'
import { toolById, fill } from '../content'

const miniBtn = 'rounded-lg border border-ink-500 bg-ink-600 px-3 py-1.5 text-xs text-gray-200 hover:bg-ink-500'

export default function DeletePagesTool() {
  const meta = toolById('delete-pages')
  const [total, setTotal] = useState(0)
  const [keep, setKeep] = useState([]) // true = 保留

  const onFilesChange = async (files) => {
    if (!files.length) {
      setTotal(0)
      setKeep([])
      return
    }
    try {
      const buf = await readFileAsArrayBuffer(files[0])
      const doc = await loadPdf(buf)
      const t = doc.getPages().length
      setTotal(t)
      setKeep(Array(t).fill(true))
    } catch {
      setTotal(0)
      setKeep([])
    }
  }

  const toggle = (i) => setKeep((k) => k.map((v, idx) => (idx === i ? !v : v)))
  const selectAll = (v) => setKeep(Array(total).fill(v))

  const onProcess = async ({ files, setProgress }) => {
    const keepIdx = keep.map((v, i) => (v ? i : -1)).filter((i) => i >= 0)
    if (!keepIdx.length) throw new Error(meta.minOne)
    setProgress(30)
    const buf = await readFileAsArrayBuffer(files[0])
    setProgress(60)
    const bytes = await deletePages(buf, keepIdx)
    return { bytes, filename: 'deleted.pdf' }
  }

  const selectedCount = keep.filter(Boolean).length

  return (
    <ToolShell meta={meta} accept=".pdf,application/pdf" multiple={false} onProcess={onProcess} onFilesChange={onFilesChange}>
      {() =>
        total ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm text-gray-300">
              <span>{meta.keepLabel}</span>
              <span className="text-gray-500">{fill(meta.selectedLabel, { selected: selectedCount, total })}</span>
            </div>
            <div className="flex gap-2">
              <button className={miniBtn} onClick={() => selectAll(true)}>
                {meta.selectAll}
              </button>
              <button className={miniBtn} onClick={() => selectAll(false)}>
                {meta.selectNone}
              </button>
            </div>
            <p className="text-xs text-gray-500">{meta.toggleHint}</p>
            <div className="grid grid-cols-6 gap-2 sm:grid-cols-8">
              {Array.from({ length: total }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => toggle(i)}
                  className={`rounded-lg border px-2 py-2 text-sm transition ${
                    keep[i]
                      ? 'border-brand-500 bg-brand-500/10 text-brand-200'
                      : 'border-ink-500 text-gray-500 line-through'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">请先选择 PDF 文件</p>
        )
      }
    </ToolShell>
  )
}
