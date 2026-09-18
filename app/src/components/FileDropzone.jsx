import { useRef, useState } from 'react'
import { UploadCloud, FileText, Image as ImageIcon, X } from 'lucide-react'

export default function FileDropzone({ accept, multiple = true, files, onFiles, hint = '点击或拖拽文件到此区域' }) {
  const inputRef = useRef(null)
  const [drag, setDrag] = useState(false)

  const handleList = (list) => {
    const arr = Array.from(list)
    onFiles(multiple ? arr : arr.slice(0, 1))
  }

  const removeAt = (i) => {
    const next = files.filter((_, idx) => idx !== i)
    onFiles(next)
  }

  const isImage = (f) => /image\//.test(f.type) || /\.(png|jpe?g|webp|bmp|gif)$/i.test(f.name)
  const Icon = files.length ? (isImage(files[0]) ? ImageIcon : FileText) : UploadCloud

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setDrag(true)
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDrag(false)
          handleList(e.dataTransfer.files)
        }}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition ${
          drag ? 'border-brand-500 bg-brand-500/10' : 'border-ink-500 bg-ink-800 hover:border-brand-500/60'
        }`}
      >
        <Icon className="h-9 w-9 text-brand-400" />
        <p className="text-sm text-gray-300">{hint}</p>
        <p className="text-xs text-gray-500">支持拖拽，也可点击选择</p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleList(e.target.files)}
        />
      </div>

      {files.length > 0 && (
        <ul className="mt-3 space-y-2">
          {files.map((f, i) => (
            <li
              key={i}
              className="flex items-center justify-between rounded-lg border border-ink-500 bg-ink-700 px-3 py-2 text-sm"
            >
              <span className="flex items-center gap-2 truncate text-gray-200">
                {isImage(f) ? <ImageIcon className="h-4 w-4 text-brand-400" /> : <FileText className="h-4 w-4 text-brand-400" />}
                <span className="truncate">{f.name}</span>
                <span className="text-xs text-gray-500">({(f.size / 1024).toFixed(0)} KB)</span>
              </span>
              <button onClick={() => removeAt(i)} className="text-gray-500 hover:text-red-400" aria-label="移除">
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
