// ============================================================================
//  文案中心 (Content Hub)
//  所有界面文字集中在此文件，改文案只需编辑这里，无需改动组件。
//  主题/颜色集中在 tailwind.config.js 与 src/index.css 的 CSS 变量。
// ============================================================================

export const SITE = {
  name: 'PDF工具箱',
  nameEn: 'PDF Toolbox',
  logoAlt: 'PDF Toolbox Logo',
  // 页脚版权行
  footer: '所有处理均在您的浏览器本地完成，文件不会上传到任何服务器。',
}

export const HERO = {
  title: '免费的在线 PDF 工具箱',
  subtitle: '快速、安全、免费的在线 PDF 工具集。所有文件在浏览器端本地处理，保护您的隐私安全。',
  bullets: ['本地处理', '极速处理', '完全免费', '隐私安全'],
  bulletDetails: {
    本地处理: '文件永远不会离开您的设备',
    极速处理: '浏览器内即时完成',
    完全免费: '无需注册，无使用限制',
    隐私安全: '您的文件只存在您的设备上',
  },
  ctaPrimary: '开始使用',
  ctaSecondary: '查看全部工具',
}

export const FEATURES = [
  { title: '本地处理', desc: '文件永远不会离开您的设备' },
  { title: '极速处理', desc: '浏览器内即时完成' },
  { title: '完全免费', desc: '无需注册，无使用限制' },
  { title: '隐私安全', desc: '您的文件只存在您的设备上' },
]

export const SECTION = {
  toolsTitle: '全部工具',
  toolsSubtitle: '所有工具完全免费，无需注册',
  clickHint: '点击任意工具开始使用',
}

// 9 个工具的基础文案。组件会引用这些字段。
export const TOOLS = [
  {
    id: 'merge',
    title: 'PDF合并',
    desc: '将多个PDF文件合并为一个',
    dropHint: '点击或拖拽PDF文件到此区域',
    multiLabel: '已选择 {count} 个文件',
    runLabel: '合并PDF',
    success: 'PDF合并成功！',
    error: 'PDF合并失败',
  },
  {
    id: 'split',
    title: 'PDF拆分',
    desc: '将PDF文件拆分为多个',
    dropHint: '点击或拖拽PDF文件到此区域',
    runLabel: '拆分PDF',
    success: 'PDF拆分成功！',
    error: 'PDF拆分失败',
    rangeLabel: '页码范围',
    rangePlaceholder: '例如: 1,3,5-8',
    totalPagesLabel: '总页数: {count}',
  },
  {
    id: 'image-to-pdf',
    title: '图片转PDF',
    desc: '将图片转换为PDF格式',
    dropHint: '点击或拖拽图片到此区域',
    multiLabel: '已选择 {count} 张图片',
    runLabel: '转换为PDF',
    success: 'PDF创建成功！',
    error: '创建PDF失败',
  },
  {
    id: 'compress',
    title: 'PDF压缩',
    desc: '减小PDF文件大小',
    dropHint: '点击或拖拽PDF文件到此区域',
    runLabel: '压缩',
    success: 'PDF压缩成功！',
    error: 'PDF压缩失败',
    originalLabel: '原始大小',
    compressedLabel: '压缩后大小',
    ratioLabel: '压缩率',
  },
  {
    id: 'watermark',
    title: '添加水印',
    desc: '为PDF添加文字水印',
    dropHint: '点击或拖拽PDF文件到此区域',
    runLabel: '添加水印',
    success: '水印添加成功！',
    error: '添加水印失败',
    textLabel: '水印文字',
    textPlaceholder: '请输入水印文字（仅支持英文、数字）',
    fontSizeLabel: '字体大小',
    opacityLabel: '透明度',
    angleLabel: '旋转角度',
    countLabel: '水印数量',
    gapLabel: '水印间距',
  },
  {
    id: 'page-number',
    title: '添加页码',
    desc: '为PDF页面添加页码',
    dropHint: '点击或拖拽PDF文件到此区域',
    runLabel: '添加页码',
    success: '页码添加成功！',
    error: '添加页码失败',
    positionLabel: '位置',
    startLabel: '起始页码',
    positions: ['顶部左侧', '顶部居中', '顶部右侧', '底部左侧', '底部居中', '底部右侧'],
  },
  {
    id: 'rotate',
    title: '旋转页面',
    desc: '旋转PDF页面方向',
    dropHint: '点击或拖拽PDF文件到此区域',
    runLabel: '旋转',
    success: '页面旋转成功！',
    error: '页面旋转失败',
    clockwise: '顺时针90°',
    counterclockwise: '逆时针90°',
    rangeLabel: '旋转范围',
    scopeAll: '所有页面',
    scopeCustom: '指定页面',
  },
  {
    id: 'delete-pages',
    title: '删除页面',
    desc: '删除PDF中的指定页面',
    dropHint: '点击或拖拽PDF文件到此区域',
    runLabel: '删除并下载',
    success: '页面删除成功！',
    error: '页面删除失败',
    keepLabel: '选择要保留的页面',
    selectedLabel: '已选择 {selected}/{total} 页',
    selectAll: '全选',
    selectNone: '全不选',
    toggleHint: '点击切换选择状态，未选中的页面将被删除',
    minOne: '请至少保留一个页面',
  },
  {
    id: 'ocr',
    title: 'OCR识别',
    desc: '提取PDF中的文字内容',
    dropHint: '点击或拖拽PDF文件到此区域',
    runLabel: '开始识别',
    success: '文本提取成功！',
    error: '文本提取失败',
    totalPagesLabel: '总页数',
    totalCharsLabel: '总字数',
    avgLabel: '平均每页',
    copyLabel: '复制文本',
    exportLabel: '导出TXT',
    contentLabel: '文本内容',
  },
]

export const COMMON = {
  back: '返回首页',
  download: '下载',
  reset: '重置',
  retry: '重试',
  processing: '处理中...',
  loading: '加载中...',
  cancel: '取消',
  confirm: '确认',
  copy: '复制',
  copied: '已复制！',
  clear: '清空',
  successTitle: '成功！',
  errorTitle: '错误',
  warningTitle: '警告',
  noFile: '请先选择文件',
}

export const toolById = (id) => TOOLS.find((t) => t.id === id)
