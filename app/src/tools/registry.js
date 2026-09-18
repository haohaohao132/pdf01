import { Merge, Split, FileImage, Compress, Droplet, Hash, RotateCw, Trash2, ScanText } from 'lucide-react'
import { TOOLS } from '../content'

import MergeTool from './MergeTool'
import SplitTool from './SplitTool'
import ImageToPdfTool from './ImageToPdfTool'
import CompressTool from './CompressTool'
import WatermarkTool from './WatermarkTool'
import PageNumberTool from './PageNumberTool'
import RotateTool from './RotateTool'
import DeletePagesTool from './DeletePagesTool'
import OcrTool from './OcrTool'

// 工具注册表：新增/重排工具只需改这里。
const byId = Object.fromEntries(TOOLS.map((t) => [t.id, t]))

export const registry = [
  { ...byId.merge, Icon: Merge, component: MergeTool },
  { ...byId.split, Icon: Split, component: SplitTool },
  { ...byId['image-to-pdf'], Icon: FileImage, component: ImageToPdfTool },
  { ...byId.compress, Icon: Compress, component: CompressTool },
  { ...byId.watermark, Icon: Droplet, component: WatermarkTool },
  { ...byId['page-number'], Icon: Hash, component: PageNumberTool },
  { ...byId.rotate, Icon: RotateCw, component: RotateTool },
  { ...byId['delete-pages'], Icon: Trash2, component: DeletePagesTool },
  { ...byId.ocr, Icon: ScanText, component: OcrTool },
]

export const getTool = (id) => registry.find((t) => t.id === id)
