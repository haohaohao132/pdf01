import ToolShell from '../components/ToolShell'
import { addPageNumbers, readFileAsArrayBuffer } from '../lib/pdfCore'
import { toolById } from '../content'
import { Field, inputCls } from '../components/Field'

export default function PageNumberTool() {
  const meta = toolById('page-number')
  const onProcess = async ({ files, options, setProgress }) => {
    setProgress(30)
    const buf = await readFileAsArrayBuffer(files[0])
    setProgress(60)
    const bytes = await addPageNumbers(buf, {
      position: options.position || meta.positions[5],
      start: Number(options.start || 1),
    })
    return { bytes, filename: 'numbered.pdf' }
  }

  return (
    <ToolShell meta={meta} accept=".pdf,application/pdf" multiple={false} onProcess={onProcess}>
      {({ options, setOpt }) => (
        <div className="space-y-4">
          <Field label={meta.positionLabel}>
            <select className={inputCls} value={options.position || meta.positions[5]} onChange={(e) => setOpt('position', e.target.value)}>
              {meta.positions.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </Field>
          <Field label={meta.startLabel}>
            <input
              type="number"
              min={1}
              className={inputCls}
              value={options.start || 1}
              onChange={(e) => setOpt('start', e.target.value)}
            />
          </Field>
        </div>
      )}
    </ToolShell>
  )
}
