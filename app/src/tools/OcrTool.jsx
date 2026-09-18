import ToolShell from '../components/ToolShell'
import { readFileAsArrayBuffer, downloadBytes } from '../lib/pdfCore'
import { extractText } from '../lib/pdfjs'
import { toolById, COMMON } from '../content'

function OcrResult({ pages }) {
  const text = pages.map((p) => p.text).join('\n\n')
  const chars = text.replace(/\s/g, '').length
  const copy = () => navigator.clipboard?.writeText(text)
  const exportTxt = () => downloadBytes(new TextEncoder().encode(text), 'extracted.txt')

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="rounded-lg border border-ink-500 bg-ink-700 p-3">
          <div className="text-xs text-gray-500">{toolById('ocr').totalPagesLabel}</div>
          <div className="mt-1 text-sm font-medium text-gray-100">{pages.length}</div>
        </div>
        <div className="rounded-lg border border-ink-500 bg-ink-700 p-3">
          <div className="text-xs text-gray-500">{toolById('ocr').totalCharsLabel}</div>
          <div className="mt-1 text-sm font-medium text-gray-100">{chars}</div>
        </div>
        <div className="rounded-lg border border-ink-500 bg-ink-700 p-3">
          <div className="text-xs text-gray-500">{toolById('ocr').avgLabel}</div>
          <div className="mt-1 text-sm font-medium text-gray-100">{pages.length ? Math.round(chars / pages.length) : 0}</div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={copy}
          className="rounded-lg border border-ink-500 bg-ink-600 px-3 py-1.5 text-xs text-gray-200 hover:bg-ink-500"
        >
          {COMMON.copyLabel}
        </button>
        <button
          onClick={exportTxt}
          className="rounded-lg border border-ink-500 bg-ink-600 px-3 py-1.5 text-xs text-gray-200 hover:bg-ink-500"
        >
          {COMMON.exportLabel}
        </button>
      </div>

      <div>
        <p className="mb-1 text-sm text-gray-300">{toolById('ocr').contentLabel}</p>
        <textarea
          readOnly
          value={text}
          className="h-64 w-full rounded-lg border border-ink-500 bg-ink-700 p-3 text-sm text-gray-200 outline-none"
        />
      </div>
    </div>
  )
}

export default function OcrTool() {
  const meta = toolById('ocr')
  const onProcess = async ({ files, setProgress }) => {
    setProgress(30)
    const buf = await readFileAsArrayBuffer(files[0])
    setProgress(60)
    const pages = await extractText(buf)
    return { custom: <OcrResult pages={pages} /> }
  }
  return <ToolShell meta={meta} accept=".pdf,application/pdf" multiple={false} onProcess={onProcess} />
}
