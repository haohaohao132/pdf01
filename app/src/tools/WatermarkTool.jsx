import ToolShell from '../components/ToolShell'
import { addWatermark, readFileAsArrayBuffer } from '../lib/pdfCore'
import { toolById } from '../content'
import { Field, inputCls, Range } from '../components/Field'

export default function WatermarkTool() {
  const meta = toolById('watermark')
  const onProcess = async ({ files, options, setProgress }) => {
    setProgress(30)
    const buf = await readFileAsArrayBuffer(files[0])
    setProgress(60)
    const bytes = await addWatermark(buf, {
      text: options.text || 'Watermark',
      fontSize: Number(options.fontSize || 32),
      opacity: Number(options.opacity || 0.2),
      angle: Number(options.angle || 30),
      count: Number(options.count || 9),
    })
    return { bytes, filename: 'watermarked.pdf' }
  }

  return (
    <ToolShell meta={meta} accept=".pdf,application/pdf" multiple={false} onProcess={onProcess}>
      {({ options, setOpt }) => (
        <div className="space-y-4">
          <Field label={meta.textLabel}>
            <input
              className={inputCls}
              placeholder={meta.textPlaceholder}
              value={options.text || ''}
              onChange={(e) => setOpt('text', e.target.value)}
            />
          </Field>
          <Range label={meta.fontSizeLabel} value={options.fontSize || 32} min={12} max={72} suffix="px" onChange={(v) => setOpt('fontSize', v)} />
          <Range label={meta.opacityLabel} value={options.opacity || 0.2} min={0.05} max={1} step={0.05} onChange={(v) => setOpt('opacity', v)} />
          <Range label={meta.angleLabel} value={options.angle || 30} min={0} max={360} step={5} suffix="°" onChange={(v) => setOpt('angle', v)} />
          <Range label={meta.countLabel} value={options.count || 9} min={1} max={25} onChange={(v) => setOpt('count', v)} />
        </div>
      )}
    </ToolShell>
  )
}
