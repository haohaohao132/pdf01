import ToolShell from '../components/ToolShell'
import { mergePdfs, readFileAsArrayBuffer } from '../lib/pdfCore'
import { toolById } from '../content'

export default function MergeTool() {
  const meta = toolById('merge')
  const onProcess = async ({ files, setProgress }) => {
    setProgress(30)
    const buffers = await Promise.all(files.map(readFileAsArrayBuffer))
    setProgress(70)
    const bytes = await mergePdfs(buffers)
    return { bytes, filename: 'merged.pdf' }
  }
  return <ToolShell meta={meta} accept=".pdf,application/pdf" multiple onProcess={onProcess} />
}
