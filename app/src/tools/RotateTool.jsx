import { useState } from 'react'
import ToolShell from '../components/ToolShell'
import { rotatePdf, readFileAsArrayBuffer, loadPdf, parsePageRanges } from '../lib/pdfCore'
import { toolById } from '../content'
import { Field, inputCls } from '../components/Field'

export default function RotateTool() {
  const meta = toolById('rotate')
  const [total, setTotal] = useState(0)

  const onFilesChange = async (files) => {
    if (!files.length) return setTotal(0)
    try {
      const buf = await readFileAsArrayBuffer(files[0])
      const doc = await loadPdf(buf)
      setTotal(doc.getPages().length)
    } catch {
      setTotal(0)
    }
  }

  const onProcess = async ({ files, options, setProgress }) => {
    const delta = options.dir === 'ccw' ? -90 : 90
    const scope = options.scope === 'custom' ? parsePageRanges(options.pages || '', total) : 'all'
    setProgress(30)
    const buf = await readFileAsArrayBuffer(files[0])
    setProgress(60)
    const bytes = await rotatePdf(buf, delta, scope)
    return { bytes, filename: 'rotated.pdf' }
  }

  return (
    <ToolShell meta={meta} accept=".pdf,application/pdf" multiple={false} onProcess={onProcess} onFilesChange={onFilesChange}>
      {({ options, setOpt }) => (
        <div className="space-y-4">
          <Field label={meta.runLabel}>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setOpt('dir', 'cw')}
                className={`flex-1 rounded-lg border px-3 py-2 text-sm ${
                  (options.dir || 'cw') === 'cw' ? 'border-brand-500 bg-brand-500/10 text-brand-200' : 'border-ink-500 text-gray-300'
                }`}
              >
                {meta.clockwise}
              </button>
              <button
                type="button"
                onClick={() => setOpt('dir', 'ccw')}
                className={`flex-1 rounded-lg border px-3 py-2 text-sm ${
                  options.dir === 'ccw' ? 'border-brand-500 bg-brand-500/10 text-brand-200' : 'border-ink-500 text-gray-300'
                }`}
              >
                {meta.counterclockwise}
              </button>
            </div>
          </Field>
          <Field label={meta.rangeLabel}>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setOpt('scope', 'all')}
                className={`flex-1 rounded-lg border px-3 py-2 text-sm ${
                  (options.scope || 'all') === 'all' ? 'border-brand-500 bg-brand-500/10 text-brand-200' : 'border-ink-500 text-gray-300'
                }`}
              >
                {meta.scopeAll}
              </button>
              <button
                type="button"
                onClick={() => setOpt('scope', 'custom')}
                className={`flex-1 rounded-lg border px-3 py-2 text-sm ${
                  options.scope === 'custom' ? 'border-brand-500 bg-brand-500/10 text-brand-200' : 'border-ink-500 text-gray-300'
                }`}
              >
                {meta.scopeCustom}
              </button>
            </div>
          </Field>
          {options.scope === 'custom' && (
            <Field label={meta.rangeLabel} hint={total ? `共 ${total} 页` : null}>
              <input
                className={inputCls}
                placeholder="例如: 1,3,5-8"
                value={options.pages || ''}
                onChange={(e) => setOpt('pages', e.target.value)}
              />
            </Field>
          )}
        </div>
      )}
    </ToolShell>
  )
}
