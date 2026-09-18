import { useState } from 'react'
import Button from './Button'
import Alert from './Alert'
import ProgressBar from './ProgressBar'
import FileDropzone from './FileDropzone'
import { downloadBytes } from '../lib/pdfCore'
import { COMMON } from '../content'

/**
 * 通用工具外壳：负责选文件、进度、执行、状态与下载。
 * 每个工具只需提供业务逻辑 onProcess 与选项控件。
 *
 * onProcess({ files, options, setProgress }) 应返回：
 *   - { bytes, filename }            单文件下载
 *   - { items: [{name,bytes}] }      多文件下载（如拆分）
 *   - { custom: <ReactNode> }         自定义结果区（如 OCR 文本）
 */
export default function ToolShell({ meta, accept, multiple = true, onProcess, children, renderResult, onFilesChange }) {
  const [files, setFiles] = useState([])
  const [options, setOptions] = useState({})
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('idle') // idle | processing | success | error
  const [message, setMessage] = useState('')
  const [result, setResult] = useState(null)

  const setOpt = (k, v) => setOptions((o) => ({ ...o, [k]: v }))
  const notify = (list) => onFilesChange && onFilesChange(list)
  const setFilesAndNotify = (list) => {
    setFiles(list)
    notify(list)
  }
  const reset = () => {
    setFiles([])
    notify([])
    setOptions({})
    setStatus('idle')
    setMessage('')
    setResult(null)
    setProgress(0)
  }

  const handleRun = async () => {
    if (!files.length) {
      setStatus('error')
      setMessage(COMMON.noFile)
      return
    }
    setStatus('processing')
    setProgress(10)
    setMessage('')
    try {
      const res = await onProcess({ files, options, setProgress, setOpt })
      setResult(res)
      setStatus('success')
      setProgress(100)
      setMessage(meta.success)
    } catch (e) {
      console.error(e)
      setStatus('error')
      setProgress(0)
      setMessage(meta.error + (e?.message ? `：${e.message}` : ''))
    }
  }

  const renderResultArea = () => {
    if (!result) return null
    if (result.custom) return result.custom
    if (renderResult) return renderResult(result)
    if (result.items) {
      return (
        <div className="mt-2 space-y-2">
          {result.items.map((it, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-ink-500 bg-ink-700 px-3 py-2">
              <span className="truncate text-sm text-gray-200">{it.name}</span>
              <Button primary onClick={() => downloadBytes(it.bytes, it.name)}>
                {COMMON.download}
              </Button>
            </div>
          ))}
        </div>
      )
    }
    if (result.bytes) {
      return (
        <div className="mt-2 flex justify-end">
          <Button primary onClick={() => downloadBytes(result.bytes, result.filename)}>
            {COMMON.download}
          </Button>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-5">
      <FileDropzone
        accept={accept}
        multiple={multiple}
        files={files}
        onFiles={(list) => {
          setFilesAndNotify(list)
          setStatus('idle')
          setResult(null)
          setMessage('')
        }}
        hint={meta.dropHint}
      />

      {typeof children === 'function' ? children({ options, setOpt }) : children}

      <div className="flex flex-wrap gap-3">
        <Button primary onClick={handleRun} disabled={status === 'processing' || !files.length}>
          {status === 'processing' ? COMMON.processing : meta.runLabel}
        </Button>
        <Button onClick={reset} disabled={!files.length}>
          {COMMON.reset}
        </Button>
      </div>

      {status === 'processing' && (
        <div className="space-y-1">
          <ProgressBar value={progress} />
          <p className="text-xs text-gray-500">{COMMON.processing}</p>
        </div>
      )}

      {message && <Alert type={status === 'error' ? 'error' : 'success'}>{message}</Alert>}

      {status === 'success' && <div className="mt-2">{renderResultArea()}</div>}
    </div>
  )
}
