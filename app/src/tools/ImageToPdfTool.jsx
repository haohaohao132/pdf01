import ToolShell from '../components/ToolShell'
import { imagesToPdf, readFileAsArrayBuffer } from '../lib/pdfCore'
import { toolById } from '../content'

export default function ImageToPdfTool() {
  const meta = toolById('image-to-pdf')
  const onProcess = async ({ files, setProgress }) => {
    setProgress(20)
    const buffers = await Promise.all(files.map((f) => readFileAsArrayBuffer(f)))
    const types = files.map((f) => f.type)
    setProgress(70)
    const bytes = await imagesToPdf(buffers, types)
    return { bytes, filename: 'images.pdf' }
  }
  return <ToolShell meta={meta} accept="image/*" multiple onProcess={onProcess} />
}
