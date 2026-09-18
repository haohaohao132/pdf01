import { useState } from 'react'
import ToolShell from '../components/ToolShell'
import { compressPdf, readFileAsArrayBuffer, downloadBytes } from '../lib/pdfCore'
import { toolById, COMMON } from '../content'
import { formatBytes, formatPercent } from '../lib/format'
import Button from '../components/Button'

function Stat({ label, value }) {
  return (
    <div className="rounded-lg border border-ink-500 bg-ink-700 p-3">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="mt-1 text-sm font-medium text-gray-100">{value}</div>
    </div>
  )
}

export default function CompressTool() {
  const meta = toolById('compress')
  const [originalSize, setOriginalSize] = useState(0)

  const onProcess = async ({ files, setProgress }) => {
    setOriginalSize(files[0].size)
    setProgress(30)
    const buf = await readFileAsArrayBuffer(files[0])
    setProgress(70)
    const bytes = await compressPdf(buf)
    return { bytes, filename: 'compressed.pdf' }
  }

  const renderResult = (result) => {
    const compressed = result.bytes.length
    const ratio = originalSize ? (1 - compressed / originalSize) * 100 : 0
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-3 text-center">
          <Stat label={meta.originalLabel} value={formatBytes(originalSize)} />
          <Stat label={meta.compressedLabel} value={formatBytes(compressed)} />
          <Stat label={meta.ratioLabel} value={formatPercent(ratio)} />
        </div>
        <div className="flex justify-end">
          <Button primary onClick={() => downloadBytes(result.bytes, result.filename)}>
            {COMMON.download}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <ToolShell meta={meta} accept=".pdf,application/pdf" multiple={false} onProcess={onProcess} renderResult={renderResult} />
  )
}
