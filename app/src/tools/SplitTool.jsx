import { useState } from 'react'
import ToolShell from '../components/ToolShell'
import { splitPdf, readFileAsArrayBuffer, loadPdf } from '../lib/pdfCore'
import { toolById, fill } from '../content'
import { Field, inputCls } from '../components/Field'

export default function SplitTool() {
  const meta = toolById('split')
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
    setProgress(30)
    const buf = await readFileAsArrayBuffer(files[0])
    setProgress(60)
    const outputs = await splitPdf(buf, options.range || '')
    setProgress(90)
    if (!outputs.length) throw new Error('未解析到有效页码')
    return { items: outputs }
  }

  return (
    <ToolShell meta={meta} accept=".pdf,application/pdf" multiple={false} onProcess={onProcess} onFilesChange={onFilesChange}>
      {({ options, setOpt }) => (
        <Field label={meta.rangeLabel} hint={total ? fill(meta.totalPagesLabel, { count: total }) : null}>
          <input
            className={inputCls}
            placeholder={meta.rangePlaceholder}
            value={options.range || ''}
            onChange={(e) => setOpt('range', e.target.value)}
          />
        </Field>
      )}
    </ToolShell>
  )
}
