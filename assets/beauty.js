/* ============================================================
   PDF 工具箱 · 美化版逻辑（原生 JS，无构建步骤，支持中/英切换）
   依赖：vendor/pdf-lib.min.js (PDFLib)  /  vendor/pdf.min.js (pdfjsLib)
   ============================================================ */
(function () {
  "use strict";

  /* ---------- 图标 ---------- */
  const S = (main, deco) =>
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    (deco || "") + main + "</svg>";
  const ICONS = {
    merge: S(
      '<path d="M7 4v2a5 5 0 0 0 5 5h0a5 5 0 0 0 5-5V4"/><path d="M12 11v5"/><path d="M9.5 13.5L12 16l2.5-2.5"/>',
      '<circle cx="12" cy="11" r="2.4" fill="currentColor" opacity=".3" stroke="none"/>'
    ),
    split: S(
      '<circle cx="7" cy="7" r="2.6"/><circle cx="7" cy="17" r="2.6"/><path d="M9.4 8.4L20 17M9.4 15.6L20 7"/>',
      '<circle cx="7" cy="7" r="1" fill="currentColor" opacity=".35" stroke="none"/><circle cx="7" cy="17" r="1" fill="currentColor" opacity=".35" stroke="none"/>'
    ),
    image: S(
      '<path d="M7 3.5h7l4 4V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1z"/><path d="M14 3.5V8h4"/><rect x="7.5" y="12.5" width="9" height="7" rx="1.5"/><path d="M7.5 16.5l2.5-2.5 2 2 2-2 2.5 2.5"/><circle cx="10" cy="14.5" r="1"/>',
      '<rect x="7.5" y="12.5" width="9" height="7" rx="1.5" fill="currentColor" opacity=".2" stroke="none"/>'
    ),
    compress: S(
      '<path d="M9 5v2a2 2 0 0 1-2 2H5M19 9h-2a2 2 0 0 1-2-2V5M15 19v-2a2 2 0 0 1 2-2h2M5 15h2a2 2 0 0 1 2 2v2"/>',
      '<rect x="10" y="10" width="4" height="4" rx="1" fill="currentColor" opacity=".25" stroke="none"/>'
    ),
    watermark: S(
      '<rect x="4" y="3.5" width="16" height="17" rx="2.5"/><path d="M8 9h8M8 13h5"/><path d="M8.4 19l1.7-7 1.7 7M8.3 16.4h3.6"/>',
      '<rect x="14" y="13" width="5.5" height="5.5" rx="1.2" fill="currentColor" opacity=".25" stroke="none"/>'
    ),
    pagenum: S(
      '<path d="M7 4h7l4 4v11a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z"/><path d="M14 4v4h4"/><path d="M9 13h6M9 16h4"/>',
      '<circle cx="15.5" cy="16.5" r="2.4" fill="currentColor" opacity=".28" stroke="none"/>'
    ),
    rotate: S(
      '<path d="M20.5 12a8.5 8.5 0 1 1-2.6-6.1"/><path d="M20.5 3.8V9.5h-5.7"/>',
      '<circle cx="12" cy="12" r="6.5" opacity=".16" stroke="currentColor" stroke-width="1.4" stroke-dasharray="2 3" fill="none"/>'
    ),
    delete: S(
      '<path d="M5 7h14M9 7V5h6v2M7 7l1 13h8l1-13M10 11v5M14 11v5"/>',
      '<rect x="9" y="5" width="6" height="2.4" rx="1" fill="currentColor" opacity=".3" stroke="none"/>'
    ),
    ocr: S(
      '<path d="M7 4h7l4 4v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z"/><path d="M14 4v4h4"/><path d="M8.5 12.5h7M8.5 16h5"/><path d="M4 8V5.5h2.5M4 8h2.5M20 16v2.5h-2.5M20 16h-2.5"/>',
      '<rect x="8.5" y="12" width="7" height="5" rx="1" fill="currentColor" opacity=".22" stroke="none"/>'
    ),
    upload: S(
      '<path d="M12 16V5M8 9l4-4 4 4"/><path d="M5 19h14"/>',
      '<path d="M8 9l4-4 4 4z" fill="currentColor" opacity=".3" stroke="none"/>'
    ),
    file: S(
      '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/>',
      '<path d="M14 3l5 5h-5z" fill="currentColor" opacity=".25" stroke="none"/>'
    ),
    check: S(
      '<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.5 2.5 5-6"/>',
      '<circle cx="12" cy="12" r="9" fill="currentColor" opacity=".22" stroke="none"/>'
    ),
    arrowR: S(
      '<path d="M5 12h13M13 6l6 6-6 6"/>',
      '<path d="M13 6l6 6-6 6z" fill="currentColor" opacity=".28" stroke="none"/>'
    ),
    arrowL: S(
      '<path d="M19 12H6M11 6l-6 6 6 6"/>',
      '<path d="M11 6l-6 6 6 6z" fill="currentColor" opacity=".28" stroke="none"/>'
    ),
    shield: S(
      '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
      '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" fill="currentColor" opacity=".22" stroke="none"/>'
    ),
    bolt: S(
      '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
      '<path d="M13 2L4 14h7l-1 8 9-12h-7z" fill="currentColor" opacity=".25" stroke="none"/>'
    ),
    gift: S(
      '<path d="M20 12v8H4v-8M2 8h20v4H2zM12 8v12"/><path d="M12 8C9 8 8 5 6.5 5.5 5 6 6 8 8.5 8M12 8c3 0 4-3 5.5-2.5C19 6 18 8 15.5 8"/>',
      '<rect x="4" y="12" width="16" height="8" rx="1" fill="currentColor" opacity=".18" stroke="none"/>'
    ),
    x: S(
      '<path d="M6 6l12 12M18 6L6 18"/>',
      '<circle cx="12" cy="12" r="8" fill="currentColor" opacity=".18" stroke="none"/>'
    ),
    download: S(
      '<path d="M12 4v11M8 11l4 4 4-4"/><path d="M5 20h14"/>',
      '<path d="M8 11l4 4 4-4z" fill="currentColor" opacity=".28" stroke="none"/>'
    ),
    topng: S(
      '<path d="M5 3.5h7l4 4V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1z"/><path d="M12 3.5V8h4"/><rect x="12.5" y="3" width="8.5" height="8.5" rx="2"/><path d="M13.5 9.2l2-2 1.6 1.6 1.1-1.1 2 2"/><circle cx="15" cy="5.5" r=".9"/>',
      '<rect x="12.5" y="3" width="8.5" height="8.5" rx="2" fill="currentColor" opacity=".2" stroke="none"/>'
    ),
    key: S(
      '<circle cx="8" cy="8" r="4.2"/><circle cx="8" cy="8" r="1.5"/><path d="M11 11L20 20"/><path d="M16.5 16.5l2.6-2.6M19 19l2.2-2.2"/>',
      '<circle cx="8" cy="8" r="2" fill="currentColor" opacity=".3" stroke="none"/><circle cx="14" cy="14" r=".8" fill="currentColor" opacity=".3" stroke="none"/>'
    ),
    lock: S(
      '<path d="M5.5 11h13a1 1 0 0 1 1 1v7.5a1 1 0 0 1-1 1H5.5a1 1 0 0 1-1-1V12a1 1 0 0 1 1-1z"/><path d="M8.5 11V8a3.5 3.5 0 0 1 7 0v3"/><path d="M12 14v3"/>',
      '<circle cx="12" cy="14.8" r="1.4" fill="currentColor" opacity=".3" stroke="none"/>'
    ),
    unlock: S(
      '<path d="M5.5 11h13a1 1 0 0 1 1 1v7.5a1 1 0 0 1-1 1H5.5a1 1 0 0 1-1-1V12a1 1 0 0 1 1-1z"/><path d="M8.5 11V8a3.5 3.5 0 0 1 6.4-2.1"/><path d="M12 14v3"/>',
      '<circle cx="12" cy="14.8" r="1.4" fill="currentColor" opacity=".3" stroke="none"/>'
    ),
    text: S(
      '<path d="M7 3.5h7l4 4V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1z"/><path d="M14 3.5V8h4"/><path d="M8.5 12.5h7M8.5 16h7M8.5 19h4"/>',
      '<rect x="8.5" y="15" width="7" height="2.2" rx="1.1" fill="currentColor" opacity=".3" stroke="none"/>'
    ),
    stamp: S(
      '<circle cx="12" cy="10" r="6.2"/><circle cx="12" cy="10" r="4.2"/><path d="M12 7.6l1.4 2.8 3.1.3-2.3 2.1.6 3.1-2.8-1.7-2.8 1.7.6-3.1-2.3-2.1 3.1-.3z"/><path d="M6.5 20h11"/>',
      '<circle cx="12" cy="10" r="4.2" fill="currentColor" opacity=".2" stroke="none"/>'
    ),
    blank: S(
      '<path d="M7 3.5h7l4 4V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1z"/><path d="M14 3.5V8h4"/><path d="M12 11v6M9 14h6"/>',
      '<rect x="14" y="3.5" width="4" height="4.5" rx="1" fill="currentColor" opacity=".28" stroke="none"/>'
    ),
    extractpages: S(
      '<path d="M6 4h8l4 4v9a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z"/><path d="M14 4v4h4"/><path d="M16 13h4M19 11l2 2-2 2"/>',
      '<rect x="16" y="13" width="4" height="5" rx="1" fill="currentColor" opacity=".25" stroke="none"/>'
    ),
    info: S(
      '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8h.01"/>',
      '<circle cx="12" cy="12" r="5.4" fill="currentColor" opacity=".22" stroke="none"/>'
    ),
    reorder: S(
      '<path d="M5 8h9M14 5l3 3-3 3"/><path d="M19 16H10M10 13l-3 3 3 3"/>',
      '<circle cx="12" cy="12" r="8.6" fill="currentColor" opacity=".16" stroke="none"/>'
    ),
    splitn: S(
      '<rect x="5" y="3.5" width="14" height="17" rx="2"/><path d="M5 9h14M5 14.5h14"/>',
      '<rect x="5" y="3.5" width="14" height="5.5" rx="2" fill="currentColor" opacity=".22" stroke="none"/>'
    ),
    optimize: S(
      '<path d="M4 7l8-3 8 3v10l-8 3-8-3z"/><path d="M12 9v6M9.5 12.5L12 15l2.5-2.5"/>',
      '<path d="M4 7l8-3 8 3v10l-8 3-8-3z" fill="currentColor" opacity=".18" stroke="none"/>'
    ),
    insert: S(
      '<path d="M7 3.5h6l4 4V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1z"/><path d="M13 3.5V8h4"/><path d="M15.5 12.5H21M18.3 9.7l2.8 2.8-2.8 2.8"/>',
      '<rect x="15.5" y="12.5" width="5.5" height="8" rx="1" fill="currentColor" opacity=".18" stroke="none"/>'
    ),
    html2pdf: S(
      '<path d="M7 3.5h7l4 4V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1z"/><path d="M14 3.5V8h4"/><path d="M9.5 8.5l-2 2.5 2 2.5M14.5 8.5l2 2.5-2 2.5"/>',
      '<rect x="7" y="3.5" width="14" height="17" rx="1" fill="currentColor" opacity=".15" stroke="none"/>'
    ),
    crop: S(
      '<path d="M8 3v13M3 8h13"/><path d="M16 21v-13M21 16h-13"/>',
      '<path d="M8 3v13M3 8h13z" fill="currentColor" opacity=".18" stroke="none"/>'
    ),
    resize: S(
      '<rect x="4" y="4" width="11" height="11" rx="1.5"/><path d="M20 20h-6M14 20l5-5M20 14v6"/>',
      '<rect x="4" y="4" width="11" height="11" rx="1.5" fill="currentColor" opacity=".16" stroke="none"/>'
    ),
    headerfooter: S(
      '<path d="M7 3.5h7l4 4V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1z"/><path d="M14 3.5V8h4"/><path d="M8.5 11h7M8.5 14h7M8.5 17h4"/>',
      '<rect x="8.5" y="10.4" width="7" height="1.8" rx=".9" fill="currentColor" opacity=".3" stroke="none"/><rect x="8.5" y="16.4" width="4" height="1.8" rx=".9" fill="currentColor" opacity=".3" stroke="none"/>'
    ),
    metadata: S(
      '<path d="M3 12l8-8h7a2 2 0 0 1 2 2v7l-8 8z"/><circle cx="14.5" cy="7.5" r="1.6"/>',
      '<path d="M3 12l8-8h7a2 2 0 0 1 2 2v7l-8 8z" fill="currentColor" opacity=".16" stroke="none"/>'
    ),
    duplicate: S(
      '<rect x="6" y="6" width="11" height="13" rx="1.5"/><path d="M3 16V4a1 1 0 0 1 1-1h11"/><path d="M9 10h5M9 13h5"/>',
      '<rect x="6" y="6" width="11" height="13" rx="1.5" fill="currentColor" opacity=".18" stroke="none"/>'
    ),
    sign: S(
      '<path d="M3 17c3 0 4-11 8-11 2 0 1 6 4 6 2 0 2-4 6-4"/><path d="M14 21h7"/>',
      '<circle cx="21" cy="21" r="2.2" fill="currentColor" opacity=".22" stroke="none"/>'
    ),
    reverse: S(
      '<path d="M5 9a7 7 0 0 1 13-2.5M19 4v5h-5"/><path d="M19 15a7 7 0 0 1-13 2.5M5 20v-5h5"/>',
      '<path d="M19 15a7 7 0 0 1-13 2.5" fill="currentColor" opacity=".14" stroke="none"/>'
    ),
    grayscale: S(
      '<circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16z"/><path d="M4 12h16"/>',
      '<circle cx="12" cy="12" r="8" fill="currentColor" opacity=".16" stroke="none"/>'
    ),
    pdf2word: S(
      '<path d="M7 3.5h7l4 4V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1z"/><path d="M14 3.5V8h4"/><path d="M8.4 13l1.9 5 1.7-4 1.7 4 1.9-5"/>',
      '<rect x="7" y="3.5" width="14" height="17" rx="1" fill="currentColor" opacity=".15" stroke="none"/>'
    ),
    extract: S(
      '<rect x="4" y="5" width="16" height="14" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="M5 17l4.5-4.5 3 3 3-3L19 16"/><path d="M19 9v5M19 9h-5"/>',
      '<rect x="4" y="5" width="16" height="14" rx="2" fill="currentColor" opacity=".16" stroke="none"/>'
    ),
    ppt: S(
      '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M12 17v3M9 20h6"/><path d="M9.5 8l4 2.75-4 2.75z"/>',
      '<rect x="3" y="4" width="18" height="13" rx="2" fill="currentColor" opacity=".16" stroke="none"/>'
    ),
    xlsx: S(
      '<rect x="4" y="3.5" width="16" height="17" rx="2"/><path d="M4 9h16M4 14h16M10 9v11M14 9v11"/>',
      '<rect x="4" y="3.5" width="16" height="5.5" rx="2" fill="currentColor" opacity=".2" stroke="none"/>'
    ),
    rmblank: S(
      '<path d="M7 3.5h7l4 4V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1z"/><path d="M14 3.5V8h4"/><path d="M9 12.5h6M9 15.5h4"/>',
      '<rect x="9" y="11.5" width="6" height="6.5" rx="1" fill="currentColor" opacity=".18" stroke="none"/>'
    ),
    pdf2long: S(
      '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 7.5h6M9 10.5h6M9 13.5h4"/><path d="M12 16.5v4.5M9.5 19l2.5 2.5 2.5-2.5"/>',
      '<rect x="5" y="3" width="14" height="18" rx="2" fill="currentColor" opacity=".14" stroke="none"/>'
    ),
    links: S(
      '<path d="M8.5 11a3.5 3.5 0 0 1 0-5l2-2a3.5 3.5 0 0 1 5 5l-1.5 1.5"/><path d="M15.5 13a3.5 3.5 0 0 1 0 5l-2 2a3.5 3.5 0 0 1-5-5l1.5-1.5"/>',
      '<path d="M8.5 11a3.5 3.5 0 0 1 0-5l2-2a3.5 3.5 0 0 1 5 5l-1.5 1.5z" fill="currentColor" opacity=".16" stroke="none"/>'
    ),
    booklet: S(
      '<rect x="3.5" y="3.5" width="17" height="17" rx="2"/><path d="M12 3.5v17M3.5 12h17"/>',
      '<rect x="3.5" y="3.5" width="17" height="17" rx="2" fill="currentColor" opacity=".14" stroke="none"/>'
    ),
    cover: S(
      '<path d="M12 5.5C10 4 7 4 5 4.5v14c2-.5 5-.5 7 1 2-1.5 5-1.5 7-1V4.5c-2-.5-5-.5-7-1z"/><path d="M12 5.5v15"/>',
      '<path d="M12 5.5C10 4 7 4 5 4.5v14c2-.5 5-.5 7 1 2-1.5 5-1.5 7-1V4.5c-2-.5-5-.5-7-1z" fill="currentColor" opacity=".16" stroke="none"/>'
    ),
    repair: S(
      '<path d="M15 4a4 4 0 0 0-5 5l-6 6 3 3 6-6a4 4 0 0 0 5-5l-2.5 2.5-2-2L17 6z"/>',
      '<path d="M15 4a4 4 0 0 0-5 5l-6 6 3 3 6-6a4 4 0 0 0 5-5l-2.5 2.5z" fill="currentColor" opacity=".18" stroke="none"/>'
    ),
    bg: S(
      '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 13h16M13 4v9"/>',
      '<rect x="4" y="4" width="16" height="9" rx="2" fill="currentColor" opacity=".2" stroke="none"/>'
    ),
    margin: S(
      '<rect x="3" y="5" width="18" height="14" rx="1.5"/><rect x="7" y="8.5" width="10" height="7" rx="1" stroke-dasharray="2 2"/>',
      '<rect x="7" y="8.5" width="10" height="7" rx="1" fill="currentColor" opacity=".16" stroke="none"/>'
    ),
    wmimg: S(
      '<rect x="3" y="4" width="13" height="13" rx="2"/><circle cx="7.6" cy="8" r="1.3"/><path d="M3.5 14.5l3.5-3 2 1.6L12.5 10l3.5 3.5"/><rect x="12" y="10.5" width="8.5" height="8.5" rx="2" stroke-width="1.8"/>',
      '<rect x="12" y="10.5" width="8.5" height="8.5" rx="2" fill="currentColor" opacity=".18" stroke="none"/>'
    ),
    outline: S(
      '<path d="M7 3h10a1 1 0 0 1 1 1v17l-6-3.6L6 21V4a1 1 0 0 1 1-1z"/><path d="M10 7.5h4M10 11h4"/>',
      '<circle cx="12" cy="12" r="9" opacity=".12" stroke="currentColor" stroke-width="1.4" stroke-dasharray="2 3" fill="none"/>'
    ),
    formfields: S(
      '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
      '<circle cx="8" cy="8" r="1.1" fill="currentColor" opacity=".45" stroke="none"/><circle cx="8" cy="12" r="1.1" fill="currentColor" opacity=".45" stroke="none"/>'
    ),
    rmanno: S(
      '<path d="M4 14.5l7-7 5.5 5.5-4 4H8z"/><path d="M9.5 19h10.5"/>',
      '<path d="M4 14.5l7-7 5.5 5.5-4 4H8z" fill="currentColor" opacity=".16" stroke="none"/>'
    ),
    burst: S(
      '<rect x="5" y="5" width="13" height="14" rx="1.6"/><path d="M12 5v14"/>',
      '<rect x="3" y="3" width="13" height="14" rx="1.6" opacity=".14" stroke="currentColor" fill="none"/>'
    ),
    oddeven: S(
      '<path d="M5 6h6v12H5z"/><path d="M13 6h6v12h-6z" fill="currentColor" opacity=".35" stroke="none"/>',
      '<circle cx="8" cy="3.4" r="1" fill="currentColor" opacity=".3" stroke="none"/><circle cx="16" cy="3.4" r="1" fill="currentColor" opacity=".3" stroke="none"/>'
    ),
    attach: S(
      '<path d="M16.5 7.5l-6 6a2 2 0 0 0 3 3l6-6a3.5 3.5 0 0 0-5-5l-6.5 6.5a5 5 0 0 0 7 7l5.5-5.5"/>',
      '<rect x="3" y="3" width="18" height="18" rx="3" opacity=".1" stroke="currentColor" fill="none"/>'
    ),
    collate: S(
      '<path d="M6 4h7v7H6z"/><path d="M11 13h7v7h-7z" fill="currentColor" opacity=".3" stroke="none"/>',
      '<rect x="3" y="3" width="18" height="18" rx="3" opacity=".1" stroke="currentColor" fill="none"/>'
    ),
    splitbm: S(
      '<path d="M7 4h10v16l-5-3-5 3z"/>',
      '<path d="M3.5 12h17" opacity=".25"/>'
    ),
    wordcount: S(
      '<path d="M5 7h14M5 11h14M5 15h9"/><path d="M15 15h4" opacity=".5"/>',
      '<rect x="3" y="3" width="18" height="18" rx="3" opacity=".1" stroke="currentColor" fill="none"/>'
    ),
    addlink: S(
      `<path d='M9 12h6'/><path d='M10 8H8a4 4 0 0 0 0 8h2'/><path d='M14 8h2a4 4 0 0 1 0 8h-2'/>`,
      `<rect x='3' y='3' width='18' height='18' rx='3' opacity='.1' stroke='currentColor' fill='none'/>`
    ),
    bates: S(
      `<path d='M5 21h14'/><path d='M7 17V8a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v9'/><path d='M9 12h6' opacity='.5'/>`,
      `<rect x='3' y='3' width='18' height='18' rx='3' opacity='.1' stroke='currentColor' fill='none'/>`
    ),
    overlay: S(
      `<path d='M8 4h8v12H8z'/><path d='M4 8h8v12H4z' opacity='.4'/>`,
      `<rect x='3' y='3' width='18' height='18' rx='3' opacity='.1' stroke='currentColor' fill='none'/>`
    ),
    compare: S(
      `<path d='M4 6h7M4 10h7M4 14h5'/><path d='M13 6h7M13 10h7M13 14h5'/>`,
      `<rect x='3' y='3' width='18' height='18' rx='3' opacity='.1' stroke='currentColor' fill='none'/>`
    ),
    annoextract: S(
      `<path d='M5 5h14v10H9l-4 4z'/><path d='M8 9h8M8 12h5' opacity='.6'/>`,
      `<rect x='3' y='3' width='18' height='18' rx='3' opacity='.1' stroke='currentColor' fill='none'/>`
    ),
    papersize: S(
      `<path d='M7 3h7l4 4v14H7z'/><path d='M14 3v4h4' opacity='.5'/><path d='M10 13h6M10 16h6' opacity='.5'/>`,
      `<rect x='3' y='3' width='18' height='18' rx='3' opacity='.1' stroke='currentColor' fill='none'/>`
    ),
    border: S(
      `<rect x='4' y='4' width='16' height='16' rx='2' fill='none' stroke='currentColor' stroke-width='2'/><path d='M4 9h16M4 15h16M9 4v16M15 4v16' opacity='.3'/>`,
      `<rect x='3' y='3' width='18' height='18' rx='3' opacity='.1' stroke='currentColor' fill='none'/>`
    ),
    redact: S(
      `<rect x='4' y='6' width='16' height='12' rx='2' fill='none' stroke='currentColor' stroke-width='1.6'/><rect x='8' y='10' width='8' height='4' fill='currentColor'/>`,
      `<rect x='3' y='3' width='18' height='18' rx='3' opacity='.1' stroke='currentColor' fill='none'/>`
    ),
    fontlist: S(
      `<path d='M5 18l4-12h2l4 12M7.5 14h5' fill='none' stroke='currentColor' stroke-width='1.8' stroke-linejoin='round'/>`,
      `<rect x='3' y='3' width='18' height='18' rx='3' opacity='.1' stroke='currentColor' fill='none'/>`
    ),
    pagesizes: S(
      `<rect x='5' y='4' width='14' height='16' rx='2' fill='none' stroke='currentColor' stroke-width='1.6'/><path d='M5 8h14M9 4v4' opacity='.5'/><path d='M12 12v5M9.5 14.5h5' opacity='.6'/>`,
      `<rect x='3' y='3' width='18' height='18' rx='3' opacity='.1' stroke='currentColor' fill='none'/>`
    ),
    removemeta: S(
      `<path d='M7 4h7l4 4v12H7z' fill='none' stroke='currentColor' stroke-width='1.6'/><path d='M9 9l6 6M15 9l-6 6' stroke='currentColor' stroke-width='1.8'/>`,
      `<rect x='3' y='3' width='18' height='18' rx='3' opacity='.1' stroke='currentColor' fill='none'/>`
    ),
    datestamp: S(
      `<rect x='4' y='5' width='16' height='15' rx='2' fill='none' stroke='currentColor' stroke-width='1.6'/><path d='M4 9h16M8 3v4M16 3v4' opacity='.6'/><circle cx='12' cy='14' r='2' fill='currentColor'/>`,
      `<rect x='3' y='3' width='18' height='18' rx='3' opacity='.1' stroke='currentColor' fill='none'/>`
    ),
    flatten: S(
      `<path d='M7 3h7l4 4v14H7z' fill='none' stroke='currentColor' stroke-width='1.6'/><path d='M14 3v4h4' opacity='.5'/><path d='M9 12h6M9 15h6' stroke='currentColor' stroke-width='1.6' stroke-linecap='round'/>`,
      `<rect x='3' y='3' width='18' height='18' rx='3' opacity='.1' stroke='currentColor' fill='none'/>`
    ),
    embed: S(
      `<path d='M16 8l-7 7a3 3 0 0 1-4-4l8-8a5 5 0 0 1 7 7l-7 7' fill='none' stroke='currentColor' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'/>`,
      `<rect x='3' y='3' width='18' height='18' rx='3' opacity='.1' stroke='currentColor' fill='none'/>`
    ),
    mkbm: S(
      `<path d='M7 4h10v16l-5-3-5 3z' fill='none' stroke='currentColor' stroke-width='1.6' stroke-linejoin='round'/>`,
      `<rect x='3' y='3' width='18' height='18' rx='3' opacity='.1' stroke='currentColor' fill='none'/>`
    ),
    ocrpdf: S(
      `<path d='M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7' fill='none' stroke='currentColor' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'/><circle cx='15.5' cy='15.5' r='3.2' fill='none' stroke='currentColor' stroke-width='1.7'/><path d='M18 18l2.6 2.6' stroke='currentColor' stroke-width='1.7' stroke-linecap='round'/>`,
      `<rect x='3' y='3' width='18' height='18' rx='3' opacity='.1' stroke='currentColor' fill='none'/>`
    ),
    pdf2html: S(
      `<path d='M7 3h7l4 4v14H7z' fill='none' stroke='currentColor' stroke-width='1.7' stroke-linejoin='round'/><path d='M14 3v4h4' opacity='.5'/><path d='M10 12l-2 2 2 2M14 12l2 2-2 2' fill='none' stroke='currentColor' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/>`,
      `<rect x='3' y='3' width='18' height='18' rx='3' opacity='.1' stroke='currentColor' fill='none'/>`
    ),
    unify: S(
      `<rect x='4' y='6' width='9' height='12' rx='1.5' fill='none' stroke='currentColor' stroke-width='1.7'/><rect x='11' y='8' width='9' height='12' rx='1.5' fill='none' stroke='currentColor' stroke-width='1.7' opacity='.55'/>`,
      `<rect x='3' y='3' width='18' height='18' rx='3' opacity='.1' stroke='currentColor' fill='none'/>`
    ),
    wmcn: S(
      `<rect x='4' y='3' width='16' height='18' rx='2' fill='none' stroke='currentColor' stroke-width='1.7'/><path d='M9 9h6M12 9v8' fill='none' stroke='currentColor' stroke-width='1.7' stroke-linecap='round'/>`,
      `<rect x='3' y='3' width='18' height='18' rx='3' opacity='.1' stroke='currentColor' fill='none'/>`
    ),
    bm2md: S(
      `<path d='M7 4h10v16l-5-3-5 3z' fill='none' stroke='currentColor' stroke-width='1.6' stroke-linejoin='round'/><path d='M10 12.5h.6L12 10l1.4 2.5H14' fill='none' stroke='currentColor' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/>`,
      `<rect x='3' y='3' width='18' height='18' rx='3' opacity='.1' stroke='currentColor' fill='none'/>`
    ),
    resize2: S(
      `<rect x='5' y='6' width='14' height='12' rx='1.5' fill='none' stroke='currentColor' stroke-width='1.7'/><path d='M9 3v3M9 3l-1.4 1.4M9 3l1.4 1.4M15 21v-3M15 21l-1.4-1.4M15 21l1.4-1.4' fill='none' stroke='currentColor' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/>`,
      `<rect x='3' y='3' width='18' height='18' rx='3' opacity='.1' stroke='currentColor' fill='none'/>`
    ),
    formfill: S(
      `<rect x='5' y='3' width='14' height='18' rx='2' fill='none' stroke='currentColor' stroke-width='1.7'/><path d='M8 8h8M8 12h8M8 16h5' fill='none' stroke='currentColor' stroke-width='1.5'/><circle cx='16.5' cy='15.5' r='2.6' fill='none' stroke='currentColor' stroke-width='1.5'/>`,
      `<rect x='3' y='3' width='18' height='18' rx='3' opacity='.1' stroke='currentColor' fill='none'/>`
    ),
    formexport: S(
      `<path d='M12 3v10m0 0l-3.5-3.5M12 13l3.5-3.5' fill='none' stroke='currentColor' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'/><path d='M5 17h14' fill='none' stroke='currentColor' stroke-width='1.7' stroke-linecap='round'/><rect x='5' y='3' width='14' height='14' rx='2' fill='none' stroke='currentColor' stroke-width='1.7'/>`,
      `<rect x='3' y='3' width='18' height='18' rx='3' opacity='.1' stroke='currentColor' fill='none'/>`
    ),
    duplex: S(
      `<rect x='3' y='5' width='8' height='14' rx='1' fill='none' stroke='currentColor' stroke-width='1.7'/><rect x='13' y='5' width='8' height='14' rx='1' fill='none' stroke='currentColor' stroke-width='1.7'/><path d='M12 4v16' fill='none' stroke='currentColor' stroke-width='1.3' stroke-dasharray='2 2'/>`,
      `<rect x='3' y='3' width='18' height='18' rx='3' opacity='.1' stroke='currentColor' fill='none'/>`
    ),
    splitsize: S(
      `<rect x='4' y='6' width='16' height='12' rx='1.5' fill='none' stroke='currentColor' stroke-width='1.7'/><path d='M4 10h16M4 14h16' fill='none' stroke='currentColor' stroke-width='1.2' stroke-dasharray='2 2'/><path d='M12 6v12' fill='none' stroke='currentColor' stroke-width='1.5'/>`,
      `<rect x='3' y='3' width='18' height='18' rx='3' opacity='.1' stroke='currentColor' fill='none'/>`
    ),
    autocrop: S(
      `<rect x='4' y='4' width='16' height='16' rx='1.5' fill='none' stroke='currentColor' stroke-width='1.7'/><path d='M7 7h10v10H7z' fill='none' stroke='currentColor' stroke-width='1.5'/><path d='M4 7h3M4 17h3M17 7h3M17 17h3M7 4v3M17 4v3M7 17v3M17 17v3' fill='none' stroke='currentColor' stroke-width='1.4'/>`,
      `<rect x='3' y='3' width='18' height='18' rx='3' opacity='.1' stroke='currentColor' fill='none'/>`
    ),
    autobm: S(
      `<path d='M4 5h10M4 9h14M4 13h8M4 17h12' fill='none' stroke='currentColor' stroke-width='1.7' stroke-linecap='round'/><path d='M16 5l3 3-3 3' fill='none' stroke='currentColor' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/>`,
      `<rect x='3' y='3' width='18' height='18' rx='3' opacity='.1' stroke='currentColor' fill='none'/>`
    ),
    nup: S(
      `<rect x='4' y='4' width='7' height='7' rx='1' fill='none' stroke='currentColor' stroke-width='1.6'/><rect x='13' y='4' width='7' height='7' rx='1' fill='none' stroke='currentColor' stroke-width='1.6'/><rect x='4' y='13' width='7' height='7' rx='1' fill='none' stroke='currentColor' stroke-width='1.6'/><rect x='13' y='13' width='7' height='7' rx='1' fill='none' stroke='currentColor' stroke-width='1.6'/>`,
      `<rect x='3' y='3' width='18' height='18' rx='3' opacity='.1' stroke='currentColor' fill='none'/>`
    ),
    mdtext: S(
      `<path d='M7 8h4l-2 3-2-3' fill='none' stroke='currentColor' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/><path d='M14 8v6' fill='none' stroke='currentColor' stroke-width='1.6' stroke-linecap='round'/><path d='M11.2 14.2L12.5 15.5L14 14.2' fill='none' stroke='currentColor' stroke-width='1.3' stroke-linecap='round' stroke-linejoin='round'/>`,
      `<rect x='3' y='3' width='18' height='18' rx='3' opacity='.1' stroke='currentColor' fill='none'/>`
    ),
    recompress: S(
      `<path d='M12 4v9' fill='none' stroke='currentColor' stroke-width='1.7' stroke-linecap='round'/><path d='M8.5 9.5L12 13l3.5-3.5' fill='none' stroke='currentColor' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'/><rect x='5' y='15' width='14' height='4' rx='1.2' fill='none' stroke='currentColor' stroke-width='1.5'/>`,
      `<rect x='3' y='3' width='18' height='18' rx='3' opacity='.1' stroke='currentColor' fill='none'/>`
    ),
    annotate: S(
      `<path d='M4 16l8-8 3 3-8 8H4v-3z' fill='none' stroke='currentColor' stroke-width='1.6' stroke-linejoin='round'/><path d='M14 6l3 3' fill='none' stroke='currentColor' stroke-width='1.6' stroke-linecap='round'/>`,
      `<rect x='3' y='3' width='18' height='18' rx='3' opacity='.1' stroke='currentColor' fill='none'/>`
    )
  };

  /* ---------- 每个工具的主题色（图标着色 + 渐变徽章） ---------- */
  const TCOLORS = {
    _default:  { c: "#6366f1", bg: "#eef2ff", g: "linear-gradient(135deg,#6366f1,#818cf8)" },
    merge:     { c: "#6366f1", bg: "#eef2ff", g: "linear-gradient(135deg,#6366f1,#818cf8)" },
    split:     { c: "#10b981", bg: "#ecfdf5", g: "linear-gradient(135deg,#10b981,#34d399)" },
    image:     { c: "#f59e0b", bg: "#fffbeb", g: "linear-gradient(135deg,#f59e0b,#fbbf24)" },
    compress:  { c: "#0ea5e9", bg: "#e0f2fe", g: "linear-gradient(135deg,#0ea5e9,#38bdf8)" },
    watermark: { c: "#8b5cf6", bg: "#f5f3ff", g: "linear-gradient(135deg,#8b5cf6,#a78bfa)" },
    pagenum:   { c: "#ec4899", bg: "#fdf2f8", g: "linear-gradient(135deg,#ec4899,#f472b6)" },
    rotate:    { c: "#14b8a6", bg: "#f0fdfa", g: "linear-gradient(135deg,#14b8a6,#2dd4bf)" },
    delete:    { c: "#f43f5e", bg: "#fff1f2", g: "linear-gradient(135deg,#f43f5e,#fb7185)" },
    ocr:       { c: "#f97316", bg: "#fff7ed", g: "linear-gradient(135deg,#f97316,#fb923c)" },
    pdf2img:   { c: "#06b6d4", bg: "#ecfeff", g: "linear-gradient(135deg,#06b6d4,#22d3ee)" },
    password:  { c: "#9333ea", bg: "#faf5ff", g: "linear-gradient(135deg,#9333ea,#c084fc)" },
    encrypt:   { c: "#dc2626", bg: "#fef2f2", g: "linear-gradient(135deg,#dc2626,#f87171)" },
    decrypt:   { c: "#ca8a04", bg: "#fefce8", g: "linear-gradient(135deg,#ca8a04,#facc15)" },
    extract:   { c: "#2563eb", bg: "#eff6ff", g: "linear-gradient(135deg,#2563eb,#60a5fa)" },
    seal:      { c: "#c026d3", bg: "#fdf4ff", g: "linear-gradient(135deg,#c026d3,#e879f9)" },
    blank:      { c: "#0e7490", bg: "#ecfeff", g: "linear-gradient(135deg,#0e7490,#22d3ee)" },
    extractpages: { c: "#1d4ed8", bg: "#eff6ff", g: "linear-gradient(135deg,#1d4ed8,#60a5fa)" },
    info:       { c: "#475569", bg: "#f8fafc", g: "linear-gradient(135deg,#475569,#94a3b8)" },
    reorder:    { c: "#b45309", bg: "#fffbeb", g: "linear-gradient(135deg,#b45309,#f59e0b)" },
    splitn:     { c: "#be123c", bg: "#fff1f2", g: "linear-gradient(135deg,#be123c,#fb7185)" },
    optimize:   { c: "#0d9488", bg: "#f0fdfa", g: "linear-gradient(135deg,#0d9488,#2dd4bf)" },
    insert:     { c: "#7c3aed", bg: "#f5f3ff", g: "linear-gradient(135deg,#7c3aed,#a78bfa)" },
    html2pdf:   { c: "#a21caf", bg: "#fdf4ff", g: "linear-gradient(135deg,#a21caf,#d946ef)" },
    crop:       { c: "#65a30d", bg: "#f7fee7", g: "linear-gradient(135deg,#65a30d,#84cc16)" },
    resize:     { c: "#0284c7", bg: "#e0f2fe", g: "linear-gradient(135deg,#0284c7,#38bdf8)" },
    headerfooter: { c: "#be185d", bg: "#fdf2f8", g: "linear-gradient(135deg,#be185d,#f472b6)" },
    metadata:   { c: "#6d28d9", bg: "#f5f3ff", g: "linear-gradient(135deg,#6d28d9,#a78bfa)" },
    duplicate:  { c: "#155e75", bg: "#ecfeff", g: "linear-gradient(135deg,#155e75,#22d3ee)" },
    sign:       { c: "#c2410c", bg: "#fff7ed", g: "linear-gradient(135deg,#c2410c,#fb923c)" },
    reverse:    { c: "#334155", bg: "#f8fafc", g: "linear-gradient(135deg,#334155,#94a3b8)" },
    grayscale:  { c: "#475569", bg: "#f8fafc", g: "linear-gradient(135deg,#475569,#94a3b8)" },
    pdf2word:   { c: "#1d4ed8", bg: "#eff6ff", g: "linear-gradient(135deg,#1d4ed8,#3b82f6)" },
    extract:    { c: "#0f766e", bg: "#f0fdfa", g: "linear-gradient(135deg,#0f766e,#14b8a6)" },
    ppt:        { c: "#e11d48", bg: "#fff1f2", g: "linear-gradient(135deg,#e11d48,#fb7185)" },
    xlsx:       { c: "#15803d", bg: "#f0fdf4", g: "linear-gradient(135deg,#15803d,#4ade80)" },
    rmblank:    { c: "#db2777", bg: "#fdf2f8", g: "linear-gradient(135deg,#db2777,#f472b6)" },
    pdf2long:   { c: "#0ea5e9", bg: "#e0f2fe", g: "linear-gradient(135deg,#0ea5e9,#38bdf8)" },
    links:      { c: "#2563eb", bg: "#eff6ff", g: "linear-gradient(135deg,#2563eb,#60a5fa)" },
    booklet:    { c: "#d97706", bg: "#fffbeb", g: "linear-gradient(135deg,#d97706,#fbbf24)" },
    cover:      { c: "#9333ea", bg: "#faf5ff", g: "linear-gradient(135deg,#9333ea,#c084fc)" },
    repair:     { c: "#16a34a", bg: "#f0fdf4", g: "linear-gradient(135deg,#16a34a,#4ade80)" },
    bg:         { c: "#d97706", bg: "#fffbeb", g: "linear-gradient(135deg,#d97706,#fbbf24)" },
    margin:     { c: "#0284c7", bg: "#e0f2fe", g: "linear-gradient(135deg,#0284c7,#38bdf8)" },
    wmimg:      { c: "#db2777", bg: "#fdf2f8", g: "linear-gradient(135deg,#db2777,#f472b6)" },
    outline:    { c: "#7c3aed", bg: "#f5f3ff", g: "linear-gradient(135deg,#7c3aed,#a78bfa)" },
    formfields: { c: "#2563eb", bg: "#eff6ff", g: "linear-gradient(135deg,#2563eb,#60a5fa)" },
    rmanno:     { c: "#be123c", bg: "#fff1f2", g: "linear-gradient(135deg,#be123c,#fb7185)" },
    burst:      { c: "#0d9488", bg: "#f0fdfa", g: "linear-gradient(135deg,#0d9488,#2dd4bf)" },
    oddeven:    { c: "#ca8a04", bg: "#fefce8", g: "linear-gradient(135deg,#ca8a04,#facc15)" },
    attach:     { c: "#0891b2", bg: "#ecfeff", g: "linear-gradient(135deg,#0891b2,#22d3ee)" },
    collate:    { c: "#7c3aed", bg: "#f5f3ff", g: "linear-gradient(135deg,#7c3aed,#a78bfa)" },
    splitbm:    { c: "#db2777", bg: "#fdf2f8", g: "linear-gradient(135deg,#db2777,#f472b6)" },
    wordcount:  { c: "#2563eb", bg: "#eff6ff", g: "linear-gradient(135deg,#2563eb,#60a5fa)" },
    addlink:     { c: '#0891b2', bg: '#ecfeff', g: 'linear-gradient(135deg,#0891b2,#22d3ee)' },
    bates:       { c: '#b45309', bg: '#fffbeb', g: 'linear-gradient(135deg,#b45309,#f59e0b)' },
    overlay:     { c: '#7c3aed', bg: '#f5f3ff', g: 'linear-gradient(135deg,#7c3aed,#a78bfa)' },
    compare:     { c: '#0f766e', bg: '#f0fdfa', g: 'linear-gradient(135deg,#0f766e,#2dd4bf)' },
    annoextract: { c: '#be123c', bg: '#fff1f2', g: 'linear-gradient(135deg,#be123c,#fb7185)' },
    papersize:   { c: '#1d4ed8', bg: '#eff6ff', g: 'linear-gradient(135deg,#1d4ed8,#60a5fa)' },
    border:      { c: '#7c3aed', bg: '#f5f3ff', g: 'linear-gradient(135deg,#7c3aed,#a78bfa)' },
    redact:      { c: '#dc2626', bg: '#fef2f2', g: 'linear-gradient(135deg,#dc2626,#f87171)' },
    fontlist:    { c: '#0ea5e9', bg: '#e0f2fe', g: 'linear-gradient(135deg,#0ea5e9,#38bdf8)' },
    pagesizes:   { c: '#4f46e5', bg: '#eef2ff', g: 'linear-gradient(135deg,#4f46e5,#818cf8)' },
    removemeta:  { c: '#059669', bg: '#ecfdf5', g: 'linear-gradient(135deg,#059669,#34d399)' },
    datestamp:   { c: '#0891b2', bg: '#ecfeff', g: 'linear-gradient(135deg,#0891b2,#22d3ee)' },
    flatten:     { c: '#db2777', bg: '#fdf2f8', g: 'linear-gradient(135deg,#db2777,#f472b6)' },
    embed:       { c: '#0d9488', bg: '#ccfbf1', g: 'linear-gradient(135deg,#0d9488,#2dd4bf)' },
    mkbm:        { c: '#7c3aed', bg: '#f5f3ff', g: 'linear-gradient(135deg,#7c3aed,#a78bfa)' },
    ocrpdf:      { c: '#0f766e', bg: '#ccfbf1', g: 'linear-gradient(135deg,#0f766e,#2dd4bf)' },
    pdf2html:    { c: '#475569', bg: '#f1f5f9', g: 'linear-gradient(135deg,#475569,#94a3b8)' },
    unify:       { c: '#4338ca', bg: '#eef2ff', g: 'linear-gradient(135deg,#4338ca,#818cf8)' },
    wmcn:        { c: '#be185d', bg: '#fdf2f8', g: 'linear-gradient(135deg,#be185d,#f472b6)' },
    bm2md:       { c: '#9333ea', bg: '#faf5ff', g: 'linear-gradient(135deg,#9333ea,#c084fc)' },
    resize2:     { c: '#1d4ed8', bg: '#eff6ff', g: 'linear-gradient(135deg,#1d4ed8,#60a5fa)' },
    formfill:    { c: '#0d9488', bg: '#ccfbf1', g: 'linear-gradient(135deg,#0d9488,#2dd4bf)' },
    formexport:  { c: '#0891b2', bg: '#ecfeff', g: 'linear-gradient(135deg,#0891b2,#22d3ee)' },
    duplex:      { c: '#7c3aed', bg: '#f5f3ff', g: 'linear-gradient(135deg,#7c3aed,#a78bfa)' },
    splitsize:   { c: '#4338ca', bg: '#eef2ff', g: 'linear-gradient(135deg,#4338ca,#818cf8)' },
    autocrop:    { c: '#16a34a', bg: '#f0fdf4', g: 'linear-gradient(135deg,#16a34a,#4ade80)' },
    autobm:      { c: '#c026d3', bg: '#fdf4ff', g: 'linear-gradient(135deg,#c026d3,#e879f9)' },
    nup:         { c: '#7c3aed', bg: '#f5f3ff', g: 'linear-gradient(135deg,#7c3aed,#a78bfa)' },
    mdtext:      { c: '#10b981', bg: '#ecfdf5', g: 'linear-gradient(135deg,#10b981,#34d399)' },
    recompress:  { c: '#14b8a6', bg: '#ccfbf1', g: 'linear-gradient(135deg,#14b8a6,#2dd4bf)' },
    annotate:    { c: '#f59e0b', bg: '#fffbeb', g: 'linear-gradient(135deg,#f59e0b,#fbbf24)' }
  };

  /* ---------- 国际化：中英对照 ---------- */
  const LANGS = {
    zh: {
      docTitle: "PDF 工具箱 · 免费在线 PDF 处理",
      brandName: "PDF<span class='grad-text'>工具箱</span>",
      navAllTools: "全部工具", navFeatures: "功能特性", navStart: "开始使用",
      heroBadge: "100% 浏览器本地处理 · 文件不上传",
      heroTitle: "免费在线 <span class='grad-text'>PDF 工具箱</span><br />合并 · 拆分 · 压缩 · 转换 · 加密 · OCR",
      heroSub: "覆盖合并、转换、编辑、加密与识别的 PDF 工具箱，全部在您的设备本地完成。无需注册、没有广告、不必担心隐私泄露。",
      heroCta1: "立即开始处理", heroCta2: "了解特性",
      trust1: "本地处理 · 无需上传", trust2: "极速引擎 · 秒级完成", trust3: "完全免费 · 无需注册",
      toolCount: "共 {0} 款实用工具",
      searchPh: "搜索工具（名称或功能）", noResults: "没有找到匹配的工具，换个关键词试试。",
      catAll: "全部", cat_merge: "合并拆分", cat_organize: "页面整理", cat_convert: "格式转换",
      cat_edit: "编辑修饰", cat_security: "安全加密", cat_text: "文本识别", cat_optimize: "压缩优化",
      featEyebrow: "Why PDF 工具箱", featTitle: "为什么选择我们", featSub: "把隐私、速度与成本都还给您——所有处理都在浏览器内完成。",
      feat1Title: "隐私安全", feat1Desc: "文件仅在您本地浏览器中处理，绝不上传服务器，敏感文档更安心。",
      feat2Title: "极速处理", feat2Desc: "基于本地 WebAssembly 引擎，多页大文件也能秒级响应，不依赖网络。",
      feat3Title: "完全免费", feat3Desc: "全部工具免费开放，无需注册登录，也没有隐藏的功能限制。",
      footerDesc: "免费、私密、即开即用的在线 PDF 处理工具。所有文件均在您的浏览器本地完成处理，不会上传到任何服务器。",
      footerTop: "回到顶部",
      // 工具名 / 描述
      t_merge_name: "PDF 合并", t_merge_desc: "把多个 PDF 按顺序合成一个文件。",
      t_split_name: "PDF 拆分", t_split_desc: "按页码范围提取，或逐页拆分为独立文件。",
      t_img2pdf_name: "图片转 PDF", t_img2pdf_desc: "将 JPG / PNG 图片打包为 PDF，每图一页。",
      t_compress_name: "PDF 压缩", t_compress_desc: "重新封装以减小体积（无损整理）。",
      t_watermark_name: "添加水印", t_watermark_desc: "为每页添加平铺文字水印。",
      t_pagenum_name: "添加页码", t_pagenum_desc: "在每页底部/角落添加页码。",
      t_rotate_name: "旋转页面", t_rotate_desc: "将所有页面旋转到指定角度。",
      t_delete_name: "删除页面", t_delete_desc: "按页码范围删除指定页面。",
      t_ocr_name: "OCR 文字识别", t_ocr_desc: "用 tesseract.js 真实识别扫描版 PDF / 图片中的文字，导出 TXT。",
      // 面板通用
      back: "返回", dropTitle: "拖拽文件到此处，或 <span class='pick'>点击选择</span>",
      dropSubSingle: "支持单个文件 · 文件仅在本地浏览器处理", dropSubMulti: "支持多个文件 · 文件仅在本地浏览器处理",
      runBtn: "开始处理", resetBtn: "清空", progDefault: "处理中…", resultDone: "处理完成",
      dlAll: "下载全部", dlOne: "下载", previewHead: "识别预览", previewCountUnit: " 字",
      // 各工具选项
      mergeOrder: "合并顺序", mergeOrderDesc: "按文件选择顺序从上到下依次合并（可重复选择加入队列）。",
      splitMode: "拆分方式", splitRange: "按范围提取", splitEach: "逐页拆分",
      splitRangeLabel: "页码范围", splitHint: "例：1,3,5-8",
      imgSize: "页面尺寸", imgA4: "A4 自适应", imgOrigin: "原图尺寸",
      compLevel: "压缩等级", compBalanced: "均衡", compMax: "更激进",
      wmText: "水印文字", wmColor: "颜色", wmSize: "字号", wmOpacity: "透明度", wmRot: "倾斜角度",
      pnPos: "位置", pnBottomCenter: "底部居中", pnBottomRight: "右下", pnTopRight: "右上",
      pnStart: "起始数字", pnPrefix: "前缀", pnPrefixPh: "如：第 / Page ",
      rotAngle: "旋转角度",
      delRange: "删除页码", delHint: "例：1,3,5-8",
      ocrLang: "识别语言", ocrLangZhEn: "中+英", ocrLangZh: "仅中文", ocrLangEn: "仅英文",
      ocrScale: "渲染清晰度", noteLabel: "说明",
      ocrNote: "首次识别会加载本地 OCR 引擎（约数十 MB，已离线内置）。PDF 将逐页渲染为图片后识别；图片文件直接识别。",
      // 进度文案
      progReading: "读取文件中…", progExtracting: "提取页面…", progSplitPage: "拆分第 {0} 页…",
      progRepackage: "重新封装中…", progFont: "嵌入字体…", progWatermark: "绘制水印…", progWatermarkPage: "绘制第 {0} 页",
      progPagenum: "写入页码…", progRotate: "旋转页面…", progDelete: "删除页面…",
      progOcrEngine: "加载 OCR 引擎…", progRenderPage: "渲染第 {0} / {1} 页…", progOcrPage: "识别中 {0}%",
      // 结果文案
      mergeDone: "已合并 {0} 个文件，共 {1} 页。",
      splitRangeDone: "已提取 {0} 页 → split.pdf",
      splitEachDone: "已逐页拆分出 {0} 个文件。",
      imgDone: "已生成 {0} 页 PDF。",
      compressBest: "新文件 {0}（已是最优封装）。",
      compressSaved: "体积从 {0} 降至 {1}，节省 {2}%。",
      watermarkDone: "已为 {0} 页添加水印。",
      pagenumDone: "已在 {0} 页添加页码。",
      rotateDone: "已将 {0} 页旋转 {1}°。",
      deleteDone: "已删除 {0} 页，剩余 {1} 页。",
      ocrDone: "识别完成，可下载 TXT 或在下方预览。",
      ocrEmpty: "（未识别到文字，可尝试提高渲染清晰度或换语言）",
      // 错误 / 提示
      errRangeInvalid: "页码范围无效（共 {0} 页）",
      errDeleteEmpty: "请填写要删除的页码（共 {0} 页）",
      errDeleteAll: "不能删除全部页面",
      errOcrEngine: "OCR 引擎未加载，请检查 vendor/tesseract 目录",
      toastChooseFile: "请先选择文件", toastFail: "处理失败：", errEngineLoad: "PDF 引擎加载失败，请检查 vendor 目录",
      // —— 新增工具：PDF 转图片 ——
      t_pdf2img_name: "PDF 转图片", t_pdf2img_desc: "将每一页渲染为高清图片并打包下载。",
      p2iFmt: "图片格式", p2iScale: "渲染清晰度", p2iMode: "下载方式", p2iZip: "打包 ZIP", p2iEach: "逐个下载",
      p2iDone: "已生成 {0} 张图片。", p2iZipDone: "已将 {0} 张图片打包为 ZIP。",
      // —— 新增工具：提取文本 ——
      t_extract_name: "提取文本", t_extract_desc: "从 PDF 提取全部文字，导出为 TXT。",
      exNote: "说明", exNoteDesc: "基于 pdf.js 文本层提取，适合含可复制文字的 PDF（扫描件请用 OCR 工具）。",
      exEmpty: "（未提取到文字）", exDone: "文本提取完成，可下载 TXT 或在下方预览。", progExtractPage: "提取第 {0} / {1} 页…",
      // —— 新增工具：PDF 加密 ——
      t_encrypt_name: "PDF 加密", t_encrypt_desc: "为 PDF 设置打开密码与操作权限。",
      encUser: "打开密码（至少填一项）", encUserPh: "用户打开密码", encOwner: "权限密码（可选）", encOwnerPh: "所有者密码",
      encPerm: "允许权限", encPPrint: "打印", encPMod: "修改", encPCopy: "复制", encPAnn: "批注",
      encNote: "设置密码后，他人需输入正确密码才能打开或修改文件。", encNeedPwd: "请至少填写一个密码", encDone: "已为文件添加密码保护。",
      // —— 新增工具：PDF 解密 ——
      t_decrypt_name: "PDF 解密", t_decrypt_desc: "移除 PDF 的打开密码（需提供原密码）。",
      decPwd: "原密码", decPwdPh: "输入当前打开密码", decNote: "提供正确密码后将重新保存为无密码文件。",
      decWrongPwd: "密码错误，无法打开该 PDF", decDone: "已移除密码并另存。",
      // —— 新增工具：密码生成器 ——
      t_password_name: "密码生成器", t_password_desc: "本地生成高强度随机密码，绝不外传。",
      pwLen: "长度", pwSets: "包含字符", pwLower: "小写", pwUpper: "大写", pwNumber: "数字", pwSymbol: "符号",
      pwCount: "生成数量", pwGenerating: "生成中…", pwNeedSet: "请至少选择一种字符类型", pwDone: "已生成 {0} 个密码。", copyBtn: "复制",
      // —— 新增工具：PDF 骑缝章 ——
      t_seal_name: "PDF 骑缝章", t_seal_desc: "将印章图片按页数竖向切片，跨页加盖骑缝章。",
      sealUp: "上传印章图片", sealPick: "选择图片", sealNone: "未选择", sealEdge: "加盖位置", sealRight: "右侧", sealLeft: "左侧",
      sealScale: "印章大小", sealNote: "印章会按页数竖向切片，每页显示其中一段；将各页并排即可复原完整印章，防止替换页面。",
      sealNeed: "请先上传印章图片", sealDone: "已为 {0} 页加盖骑缝章。", progSealPage: "加盖第 {0} 页…",
      // —— 新增工具：新增空白页 ——
      t_blank_name: "新增空白页", t_blank_desc: "在 PDF 中插入若干张空白页（开头 / 结尾 / 指定位置）。",
      blankCount: "空白页数", blankPos: "插入位置", blankEnd: "文档末尾", blankStart: "文档开头", blankSpecific: "第 N 页之后", blankAt: "第几页之后", blankAtHint: "如：2（将在第 2 页后插入）",
      blankDone: "已插入 {0} 张空白页，现共 {1} 页。",
      // —— 新增工具：提取页面 ——
      t_extractpages_name: "提取页面", t_extractpages_desc: "按页码范围提取指定页面，另存为新 PDF。",
      epRange: "提取页码", epHint: "例：1,3,5-8", epDone: "已提取 {0} 页 → extracted.pdf", errEpEmpty: "请填写要提取的页码（共 {0} 页）",
      // —— 新增工具：PDF 信息与元数据 ——
      t_info_name: "PDF 信息与元数据", t_info_desc: "查看页数、体积与元数据，并可写入新的标题/作者等信息。",
      infoPages: "页数", infoSize: "文件大小", infoTitle: "标题", infoAuthor: "作者", infoSubject: "主题", infoKeywords: "关键词", infoCreator: "创建程序", infoProducer: "生成程序", infoVersion: "PDF 版本",
      infoMetaTitle: "写入元数据（可选）", infoWrite: "保存时写入", infoWriteNo: "否", infoWriteYes: "是", infoDone: "共 {0} 页 · {1}，已读取信息。", infoErrMeta: "读取元数据失败（部分文件可能无元数据）。",
      // —— 新增工具：重排页面 ——
      t_reorder_name: "重排页面", t_reorder_desc: "按指定顺序重新排列页面，如 3,1,2,4。",
      reorderOrder: "新顺序", reorderHint: "例：3,1,2,4（可重复，如 1,1,2）", reorderDone: "已按新顺序重排 {0} 页。", errOrderEmpty: "请填写重排顺序（共 {0} 页）",
      // —— 新增工具：按 N 页拆分 ——
      t_splitn_name: "按 N 页拆分", t_splitn_desc: "将 PDF 每 N 页切分为一个独立文件。",
      splitnN: "每包页数 (N)", splitnDone: "已按每 {0} 页拆分为 {1} 个文件。",
      // —— 新增工具：优化 PDF ——
      t_optimize_name: "优化 PDF", t_optimize_desc: "以压缩对象流重新保存，并可清除元数据，减小体积。",
      optCleanMeta: "清除元数据", optNo: "否", optYes: "是", optDone: "已优化：{0} → {1}（减小 {2}）。",
      // —— 新增工具：插入页面 ——
      t_insert_name: "插入页面", t_insert_desc: "将另一个 PDF 的全部页面插入到当前 PDF 的指定位置。",
      insMain: "主 PDF（被插入）", insSrc: "来源 PDF（要插入的页面）", insPos: "插入位置", insEnd: "文档末尾", insStart: "文档开头", insSpecific: "第 N 页之后", insAt: "第几页之后", insAtHint: "如：2（在第 2 页后插入）", insDone: "已插入 {0} 页，现共 {1} 页。", progInsert: "正在插入页面…", htmlInputLabel: "HTML 内容", htmlInputHint: "在此粘贴 HTML 代码或富文本，将转换为 PDF。", htmlSample: "&lt;h1&gt;你好 PDF&lt;/h1&gt;\n&lt;p&gt;在此粘贴任意 HTML，生成可打印的 PDF。&lt;/p&gt;\n&lt;ul&gt;&lt;li&gt;支持 A4 / Letter&lt;/li&gt;&lt;li&gt;支持横版 / 竖版&lt;/li&gt;&lt;/ul&gt;", htmlSize: "页面尺寸", htmlOrient: "页面方向", htmlEmpty: "请先输入要转换的 HTML 内容。", htmlDone: "转换完成，PDF 已生成（{0}）。", progRender: "正在渲染页面…", progBuild: "正在生成 PDF…", orientP: "纵向", orientL: "横向", t_html2pdf_name: "HTML 转 PDF", t_html2pdf_desc: "将 HTML / 网页内容渲染为 PDF 文档，支持 A4 / Letter 与横竖版。",
    cropMargin: "裁剪边距（上/右/下/左，mm）", cropTop: "上", cropRight: "右", cropBottom: "下", cropLeft: "左", cropDone: "已裁剪，现 {0} 页。",
    t_crop_name: "裁剪页面", t_crop_desc: "按设定的上下左右边距，裁掉每页多余白边。",
    rsSize: "目标尺寸", rsFit: "内容适配", rsFitFit: "等比适应", rsFitStretch: "拉伸填满", rsFitCenter: "居中原样", rsDone: "已调整 {0} 页为 {1}。",
    t_resize_name: "调整页面尺寸", t_resize_desc: "将每页转换为目标纸张大小（A4/A3/A5/Letter），内容等比缩放适应。",
    hfHeader: "页眉文字", hfFooter: "页脚文字", hfPageNum: "包含页码", hfYes: "是", hfNo: "否", hfSize: "字号", hfDone: "已为 {0} 页添加页眉页脚。",
    t_headerfooter_name: "页眉页脚", t_headerfooter_desc: "为每一页添加页眉/页脚文字，可附带页码。",
    mdTitle: "标题", mdAuthor: "作者", mdSubject: "主题", mdKeywords: "关键词（逗号分隔）", mdDone: "已更新文档元数据。",
    t_metadata_name: "编辑元数据", t_metadata_desc: "修改 PDF 的标题、作者、主题与关键词。",
    dupRange: "页面范围（如 1,3 或 2-4）", dupCopies: "复制份数", dupEmpty: "请填写有效的页面范围。", dupDone: "已复制，现共 {0} 页。",
    t_duplicate_name: "复制页面", t_duplicate_desc: "把指定页面复制多份，插入到原页之后。",
    sigPos: "位置", sigScale: "大小（% 页宽）", sigPages: "应用页面", sigAll: "全部", sigFirst: "首页", sigLast: "末页", sigDone: "已在 {0} 页添加图片。",
    t_sign_name: "添加图片/签名", t_sign_desc: "在 PDF 指定位置叠加图片，如签名或公章。",
    revDone: "已反转，现 {0} 页。",
    t_reverse_name: "倒序排列", t_reverse_desc: "将全部页面的顺序反转。",
    t_grayscale_name: "灰度化", t_grayscale_desc: "将 PDF 每页转为黑白灰度，适合打印、降低彩印成本。",
    grayScale: "渲染清晰度", grayDone: "已生成灰度 PDF（共 {0} 页）。",
    t_pdf2word_name: "PDF 转 Word", t_pdf2word_desc: "提取 PDF 文字并导出为可编辑的 .docx 文档（纯文本，不保留原版式与图片）。",
    wordPageNum: "页眉标注页码", wordNoPageNum: "不标注", wordYes: "是", wordNo: "否", wordPageBreak: "每页之间加分页符", wordDone: "已导出 Word 文档（共 {0} 页）。", wordNote: "说明：仅提取文字内容，不保留表格/图片/版式。",
    t_extractimg_name: "提取图片", t_extractimg_desc: "从 PDF 中提取内嵌的位图图片，去重后打包为 PNG。",
    extScale: "渲染清晰度", extDone: "已提取 {0} 张图片并打包为 ZIP。", extNone: "该 PDF 中未检测到内嵌位图图片。", extNote: "注：提取的是 PDF 内部嵌入的位图（解码为 PNG），已按内容去重。",
    t_pdf2ppt_name: "PDF 转 PPT", t_pdf2ppt_desc: "把每一页渲染成图片，逐页生成可编辑的 .pptx 演示文稿（每页一张整图）。",
    pptQuality: "渲染清晰度", pptDone: "已生成演示文稿（共 {0} 页）。", pptNote: "注：每页以图片形式放入幻灯片，可整体编辑但文字不可直接改；版式已完整保留。",
    t_pdf2excel_name: "PDF 转 Excel", t_pdf2excel_desc: "按文字位置重建表格，导出为可编辑的 .xlsx（纯文本按坐标摆放，复杂多栏可能不精确）。",
    xlsxDone: "已生成表格（共 {0} 页、{1} 行）。", xlsxNone: "未能从 PDF 提取到文字（可能是扫描件，请先用 OCR 工具）。", xlsxNote: "注：依据文字坐标重建行列，简单表格效果最佳；扫描件请先用 OCR。",
    t_rmblank_name: "删除空白页", t_rmblank_desc: "自动检测并移除几乎为空白的页面（基于像素分析）。",
    rmblankMode: "判定灵敏度", rmblankStrict: "严格（仅纯白）", rmblankLoose: "宽松（含浅色）",
    rmblankDone: "已移除 {0} 张空白页，剩余 {1} 页。", rmblankNone: "未检测到空白页。",
    t_pdf2long_name: "PDF 转长图", t_pdf2long_desc: "将全部页面拼接为一张竖向长图，便于分享与预览。",
    longScale: "渲染清晰度", longNote: "注：长图仅用于预览分享，文字不可选中；页数较多时会自动限制总高度。", longDone: "已生成长图（{0} 页，{1}）。", longWarn: "（已自动缩小以保证可保存）",
    t_links_name: "提取链接", t_links_desc: "从 PDF 中提取全部超链接 / 网址，导出为文本。",
    linksDone: "已提取 {0} 个链接。", linksNone: "未在 PDF 中发现链接注释。", linksInternal: "内部跳转",
    linksNote: "注：仅提取带注释的链接；图片型或手写链接可能无法识别。",
    t_booklet_name: "N合1 拼版", t_booklet_desc: "将多页排布到同一页（2合1 / 4合1），适合打印节省纸张。",
    bookLayout: "拼版方式", book2: "2合1（左右）", book4: "4合1（田字）",
    bookDone: "已生成拼版 PDF（{0} 页 → {1} 页）。",
    t_cover_name: "添加封面", t_cover_desc: "为 PDF 生成一页封面（标题 + 副标题），插入到最前面。",
    coverTitle: "封面标题", coverSub: "副标题（可选）", coverSubPh: "可选，例如：2026 年度报告", coverDefault: "文档封面", coverFoot: "由 PDF 工具箱生成",
    coverDone: "已添加封面，共 {0} 页。", coverNote: "注：封面由浏览器字体渲染后嵌入为图片，原文档保持可编辑。",
    t_repair_name: "修复重组", t_repair_desc: "重新解析并封装 PDF，修复轻微损坏或结构异常。",
    repairNote: "注：本工具通过重新解析封装修复结构问题，无法恢复已损坏的内容数据。",
    repairDone: "修复完成：{0} 页，体积 {1} → {2}。", repairSame: "文件结构正常，已重新封装（{0} 页）。", repairFail: "无法修复：文件可能已严重损坏。",
    t_bg_name: "添加背景", t_bg_desc: "为每页添加纯色背景或彩色边框，让文档更醒目。",
    bgColor: "背景颜色", bgMode: "模式", bgFull: "整页填充", bgFrame: "彩色边框", bgDone: "已为 {0} 页添加背景。",
    t_margin_name: "增加页边距", t_margin_desc: "为每页四周添加统一留白，便于打印装订。",
    mgSize: "页边距", mgColor: "留白底色", mgDone: "已为 {0} 页添加 {1}mm 页边距。",
    t_wmimg_name: "图片水印", t_wmimg_desc: "上传图片作为平铺或居中水印，可调整大小与透明度。",
    wmimgUpload: "上传水印图片", wmimgLayout: "布局", wmimgTile: "平铺", wmimgSingle: "居中单个", wmimgScale: "大小", wmimgOpacity: "透明度", wmimgDone: "已为 {0} 页添加图片水印。",
    t_outline_name: "提取书签", t_outline_desc: "读取 PDF 书签/大纲树，导出为文本文件。",
    outlineNote: "注：仅导出文档自带的目录书签（Outline），不含页面内标题。", outlineNone: "未在 PDF 中发现书签大纲。", outlineDone: "已提取 {0} 个书签条目。",
    t_formfields_name: "提取表单字段", t_formfields_desc: "读取 PDF 表单（AcroForm）字段名称、类型与取值。",
    formNote: "注：仅支持标准 AcroForm 表单，不支持扫描图片中的表单。", formNone: "未在 PDF 中发现可读取的表单字段。", formDone: "已提取 {0} 个表单字段。",
    t_rmanno_name: "删除注释", t_rmanno_desc: "移除页面中的批注、高亮、链接等注释对象。",
    rmKeepLinks: "保留网页链接", rmAll: "删除全部", rmKeep: "仅保留链接", rmDone: "已处理 {0} 页的注释对象。",
    t_burst_name: "单页拆分", t_burst_desc: "将 PDF 的每一页导出为独立的 PDF 文件（多页自动打包）。",
    burstNote: "每页生成一个独立 PDF，多页时自动打包为 ZIP 下载。", burstProg: "正在拆分第 {0}/{1} 页…", burstDone: "已拆分为 {0} 个单页 PDF。", burstOne: "仅 1 页，已直接导出该页。",
    t_oddeven_name: "奇偶页拆分", t_oddeven_desc: "按页码奇偶拆分为两个 PDF（奇数页 / 偶数页）。",
    oeNote: "将第 1、3、5…页与第 2、4、6…页分别导出。", oeNone: "文件没有可拆分的页面。", oeDone: "已拆分：奇数页 {0} 张，偶数页 {1} 张。",
    t_attach_name: "提取附件", t_attach_desc: "提取 PDF 内嵌的附件文件（如 Portfolio 附件）。",
    attNote: "解析文档 Names 树中的 EmbeddedFiles 并解包。", attNone: "未发现内嵌附件。", attDone: "已提取 {0} 个附件文件。",
    t_collate_name: "交错合并", t_collate_desc: "将两个 PDF 逐页穿插合并（1a,1b,2a,2b…）。",
    collateNote: "上传两个 PDF，将按页交替穿插合并为一个文件。", collateNeed: "请上传两个 PDF 文件。", collateProg: "正在合并第 {0}/{1} 页…", collateDone: "已交错合并：A {0} 页 + B {1} 页 → 共 {2} 页。",
    t_splitbm_name: "按书签拆分", t_splitbm_desc: "依据一级书签将 PDF 切分为多个独立文件。",
    sbmNote: "依据文档大纲的一级书签，按页范围切分为多份。", sbmNone: "未发现书签大纲，无法按书签拆分。", sbmFew: "书签不足两个，无需拆分。", sbmProg: "正在导出第 {0}/{1} 段…", sbmDone: "已按 {0} 个书签拆分为多个 PDF。",
    t_wordcount_name: "字数统计", t_wordcount_desc: "统计 PDF 的总字符数、中文字数与英文词数。",
    wcNote: "基于 pdf.js 提取文本后统计，扫描型 PDF 可能偏低。", wcProg: "正在统计第 {0}/{1} 页…", wcDone: "共 {0} 页，字符 {1}，其中中文 {2}，英文单词 {3}。", wcReport: "页数：{0}\n总字符数：{1}\n中文字数：{2}\n英文单词数：{3}",
    t_addlink_name: '添加链接', t_addlink_desc: '为页面添加可点击的网页超链接（URI）。',
    alUrl: '链接地址（URL）', alPages: '应用页码（如 1-3,5 或 all）', alRegion: '链接区域',
    alFull: '整页', alTop: '顶部', alMid: '中部', alBot: '底部',
    alDone: '已在 {0} 页添加超链接。', alNeedUrl: '请填写以 http(s) 开头的链接地址。', alErr: '未解析到有效页码，请检查页码范围。',
    t_bates_name: '贝茨编码', t_bates_desc: '为每页添加连续的页码/编号，常用于法务卷宗。',
    btPrefix: '前缀', btStart: '起始编号', btDigits: '编号位数（补零）', btPos: '位置',
    posTL: '左上', posTR: '右上', posBL: '左下', posBR: '右下', posMC: '居中',
    btDone: '已为 {0} 页添加贝茨编码。',
    t_overlay_name: '叠加模板', t_overlay_desc: '将模板 PDF（如信笺/底图）整页叠加到目标 PDF 之上。',
    ovMain: '目标 PDF', ovTmpl: '模板 PDF',
    ovNote: '上传目标与模板两个 PDF，模板将按目标页尺寸铺满叠加。', ovNeed: '请上传目标 PDF 与模板 PDF 两个文件。', ovProg: '正在叠加第 {0}/{1} 页…', ovDone: '已叠加模板，生成 {0} 页 PDF。',
    t_compare_name: '比较文本', t_compare_desc: '逐页比对两个 PDF 的文本内容，列出差异页。',
    cmpNote: '上传两个 PDF，按文本逐页比对（基于 pdf.js 提取）。', cmpNeed: '请上传两个 PDF 文件。', cmpProg: '正在比对第 {0}/{1} 页…',
    cmpDone: '比对完成：共 {0} 页，其中 {1} 页文本不同（第 {2} 页）。', cmpSame: '两个 PDF 文本内容完全一致（共 {0} 页）。',
    cmpReport: '比较结果\nPDF A 页数：{0}\nPDF B 页数：{1}\n不同页数：{2}\n差异页码（从 1 起）：{3}',
    t_annoextract_name: '提取批注', t_annoextract_desc: '提取页面中的批注、评论、高亮等注释内容并导出。',
    aeNote: '读取每页的注释对象（高亮/文本/图章等），导出 ann.txt。', aeProg: '正在读取第 {0}/{1} 页…', aeNone: '未发现任何批注。', aeDone: '已提取 {0} 条批注，导出 annotations.txt。', aeHead: '批注提取结果（共 {0} 页，{1} 条批注）',
    t_papersize_name: '纸张尺寸', t_papersize_desc: '将页面尺寸转换为 A4 / A3 / A5 / Letter / Legal 等标准规格。',
    psTarget: '目标尺寸', psMode: '缩放方式', psContain: '等比适应', psCenter: '居中（不缩放）', psProg: '正在转换第 {0}/{1} 页…',     psDone: '已转换为 {0}，共 {1} 页。',
    t_border_name: '加边框', t_border_desc: '为每一页添加可选颜色的矩形边框线。',
    bdColor: '颜色', bdDark: '深色', bdRed: '红色', bdBlue: '蓝色', bdGreen: '绿色', bdW: '线宽 (px)', bdProg: '正在加边框 {0}/{1}…', bdDone: '已为 {0} 页添加边框。',
    t_redact_name: '密文遮盖', t_redact_desc: '用黑/白色块遮盖指定页与区域的内容（如敏感信息）。',
    rdPages: '应用页码（如 1-3,5 或 all）', rdRegion: '遮盖区域', rdFull: '整页', rdTop: '顶部', rdBot: '底部', rdColor: '遮盖颜色', rdBlack: '黑色', rdWhite: '白色', rdErr: '未解析到有效页码，请检查页码范围。', rdProg: '正在遮盖第 {0}/{1} 页…', rdDone: '已遮盖 {0} 页。',
    t_fontlist_name: '字体清单', t_fontlist_desc: '提取文档使用的字体名称与类型并导出。',
    flNote: '提取文档使用的字体名称与类型，导出 fonts.txt。', flProg: '正在读取第 {0}/{1} 页…', flHead: '字体清单（共 {0} 种）', flNone: '未发现字体信息。', flDone: '已提取 {0} 种字体。',
    t_pagesizes_name: '页面尺寸报告', t_pagesizes_desc: '列出每页尺寸（pt 与 mm）及对应规范。',
    pszNote: '列出每页尺寸（pt 与 mm）及对应规格，导出 page-sizes.txt。', pszHead: '页面尺寸报告（共 {0} 页）', pszProg: '正在测量第 {0}/{1} 页…', pszRow: '第 {0} 页：{1} × {2} pt  ({3})', pszDone: '已生成 {0} 页尺寸报告。',
    t_removemeta_name: '清除元数据', t_removemeta_desc: '删除 PDF 的 XMP 元数据与文档信息字段。',
    rm2Mode: '清除范围', rm2Fields: '仅清字段', rm2All: '清空整条 Info', rm2Note: '删除 XMP 元数据；选“仅清字段”保留结构但清空内容，“清空整条”删除 Information 字典。', rm2Done: '已清除元数据（{0}）。',
    t_datestamp_name: '日期戳', t_datestamp_desc: '在每页角落添加日期或自定义文字戳（建议英文/数字）。',
    dsText: '戳记文字（建议英文/数字）', dsPos: '位置', dsNote: '用 Helvetica 绘制，中文可能不显示，建议用英文/数字（如日期）。', dsNeed: '请填写戳记文字。', dsProg: '正在添加第 {0}/{1} 页…', dsDone: '已为 {0} 页添加日期戳。',
    t_flatten_name: '表单扁平化', t_flatten_desc: '将表单字段的填写值转为静态文字并移除可编辑控件（中文值可能不显示）。',
    flNote: '把填写好的表单字段“烤”成静态文字并删除交互控件；字段值建议为英文/数字。', flKeep: '控件处理', flRemove: '移除交互', flKeepWidgets: '保留原控件', flProg: '正在处理第 {0}/{1} 页…', flDone: '已扁平化 {0} 个字段。',
    t_embed_name: '嵌入附件', t_embed_desc: '将任意文件作为附件嵌入 PDF（EmbeddedFiles）。',
    emPdf: '主 PDF', emFile: '附件文件', emNote: '选择主 PDF 与要嵌入的附件；可用“提取附件”工具取回。', emNeed: '请同时选择主 PDF 与附件。', emDone: '已嵌入附件：{0}。',
    t_mkbm_name: '生成书签', t_mkbm_desc: '按“页码 标题”格式批量生成 PDF 书签大纲（缩进表示层级）。',
    bmFmt: '每行：页码 + 空格 + 标题；行首每 2 个空格为一级缩进。', bmNote: '示例：2 个空格缩进表示子标题；页码从 1 开始。', bmNeed: '请按“页码 标题”格式填写至少一行。',     bmDone: '已生成 {0} 条书签。',
    t_ocrpdf_name: 'OCR 搜索型PDF', t_ocrpdf_desc: '识别扫描页文字并叠加可搜索文字层，生成可选中、可搜索的 PDF。', ocrpdfNote: '中文文字层可能因字体限制不叠加（图像与英文/数字可搜索）；默认识别中英。', ocrpdfProg: '正在识别第 {0}/{1} 页…', ocrpdfDone: '已生成可搜索 PDF（{0} 页）。',
    t_pdf2html_name: 'PDF 转 HTML', t_pdf2html_desc: '将每页文本提取为带分页结构的 HTML 文件。', p2hNote: '基于 pdf.js 提取文本，尽力还原段落与换行；复杂排版可能不完美。', p2hTitle: 'PDF 文本导出', p2hProg: '正在提取第 {0}/{1} 页…', p2hDone: '已导出 HTML（{0} 页）。',
    t_unify_name: '合并统一尺寸', t_unify_desc: '合并多个 PDF，并将所有页面统一为指定纸张尺寸。', unProg: '正在处理第 {0}/{1} 个文件…', unDone: '已合并并统一为 {0}（共 {1} 页）。',
    t_wmcn_name: '中文水印', t_wmcn_desc: '支持中文的水印（以图片方式渲染，可平铺或居中）。', wmcnText: '水印文字', wmcnDefault: '机密·请勿外传', wmcnColor: '颜色', wmcnGray: '灰', wmcnRed: '红', wmcnBlue: '蓝', wmcnSize: '字号', wmcnAngle: '角度', wmcnMode: '模式', wmcnTile: '平铺', wmcnCenter: '居中', wmcnOpacity: '透明度', wmcnLight: '淡', wmcnMid: '中', wmcnStrong: '浓', wmcnNote: '用 html2canvas 渲染中文，解决普通文字水印无法显示中文的问题。', wmcnNeed: '请填写水印文字。', wmcnProg: '正在处理第 {0}/{1} 页…', wmcnDone: '已为 {0} 页添加中文水印。',
    t_bm2md_name: '书签导出 Markdown', t_bm2md_desc: '将 PDF 书签大纲导出为 Markdown 文件。', bm2mdTitle: 'PDF 书签', bm2mdNote: '依据文档大纲生成层级 Markdown（# 表示一级）。', bm2mdNone: '未发现书签大纲。', bm2mdDone: '已导出 {0} 条书签为 Markdown。',
    t_resize2_name: '自定义尺寸', t_resize2_desc: '按自定义宽高（毫米）调整所有页面尺寸。', r2W: '宽度 (mm)', r2H: '高度 (mm)', r2Need: '请输入有效的宽高（需大于 0）。', r2Prog: '正在处理第 {0}/{1} 页…', r2Done: '已调整为 {0}×{1} mm（{2} 页）。',
    t_formfill_name: '填写表单', t_formfill_desc: '导入 JSON 按字段名批量填写 PDF 表单（字段值建议英文/数字）。',
    ffPdf: '主 PDF', ffJsonFile: '字段 JSON', ffNote: '上传 PDF 与字段映射 JSON（格式：{"字段名":"值",...}）；文本框、复选框、下拉等按名称自动匹配。', ffNeed: '请同时选择 PDF 与 JSON 文件。', ffJson: 'JSON 解析失败，请检查格式。', ffDone: '已填写 {0} 个字段（共 {1} 个）。',
    t_formexport_name: '导出表单字段', t_formexport_desc: '将 PDF 表单字段的名称、类型与当前值导出为 JSON 文件。',
    feNote: '导出 AcroForm 字段清单为 form-fields.json，便于备份或作为填写模板。', feNone: '未发现任何表单字段。', feDone: '已导出 {0} 个字段为 JSON。',
    t_duplex_name: '双页拼版', t_duplex_desc: '将连续两页并排拼到一张横向页面，便于打印小册子。',
    dpGap: '页面间距 (pt)', dpProg: '正在拼版第 {0}/{1} 组…', dpDone: '已生成 {0} 张双页拼版（原 {1} 页）。',
    t_splitsize_name: '按大小拆分', t_splitsize_desc: '将 PDF 按目标文件大小拆分为多个小文件。',
    ssSize: '每个文件最大 (MB)', ssNeed: '请输入大于 0 的大小。', ssProg: '正在拆分第 {0}/{1} 页…', ssDone: '已拆分为 {0} 个文件（阈值 {1} MB）。',
    t_autocrop_name: '自动裁剪白边', t_autocrop_desc: '检测每页内容边界，自动裁掉四周多余白边。',
    acTol: '边缘容差 (pt)', acNote: '基于渲染像素探测内容边界并调整裁剪框；纯白背景扫描件效果最佳。', acProg: '正在分析第 {0}/{1} 页…', acDone: '已为 {0} 页裁剪白边。', acNone: '未发现明显白边，未作调整。',
    t_autobm_name: '自动生成书签', t_autobm_desc: '依据每页标题文字（最大字号）自动生成 PDF 书签大纲。',
    abMin: '最小字号阈值', abNote: '取每页中字号最大的文本片段作为该书签标题；适合规整的章节标题。', abProg: '正在分析第 {0}/{1} 页…', abDone: '已生成 {0} 条书签。', abNone: '未检测到合适标题，未生成书签。',
    t_nup_name: 'N-up 拼版', t_nup_desc: '将多页缩印到一页（2×2 / 3×3 / 4×4），适合讲义打印。', npLayout: '版式', npNote: '每格按原页面比例缩放，保留空白页席位。', npProg: '正在拼版第 {0}/{1} 页…', npDone: '已生成 {0} 页 N-up 拼版（原 {1} 页）。',
    t_mdtext_name: '全文转 Markdown', t_mdtext_desc: '提取 PDF 全部正文，导出为带页码标记的 Markdown 文本。', mtNote: '按页分段并保留段落换行，便于检索与笔记。', mtProg: '正在提取第 {0}/{1} 页…', mtDone: '已导出 {0} 页正文为 Markdown。',
    t_recompress_name: '真压缩（重采样）', t_recompress_desc: '把每页重新渲染为低质量图片后重建，真正减小体积（图片型/扫描件效果明显）。', rcQuality: '图片质量', rcNote: '仅重采样图片，纯文字型 PDF 压缩空间有限。', rcProg: '正在压缩第 {0}/{1} 页…', rcDone: '压缩完成：{0} → {1}（节省 {2}%）。',
    p2iWebp: 'WebP', p2iQual: '质量', p2iHigh: '高', p2iStd: '标准',
    cjkNote: '含中文等非英文内容时将自动用图片方式渲染，确保正常显示。',
    catFav: '收藏', catRecent: '最近', favTip: '点击卡片右上角星标可收藏常用工具。',
    t_annotate_name: 'PDF 批注', t_annotate_desc: '为 PDF 添加高亮或便签批注，可被 Adobe 等阅读器识别。', anType: '类型', anHighlight: '高亮', anSticky: '便签', anText: '批注文字', anColor: '颜色', anPages: '页码范围', anNote: '高亮在页面中部加半透明色带；便签在右上角显示气泡（可填文字）。', anProg: '正在添加批注第 {0}/{1} 页…', anDone: '已为 {0} 页添加批注。', anNeed: '便签模式请填写批注文字。'
    },
    en: {
      docTitle: "PDF Toolkit · Free Online PDF Tools",
      brandName: "PDF<span class='grad-text'>Toolkit</span>",
      navAllTools: "All Tools", navFeatures: "Features", navStart: "Get Started",
      heroBadge: "100% In-Browser · Files Never Uploaded",
      heroTitle: "Free Online <span class='grad-text'>PDF Toolkit</span><br />Merge · Split · Compress · Convert · Encrypt · OCR",
      heroSub: "A full PDF toolkit — merge, convert, edit, encrypt and recognize — all running locally on your device. No sign-up, no ads, no privacy worries.",
      heroCta1: "Start Now", heroCta2: "Learn More",
      trust1: "Local Processing · No Upload", trust2: "Fast Engine · Done in Seconds", trust3: "100% Free · No Sign-up",
      toolCount: "Over {0} handy tools",
      searchPh: "Search tools by name or feature", noResults: "No matching tools. Try another keyword.",
      catAll: "All", cat_merge: "Merge & Split", cat_organize: "Organize", cat_convert: "Convert",
      cat_edit: "Edit", cat_security: "Security", cat_text: "Text & OCR", cat_optimize: "Optimize",
      featEyebrow: "Why PDF Toolkit", featTitle: "Why Choose Us", featSub: "Privacy, speed and cost — all back in your hands. Everything runs in your browser.",
      feat1Title: "Privacy Safe", feat1Desc: "Files are processed only in your browser, never uploaded to any server — your sensitive documents stay safe.",
      feat2Title: "Lightning Fast", feat2Desc: "Powered by a local WebAssembly engine, even large multi-page files respond instantly without the network.",
      feat3Title: "Completely Free", feat3Desc: "All tools are free to use — no sign-up, no hidden limits.",
      footerDesc: "Free, private, ready-to-use online PDF tools. Every file is processed locally in your browser and never uploaded to any server.",
      footerTop: "Back to Top",
      t_merge_name: "Merge PDF", t_merge_desc: "Combine multiple PDFs into one, in order.",
      t_split_name: "Split PDF", t_split_desc: "Extract by page range, or split into individual files.",
      t_img2pdf_name: "Image to PDF", t_img2pdf_desc: "Pack JPG / PNG images into a PDF, one per page.",
      t_compress_name: "Compress PDF", t_compress_desc: "Repackage to reduce size (lossless cleanup).",
      t_watermark_name: "Add Watermark", t_watermark_desc: "Add tiled text watermark to every page.",
      t_pagenum_name: "Add Page Numbers", t_pagenum_desc: "Add page numbers at the bottom/corner of each page.",
      t_rotate_name: "Rotate Pages", t_rotate_desc: "Rotate all pages to a chosen angle.",
      t_delete_name: "Delete Pages", t_delete_desc: "Remove pages by page range.",
      t_ocr_name: "OCR Text Recognition", t_ocr_desc: "Real text recognition for scanned PDFs / images with tesseract.js, export to TXT.",
      back: "Back", dropTitle: "Drag files here, or <span class='pick'>click to choose</span>",
      dropSubSingle: "Single file · processed locally", dropSubMulti: "Multiple files · processed locally",
      runBtn: "Start", resetBtn: "Clear", progDefault: "Processing…", resultDone: "Done",
      dlAll: "Download All", dlOne: "Download", previewHead: "Recognition Preview", previewCountUnit: " chars",
      mergeOrder: "Merge Order", mergeOrderDesc: "Files merge top-to-bottom in selection order (you can re-select to add to the queue).",
      splitMode: "Split Mode", splitRange: "Extract by Range", splitEach: "Split Each Page",
      splitRangeLabel: "Page Range", splitHint: "e.g. 1,3,5-8",
      imgSize: "Page Size", imgA4: "Fit A4", imgOrigin: "Original Size",
      compLevel: "Compression Level", compBalanced: "Balanced", compMax: "Aggressive",
      wmText: "Watermark Text", wmColor: "Color", wmSize: "Font Size", wmOpacity: "Opacity", wmRot: "Tilt Angle",
      pnPos: "Position", pnBottomCenter: "Bottom Center", pnBottomRight: "Bottom Right", pnTopRight: "Top Right",
      pnStart: "Start Number", pnPrefix: "Prefix", pnPrefixPh: "e.g. Page / 第 ",
      rotAngle: "Rotation Angle",
      delRange: "Delete Pages", delHint: "e.g. 1,3,5-8",
      ocrLang: "Recognition Language", ocrLangZhEn: "Chinese+English", ocrLangZh: "Chinese Only", ocrLangEn: "English Only",
      ocrScale: "Render Quality", noteLabel: "Note",
      ocrNote: "First run loads the local OCR engine (~tens of MB, bundled offline). PDFs are rendered page-by-page to images then recognized; image files are recognized directly.",
      progReading: "Reading file…", progExtracting: "Extracting…", progSplitPage: "Splitting page {0}…",
      progRepackage: "Repackaging…", progFont: "Embedding font…", progWatermark: "Drawing watermark…", progWatermarkPage: "Drawing page {0}",
      progPagenum: "Writing page numbers…", progRotate: "Rotating pages…", progDelete: "Deleting pages…",
      progOcrEngine: "Loading OCR engine…", progRenderPage: "Rendering page {0} / {1}…", progOcrPage: "Recognizing {0}%",
      mergeDone: "Merged {0} files, {1} pages total.",
      splitRangeDone: "Extracted {0} pages → split.pdf",
      splitEachDone: "Split into {0} individual files.",
      imgDone: "Generated a {0}-page PDF.",
      compressBest: "New file {0} (already optimally packaged).",
      compressSaved: "Size reduced from {0} to {1}, saving {2}%.",
      watermarkDone: "Added watermark to {0} pages.",
      pagenumDone: "Added page numbers to {0} pages.",
      rotateDone: "Rotated {0} pages by {1}°.",
      deleteDone: "Deleted {0} pages, {1} remaining.",
      ocrDone: "Recognition complete. Download the TXT or preview below.",
      ocrEmpty: "(No text recognized. Try increasing render quality or switching language.)",
      errRangeInvalid: "Invalid page range ({0} pages total)",
      errDeleteEmpty: "Please enter pages to delete ({0} pages total)",
      errDeleteAll: "Cannot delete all pages",
      errOcrEngine: "OCR engine not loaded, check vendor/tesseract",
      toastChooseFile: "Please select a file first", toastFail: "Processing failed: ", errEngineLoad: "PDF engine failed to load, check the vendor directory",
      t_pdf2img_name: "PDF to Images", t_pdf2img_desc: "Render every page to high-quality images and download them.",
      p2iFmt: "Format", p2iScale: "Render Quality", p2iMode: "Download As", p2iZip: "ZIP Bundle", p2iEach: "Each File",
      p2iDone: "Generated {0} images.", p2iZipDone: "Bundled {0} images into a ZIP.",
      t_extract_name: "Extract Text", t_extract_desc: "Extract all text from a PDF and export to TXT.",
      exNote: "Note", exNoteDesc: "Uses the pdf.js text layer — best for PDFs with selectable text (use OCR for scans).",
      exEmpty: "(No text extracted)", exDone: "Text extracted. Download the TXT or preview below.", progExtractPage: "Extracting page {0} / {1}…",
      t_encrypt_name: "Encrypt PDF", t_encrypt_desc: "Set an open password and permissions on a PDF.",
      encUser: "Open Password (fill at least one)", encUserPh: "User open password", encOwner: "Permissions Password (optional)", encOwnerPh: "Owner password",
      encPerm: "Permissions", encPPrint: "Print", encPMod: "Modify", encPCopy: "Copy", encPAnn: "Annotate",
      encNote: "After setting a password, others must enter it to open or modify the file.", encNeedPwd: "Please enter at least one password", encDone: "Password protection added.",
      t_decrypt_name: "Decrypt PDF", t_decrypt_desc: "Remove the open password from a PDF (needs the current password).",
      decPwd: "Current Password", decPwdPh: "Enter the current open password", decNote: "With the correct password the file is re-saved without encryption.",
      decWrongPwd: "Wrong password — cannot open this PDF", decDone: "Password removed and saved.",
      t_password_name: "Password Generator", t_password_desc: "Generate strong random passwords locally — never uploaded.",
      pwLen: "Length", pwSets: "Include", pwLower: "Lower", pwUpper: "Upper", pwNumber: "Numbers", pwSymbol: "Symbols",
      pwCount: "Quantity", pwGenerating: "Generating…", pwNeedSet: "Select at least one character type", pwDone: "Generated {0} password(s).", copyBtn: "Copy",
      t_seal_name: "PDF Seamless Seal", t_seal_desc: "Slice a stamp image by page count and apply a seamless seal across pages.",
      sealUp: "Upload Stamp Image", sealPick: "Choose Image", sealNone: "Not selected", sealEdge: "Position", sealRight: "Right", sealLeft: "Left",
      sealScale: "Seal Size", sealNote: "The stamp is sliced vertically per page; each page shows one segment. Place pages side by side to reconstruct the full seal and detect page swaps.",
      sealNeed: "Please upload a stamp image first", sealDone: "Applied a seamless seal to {0} pages.", progSealPage: "Sealing page {0}…",
      t_blank_name: "Add Blank Pages", t_blank_desc: "Insert blank pages into a PDF (at start / end / a chosen position).",
      blankCount: "Blank pages", blankPos: "Insert at", blankEnd: "End of document", blankStart: "Start of document", blankSpecific: "After page N", blankAt: "After which page", blankAtHint: "e.g. 2 (insert after page 2)",
      blankDone: "Inserted {0} blank page(s), now {1} pages total.",
      t_extractpages_name: "Extract Pages", t_extractpages_desc: "Extract selected pages by range into a new PDF.",
      epRange: "Pages to extract", epHint: "e.g. 1,3,5-8", epDone: "Extracted {0} pages → extracted.pdf", errEpEmpty: "Please enter pages to extract ({0} pages total)",
      t_info_name: "PDF Info & Metadata", t_info_desc: "View page count, file size and metadata, and optionally write new title/author etc.",
      infoPages: "Pages", infoSize: "File size", infoTitle: "Title", infoAuthor: "Author", infoSubject: "Subject", infoKeywords: "Keywords", infoCreator: "Creator", infoProducer: "Producer", infoVersion: "PDF version",
      infoMetaTitle: "Write metadata (optional)", infoWrite: "Write on save", infoWriteNo: "No", infoWriteYes: "Yes", infoDone: "{0} pages · {1}, info read.", infoErrMeta: "Could not read metadata (some files have none).",
      t_reorder_name: "Reorder Pages", t_reorder_desc: "Rearrange pages into a new order, e.g. 3,1,2,4.",
      reorderOrder: "New order", reorderHint: "e.g. 3,1,2,4 (repeats allowed, e.g. 1,1,2)", reorderDone: "Reordered {0} pages into the new sequence.", errOrderEmpty: "Please enter the new order ({0} pages total)",
      t_splitn_name: "Split Every N", t_splitn_desc: "Split a PDF into separate files of N pages each.",
      splitnN: "Pages per chunk (N)", splitnDone: "Split into {1} file(s) of {0} pages each.",
      t_optimize_name: "Optimize PDF", t_optimize_desc: "Re-save with compressed object streams and optional metadata cleanup to shrink size.",
      optCleanMeta: "Clean metadata", optNo: "No", optYes: "Yes", optDone: "Optimized: {0} → {1} (saved {2}).",
      t_insert_name: "Insert Pages", t_insert_desc: "Insert all pages of another PDF into the current PDF at a chosen position.",
      insMain: "Main PDF (target)", insSrc: "Source PDF (pages to insert)", insPos: "Insert at", insEnd: "End of document", insStart: "Start of document", insSpecific: "After page N", insAt: "After which page", insAtHint: "e.g. 2 (insert after page 2)", insDone: "Inserted {0} pages, now {1} pages total.", progInsert: "Inserting pages…", htmlInputLabel: "HTML content", htmlInputHint: "Paste HTML code or rich text here to convert into PDF.", htmlSample: "&lt;h1&gt;Hello PDF&lt;/h1&gt;\n&lt;p&gt;Paste any HTML here to generate a printable PDF.&lt;/p&gt;\n&lt;ul&gt;&lt;li&gt;Supports A4 / Letter&lt;/li&gt;&lt;li&gt;Supports portrait / landscape&lt;/li&gt;&lt;/ul&gt;", htmlSize: "Page size", htmlOrient: "Orientation", htmlEmpty: "Please enter the HTML content to convert.", htmlDone: "Conversion done, PDF generated ({0}).", progRender: "Rendering page…", progBuild: "Building PDF…", orientP: "Portrait", orientL: "Landscape", t_html2pdf_name: "HTML to PDF", t_html2pdf_desc: "Render HTML/web content into a PDF, with A4 / Letter and portrait/landscape.",
    cropMargin: "Crop margins (top/right/bottom/left, mm)", cropTop: "Top", cropRight: "Right", cropBottom: "Bottom", cropLeft: "Left", cropDone: "Cropped, now {0} pages.",
    t_crop_name: "Crop PDF", t_crop_desc: "Trim excess margins from every page using the set insets.",
    rsSize: "Target size", rsFit: "Content fit", rsFitFit: "Fit", rsFitStretch: "Stretch", rsFitCenter: "Center", rsDone: "Resized {0} pages to {1}.",
    t_resize_name: "Resize Pages", t_resize_desc: "Convert every page to a target paper size (A4/A3/A5/Letter), scaling content to fit.",
    hfHeader: "Header text", hfFooter: "Footer text", hfPageNum: "Include page number", hfYes: "Yes", hfNo: "No", hfSize: "Font size", hfDone: "Added header/footer to {0} pages.",
    t_headerfooter_name: "Header & Footer", t_headerfooter_desc: "Add header/footer text to every page, with optional page numbers.",
    mdTitle: "Title", mdAuthor: "Author", mdSubject: "Subject", mdKeywords: "Keywords (comma separated)", mdDone: "Document metadata updated.",
    t_metadata_name: "Edit Metadata", t_metadata_desc: "Edit the PDF title, author, subject and keywords.",
    dupRange: "Page range (e.g. 1,3 or 2-4)", dupCopies: "Copies", dupEmpty: "Please enter a valid page range.", dupDone: "Duplicated, now {0} pages.",
    t_duplicate_name: "Duplicate Pages", t_duplicate_desc: "Copy selected pages multiple times, inserted after the originals.",
    sigPos: "Position", sigScale: "Size (% of page width)", sigPages: "Apply to", sigAll: "All", sigFirst: "First", sigLast: "Last", sigDone: "Image added to {0} pages.",
    t_sign_name: "Add Image / Signature", t_sign_desc: "Overlay an image (e.g. signature or stamp) at a chosen position.",
    revDone: "Reversed, now {0} pages.",
    t_reverse_name: "Reverse Order", t_reverse_desc: "Reverse the order of all pages.",
    t_grayscale_name: "Grayscale", t_grayscale_desc: "Convert every page to black & white grayscale, ideal for printing.",
    grayScale: "Render Quality", grayDone: "Grayscale PDF generated ({0} pages).",
    t_pdf2word_name: "PDF to Word", t_pdf2word_desc: "Extract PDF text and export an editable .docx (text only, no original layout/images).",
    wordPageNum: "Page number header", wordNoPageNum: "None", wordYes: "Yes", wordNo: "No", wordPageBreak: "Page break between pages", wordDone: "Word document exported ({0} pages).", wordNote: "Note: text only — tables/images/layout are not preserved.",
    t_extractimg_name: "Extract Images", t_extractimg_desc: "Pull embedded raster images out of the PDF, deduped and zipped as PNG.",
    extScale: "Render Quality", extDone: "Extracted {0} images into a ZIP.", extNone: "No embedded raster images detected in this PDF.", extNote: "Note: extracts embedded bitmaps (decoded to PNG), deduped by content.",
    t_pdf2ppt_name: "PDF to PPT", t_pdf2ppt_desc: "Render each page as an image and build an editable .pptx (one picture per slide).",
    pptQuality: "Render Quality", pptDone: "Presentation generated ({0} slides).", pptNote: "Note: each page is placed as a picture — editable as a whole, but text is not directly editable; layout is fully preserved.",
    t_pdf2excel_name: "PDF to Excel", t_pdf2excel_desc: "Rebuild tables from text positions and export an editable .xlsx (text placed by coordinates; complex multi-column may be imprecise).",
    xlsxDone: "Spreadsheet generated ({0} pages, {1} rows).", xlsxNone: "No text could be extracted (likely a scanned PDF — try the OCR tool first).", xlsxNote: "Note: rows/columns are rebuilt from text coordinates; best for simple tables; scanned PDFs need OCR first.",
    t_rmblank_name: "Remove Blank Pages", t_rmblank_desc: "Auto-detect and remove near-empty pages (pixel analysis).",
    rmblankMode: "Sensitivity", rmblankStrict: "Strict (pure white)", rmblankLoose: "Loose (incl. light)",
    rmblankDone: "Removed {0} blank pages, {1} remaining.", rmblankNone: "No blank pages detected.",
    t_pdf2long_name: "PDF to Long Image", t_pdf2long_desc: "Stitch all pages into one tall image for easy sharing.",
    longScale: "Render quality", longNote: "Note: the long image is for preview/sharing only (text not selectable); total height is auto-limited for many pages.", longDone: "Long image generated ({0} pages, {1}).", longWarn: "(auto-shrunk to stay savable)",
    t_links_name: "Extract Links", t_links_desc: "Extract all hyperlinks / URLs from the PDF and export as text.",
    linksDone: "Extracted {0} links.", linksNone: "No link annotations found in the PDF.", linksInternal: "internal",
    linksNote: "Note: only annotated links are extracted; image or handwritten links may be missed.",
    t_booklet_name: "N-up Layout", t_booklet_desc: "Arrange multiple pages onto one sheet (2-up / 4-up) to save paper.",
    bookLayout: "Layout", book2: "2-up (side by side)", book4: "4-up (grid)",
    bookDone: "N-up PDF generated ({0} pages → {1} pages).",
    t_cover_name: "Add Cover", t_cover_desc: "Generate a cover page (title + subtitle) and insert it at the front.",
    coverTitle: "Cover title", coverSub: "Subtitle (optional)", coverSubPh: "Optional, e.g. 2026 Annual Report", coverDefault: "Document Cover", coverFoot: "Generated by PDF Toolkit",
    coverDone: "Cover added, {0} pages total.", coverNote: "Note: the cover is rendered with browser fonts and embedded as an image; the rest stays editable.",
    t_repair_name: "Repair & Rebuild", t_repair_desc: "Re-parse and repackage the PDF to fix minor corruption or structural issues.",
    repairNote: "Note: this tool fixes structural issues by re-parsing/re-packaging; it cannot recover already-corrupted content data.",
    repairDone: "Repaired: {0} pages, size {1} → {2}.", repairSame: "Structure is fine; repackaged ({0} pages).", repairFail: "Cannot repair: the file may be severely corrupted.",
    t_bg_name: "Add Background", t_bg_desc: "Apply a solid color background or colored border to every page.",
    bgColor: "Background color", bgMode: "Mode", bgFull: "Full fill", bgFrame: "Colored border", bgDone: "Added background to {0} pages.",
    t_margin_name: "Add Margins", t_margin_desc: "Add uniform margins around each page for printing/binding.",
    mgSize: "Margin", mgColor: "Margin color", mgDone: "Added {1}mm margins to {0} pages.",
    t_wmimg_name: "Image Watermark", t_wmimg_desc: "Upload an image as a tiled or centered watermark, with size & opacity.",
    wmimgUpload: "Upload watermark image", wmimgLayout: "Layout", wmimgTile: "Tiled", wmimgSingle: "Centered", wmimgScale: "Size", wmimgOpacity: "Opacity", wmimgDone: "Added image watermark to {0} pages.",
    t_outline_name: "Extract Bookmarks", t_outline_desc: "Read the PDF outline/bookmarks tree and export as a text file.",
    outlineNote: "Note: exports the document's built-in outline only, not in-page headings.", outlineNone: "No bookmark outline found in the PDF.", outlineDone: "Extracted {0} bookmark entries.",
    t_formfields_name: "Extract Form Fields", t_formfields_desc: "Read PDF (AcroForm) field names, types and values.",
    formNote: "Note: supports standard AcroForm only, not forms in scanned images.", formNone: "No readable form fields found in the PDF.", formDone: "Extracted {0} form fields.",
    t_rmanno_name: "Remove Annotations", t_rmanno_desc: "Strip comment, highlight, link and other annotation objects from pages.",
    rmKeepLinks: "Keep web links", rmAll: "Remove all", rmKeep: "Keep links only", rmDone: "Processed annotations on {0} pages.",
    t_burst_name: "Split to Single Pages", t_burst_desc: "Export each page of the PDF as a separate file (zipped when many).",
    burstNote: "Each page becomes its own PDF; zipped automatically for multiple pages.", burstProg: "Splitting page {0}/{1}…", burstDone: "Split into {0} single-page PDFs.", burstOne: "Only 1 page — exported as is.",
    t_oddeven_name: "Odd/Even Split", t_oddeven_desc: "Split pages by parity into two PDFs (odd / even).",
    oeNote: "Export pages 1,3,5… and 2,4,6… separately.", oeNone: "No pages to split.", oeDone: "Split: {0} odd pages, {1} even pages.",
    t_attach_name: "Extract Attachments", t_attach_desc: "Extract embedded attachment files from the PDF (e.g. Portfolio).",
    attNote: "Unpack EmbeddedFiles from the document Names tree.", attNone: "No embedded attachments found.", attDone: "Extracted {0} attachment file(s).",
    t_collate_name: "Interleave Merge", t_collate_desc: "Merge two PDFs page-by-page (1a,1b,2a,2b…).",
    collateNote: "Upload two PDFs; they are interleaved page by page into one file.", collateNeed: "Please upload two PDF files.", collateProg: "Merging page {0}/{1}…", collateDone: "Interleaved: A {0} + B {1} → {2} pages.",
    t_splitbm_name: "Split by Bookmarks", t_splitbm_desc: "Split the PDF into parts based on top-level bookmarks.",
    sbmNote: "Use top-level outline entries as split points by page range.", sbmNone: "No outline found; cannot split by bookmarks.", sbmFew: "Fewer than two bookmarks; nothing to split.", sbmProg: "Exporting part {0}/{1}…", sbmDone: "Split into {0} PDFs by bookmarks.",
    t_wordcount_name: "Word Count", t_wordcount_desc: "Count total characters, Chinese chars and English words.",
    wcNote: "Text is extracted via pdf.js; scanned PDFs may undercount.", wcProg: "Counting page {0}/{1}…", wcDone: "Pages {0}, chars {1}, Chinese {2}, English words {3}.", wcReport: "Pages: {0}\nTotal chars: {1}\nChinese chars: {2}\nEnglish words: {3}",
    t_addlink_name: 'Add Links', t_addlink_desc: 'Add clickable web hyperlinks (URI) to pages.',
    alUrl: 'Link URL', alPages: 'Pages (e.g. 1-3,5 or all)', alRegion: 'Link region',
    alFull: 'Full page', alTop: 'Top', alMid: 'Middle', alBot: 'Bottom',
    alDone: 'Added hyperlinks to {0} pages.', alNeedUrl: 'Enter a URL starting with http(s).', alErr: 'No valid pages parsed; check the page range.',
    t_bates_name: 'Bates Numbering', t_bates_desc: 'Add sequential page/identifier numbers, common in legal files.',
    btPrefix: 'Prefix', btStart: 'Start number', btDigits: 'Digit padding', btPos: 'Position',
    posTL: 'Top-Left', posTR: 'Top-Right', posBL: 'Bottom-Left', posBR: 'Bottom-Right', posMC: 'Center',
    btDone: 'Added Bates numbers to {0} pages.',
    t_overlay_name: 'Overlay PDF', t_overlay_desc: 'Overlay a template PDF (letterhead/background) onto each page.',
    ovMain: 'Target PDF', ovTmpl: 'Template PDF',
    ovNote: 'Upload target and template PDFs; the template fills each target page.', ovNeed: 'Please upload both the target PDF and the template PDF.', ovProg: 'Overlaying page {0}/{1}…', ovDone: 'Template overlaid; produced {0}-page PDF.',
    t_compare_name: 'Compare Text', t_compare_desc: 'Compare two PDFs page by page and list differing pages.',
    cmpNote: 'Upload two PDFs; text is compared per page (via pdf.js).', cmpNeed: 'Please upload two PDF files.', cmpProg: 'Comparing page {0}/{1}…',
    cmpDone: 'Done: {0} pages, {1} differ (pages {2}).', cmpSame: 'The two PDFs are textually identical ({0} pages).',
    cmpReport: 'Comparison result\nPDF A pages: {0}\nPDF B pages: {1}\nDifferent pages: {2}\nDiffering page numbers (1-based): {3}',
    t_annoextract_name: 'Extract Annotations', t_annoextract_desc: 'Extract comments, highlights and other annotation contents to a file.',
    aeNote: 'Reads annotation objects per page (highlight/text/stamp…) and exports ann.txt.', aeProg: 'Reading page {0}/{1}…', aeNone: 'No annotations found.', aeDone: 'Extracted {0} annotations; exported annotations.txt.', aeHead: 'Annotation extraction (total {0} pages, {1} annotations)',
    t_papersize_name: 'Page Size', t_papersize_desc: 'Convert page size to standards like A4 / A3 / A5 / Letter / Legal.',
    psTarget: 'Target size', psMode: 'Scaling', psContain: 'Fit', psCenter: 'Center (no scale)', psProg: 'Converting page {0}/{1}…',     psDone: 'Converted to {0}; {1} pages.',
    t_border_name: 'Add Border', t_border_desc: 'Add an optional-color rectangular border to every page.',
    bdColor: 'Color', bdDark: 'Dark', bdRed: 'Red', bdBlue: 'Blue', bdGreen: 'Green', bdW: 'Width (px)', bdProg: 'Adding border {0}/{1}…', bdDone: 'Border added to {0} pages.',
    t_redact_name: 'Redact', t_redact_desc: 'Cover specified pages/regions with black/white blocks (e.g. sensitive info).',
    rdPages: 'Pages (e.g. 1-3,5 or all)', rdRegion: 'Region', rdFull: 'Full', rdTop: 'Top', rdBot: 'Bottom', rdColor: 'Cover color', rdBlack: 'Black', rdWhite: 'White', rdErr: 'No valid pages parsed; check the page range.', rdProg: 'Redacting page {0}/{1}…', rdDone: 'Redacted {0} pages.',
    t_fontlist_name: 'Font List', t_fontlist_desc: 'Extract font names and types used in the document.',
    flNote: 'Extracts font names and types; exports fonts.txt.', flProg: 'Reading page {0}/{1}…', flHead: 'Font list ({0} types)', flNone: 'No font info found.', flDone: 'Extracted {0} font types.',
    t_pagesizes_name: 'Page Size Report', t_pagesizes_desc: 'List each page size (pt & mm) and its standard name.',
    pszNote: 'Lists each page size (pt & mm) and standard name; exports page-sizes.txt.', pszHead: 'Page size report ({0} pages)', pszProg: 'Measuring page {0}/{1}…', pszRow: 'Page {0}: {1} × {2} pt  ({3})', pszDone: 'Generated size report for {0} pages.',
    t_removemeta_name: 'Remove Metadata', t_removemeta_desc: 'Strip XMP metadata and document info fields.',
    rm2Mode: 'Scope', rm2Fields: 'Fields only', rm2All: 'Whole Info', rm2Note: 'Deletes XMP metadata; "Fields only" clears values but keeps structure, "Whole Info" removes the Info dict.', rm2Done: 'Metadata removed ({0}).',
    t_datestamp_name: 'Date Stamp', t_datestamp_desc: 'Add a date or custom text stamp to page corners (use ASCII/digits).',
    dsText: 'Stamp text (ASCII/digits)', dsPos: 'Position', dsNote: 'Drawn with Helvetica; CJK may not show — use ASCII/digits (e.g. a date).', dsNeed: 'Enter stamp text.', dsProg: 'Stamping page {0}/{1}…', dsDone: 'Date stamp added to {0} pages.',
    t_flatten_name: 'Flatten Forms', t_flatten_desc: 'Bake form field values into static text and remove interactive widgets (CJK values may not show).',
    flNote: 'Renders filled form values as static text and removes widgets; values best in ASCII/digits.', flKeep: 'Widgets', flRemove: 'Remove', flKeepWidgets: 'Keep', flProg: 'Processing page {0}/{1}…', flDone: 'Flattened {0} fields.',
    t_embed_name: 'Embed Attachment', t_embed_desc: 'Embed any file into the PDF as an attachment (EmbeddedFiles).',
    emPdf: 'Main PDF', emFile: 'Attachment', emNote: 'Pick the main PDF and a file to embed; retrieve it later with Extract Attachments.', emNeed: 'Select both a main PDF and an attachment.', emDone: 'Embedded attachment: {0}.',
    t_mkbm_name: 'Make Bookmarks', t_mkbm_desc: 'Generate PDF outline bookmarks from "page title" lines (indent = level).',
    bmFmt: 'Each line: pageNumber + space + title; 2 leading spaces = one indent level.', bmNote: 'Example: 2-space indent marks a sub-item; pages start at 1.', bmNeed: 'Enter at least one "page title" line.',     bmDone: 'Created {0} bookmarks.',
    t_ocrpdf_name: 'OCR Searchable PDF', t_ocrpdf_desc: 'Recognize scanned-page text and overlay a searchable text layer into the PDF.', ocrpdfNote: 'CJK text layer may be skipped due to font limits (images & Latin remain searchable); default recognizes Chinese+English.', ocrpdfProg: 'Recognizing page {0}/{1}…', ocrpdfDone: 'Searchable PDF created ({0} pages).',
    t_pdf2html_name: 'PDF to HTML', t_pdf2html_desc: 'Extract per-page text into an HTML file with page structure.', p2hNote: 'Text extracted via pdf.js; complex layouts may not be perfect.', p2hTitle: 'PDF Text Export', p2hProg: 'Extracting page {0}/{1}…', p2hDone: 'HTML exported ({0} pages).',
    t_unify_name: 'Merge & Unify Size', t_unify_desc: 'Merge multiple PDFs and unify all pages to a target paper size.', unProg: 'Processing file {0}/{1}…', unDone: 'Merged and unified to {0} ({1} pages).',
    t_wmcn_name: 'Chinese Watermark', t_wmcn_desc: 'CJK-capable watermark (rendered as image; tile or center).', wmcnText: 'Watermark text', wmcnDefault: 'CONFIDENTIAL', wmcnColor: 'Color', wmcnGray: 'Gray', wmcnRed: 'Red', wmcnBlue: 'Blue', wmcnSize: 'Font size', wmcnAngle: 'Angle', wmcnMode: 'Mode', wmcnTile: 'Tile', wmcnCenter: 'Center', wmcnOpacity: 'Opacity', wmcnLight: 'Light', wmcnMid: 'Medium', wmcnStrong: 'Strong', wmcnNote: 'Renders Chinese via html2canvas, fixing the Latin-only watermark limitation.', wmcnNeed: 'Enter watermark text.', wmcnProg: 'Processing page {0}/{1}…', wmcnDone: 'Chinese watermark added to {0} pages.',
    t_bm2md_name: 'Bookmarks to Markdown', t_bm2md_desc: 'Export the PDF outline bookmarks to a Markdown file.', bm2mdTitle: 'PDF Bookmarks', bm2mdNote: 'Hierarchical Markdown from the outline (# = level 1).', bm2mdNone: 'No outline bookmarks found.', bm2mdDone: 'Exported {0} bookmarks to Markdown.',
    t_resize2_name: 'Custom Size', t_resize2_desc: 'Resize all pages to a custom width/height in millimeters.', r2W: 'Width (mm)', r2H: 'Height (mm)', r2Need: 'Enter a valid width and height (must be > 0).', r2Prog: 'Processing page {0}/{1}…', r2Done: 'Resized to {0}×{1} mm ({2} pages).',
    t_formfill_name: 'Fill Form', t_formfill_desc: 'Fill a PDF form in batch from a JSON map by field name (values best in ASCII/digits).',
    ffPdf: 'Main PDF', ffJsonFile: 'Fields JSON', ffNote: 'Upload the PDF and a field-map JSON ({"fieldName":"value",...}); text, checkbox, dropdown etc. auto-matched by name.', ffNeed: 'Select both a PDF and a JSON file.', ffJson: 'JSON parse failed; check the format.', ffDone: 'Filled {0} fields (of {1} total).',
    t_formexport_name: 'Export Form Fields', t_formexport_desc: 'Export the PDF form field names, types and current values to a JSON file.',
    feNote: 'Exports the AcroForm field list as form-fields.json for backup or as a fill template.', feNone: 'No form fields found.', feDone: 'Exported {0} fields to JSON.',
    t_duplex_name: 'Two-up Imposition', t_duplex_desc: 'Place consecutive pages side by side on landscape sheets for booklet printing.',
    dpGap: 'Gap (pt)', dpProg: 'Imposing pair {0}/{1}…', dpDone: 'Created {0} two-up sheets (from {1} pages).',
    t_splitsize_name: 'Split by Size', t_splitsize_desc: 'Split a PDF into smaller files by a target file size.',
    ssSize: 'Max size per file (MB)', ssNeed: 'Enter a size greater than 0.', ssProg: 'Splitting page {0}/{1}…', ssDone: 'Split into {0} files (threshold {1} MB).',
    t_autocrop_name: 'Auto Crop Margins', t_autocrop_desc: 'Detect each page’s content boundary and trim excess white margins.',
    acTol: 'Edge tolerance (pt)', acNote: 'Finds the content boundary via rendered pixels and sets the crop box; best on white-background scans.', acProg: 'Analyzing page {0}/{1}…', acDone: 'Cropped margins on {0} pages.', acNone: 'No obvious margins found; left unchanged.',
    t_autobm_name: 'Auto Bookmarks', t_autobm_desc: "Auto-generate PDF outline bookmarks from each page’s largest title text.",
    abMin: 'Min font size', abNote: "Uses the largest-font text snippet per page as that page’s bookmark title; good for clean headings.", abProg: 'Analyzing page {0}/{1}…', abDone: 'Generated {0} bookmarks.', abNone: 'No suitable headings detected; no bookmarks made.',
    t_nup_name: 'N-up Imposition', t_nup_desc: 'Shrink multiple pages onto one sheet (2×2 / 3×3 / 4×4) for handout printing.', npLayout: 'Layout', npNote: 'Each cell is scaled to the page ratio; blank pages keep their slot.', npProg: 'Imposing page {0}/{1}…', npDone: 'Created {0} N-up sheets (from {1} pages).',
    t_mdtext_name: 'Full Text → Markdown', t_mdtext_desc: 'Extract all body text and export as page-marked Markdown.', mtNote: 'Split by page and keep paragraph breaks for search and notes.', mtProg: 'Extracting page {0}/{1}…', mtDone: 'Exported {0} pages of text as Markdown.',
    t_recompress_name: 'True Compress (resample)', t_recompress_desc: 'Re-render each page as a low-quality image and rebuild — real size reduction (great for scanned/image PDFs).', rcQuality: 'Image quality', rcNote: 'Only resamples images; text-only PDFs have limited room to shrink.', rcProg: 'Compressing page {0}/{1}…', rcDone: 'Compressed: {0} → {1} (saved {2}%).',
    p2iWebp: 'WebP', p2iQual: 'Quality', p2iHigh: 'High', p2iStd: 'Standard',
    cjkNote: 'Non-Latin text (e.g. Chinese) is auto-rendered as an image to display correctly.',
    catFav: 'Favorites', catRecent: 'Recent', favTip: 'Click the star at a card’s top-right to favorite a tool.',
    t_annotate_name: 'PDF Annotate', t_annotate_desc: 'Add highlight or sticky-note annotations readable by Adobe and other viewers.', anType: 'Type', anHighlight: 'Highlight', anSticky: 'Sticky', anText: 'Note text', anColor: 'Color', anPages: 'Page range', anNote: 'Highlight adds a translucent band across the middle; sticky shows a bubble at top-right (text optional).', anProg: 'Annotating page {0}/{1}…', anDone: 'Annotated {0} pages.', anNeed: 'Sticky mode needs note text.'
    }
  };

  let curLang = "zh";
  try { curLang = localStorage.getItem("pdf_lang") || "zh"; } catch (e) {}
  if (curLang !== "zh" && curLang !== "en") curLang = "zh";

  function t(key, ...args) {
    const dict = (LANGS[curLang] && LANGS[curLang][key] != null) ? LANGS[curLang] : LANGS.zh;
    let s = (dict[key] != null) ? dict[key] : (LANGS.zh[key] != null ? LANGS.zh[key] : key);
    if (args.length) s = s.replace(/\{(\d+)\}/g, (_, i) => args[i]);
    return s;
  }

  /* ---------- 工具定义 ---------- */
  const TOOLS = [
    {
      id: "merge", icon: "merge", accept: "application/pdf", multiple: true,
      opts: () => `
        <div class="opt-row"><label>${t("mergeOrder")}</label>
          <div style="color:var(--muted);font-size:13.5px">${t("mergeOrderDesc")}</div></div>`,
      run: async (files, get, prog) => {
        prog(8, t("progReading"));
        const out = await PDFLib.PDFDocument.create();
        let done = 0;
        for (const f of files) {
          const bytes = await readBytes(f);
          const doc = await PDFLib.PDFDocument.load(bytes, { ignoreEncryption: true });
          const pages = await out.copyPages(doc, doc.getPageIndices());
          pages.forEach((p) => out.addPage(p));
          done++;
          prog(8 + Math.round((done / files.length) * 80), t("progExtracting") + " " + done + "/" + files.length);
        }
        const b = await out.save();
        return { downloads: [{ name: "merged.pdf", bytes: b, mime: "application/pdf" }], info: t("mergeDone", files.length, out.getPageCount()) };
      }
    },
    {
      id: "split", icon: "split", accept: "application/pdf", multiple: false,
      opts: () => `
        <div class="opt-row"><label>${t("splitMode")}</label>
          <div class="seg" data-opt="splitMode">
            <input type="hidden" value="range">
            <button type="button" data-val="range" class="on">${t("splitRange")}</button>
            <button type="button" data-val="each">${t("splitEach")}</button>
          </div></div>
        <div class="opt-row"><label>${t("splitRangeLabel")}<span class="hint">${t("splitHint")}</span></label>
          <input class="field" data-opt="range" placeholder="1,3,5-8" value="1"></div>`,
      run: async (files, get, prog) => {
        const bytes = await readBytes(files[0]);
        const doc = await PDFLib.PDFDocument.load(bytes);
        const total = doc.getPageCount();
        const mode = get("splitMode") || "range";
        const idx = parseRange(get("range") || "1", total);
        if (!idx.length) throw new Error(t("errRangeInvalid", total));
        if (mode === "range") {
          prog(20, t("progExtracting"));
          const out = await PDFLib.PDFDocument.create();
          const pages = await out.copyPages(doc, idx.map((i) => i - 1));
          pages.forEach((p) => out.addPage(p));
          const b = await out.save();
          return { downloads: [{ name: "split.pdf", bytes: b, mime: "application/pdf" }], info: t("splitRangeDone", idx.length) };
        }
        const out = [];
        for (let i = 0; i < idx.length; i++) {
          prog(10 + Math.round((i / idx.length) * 80), t("progSplitPage", idx[i]));
          const one = await PDFLib.PDFDocument.create();
          const ps = await one.copyPages(doc, [idx[i] - 1]);
          one.addPage(ps[0]);
          out.push({ name: "page-" + String(idx[i]).padStart(3, "0") + ".pdf", bytes: await one.save(), mime: "application/pdf" });
        }
        return { downloads: out, info: t("splitEachDone", out.length) };
      }
    },
    {
      id: "img2pdf", icon: "image", accept: "image/png,image/jpeg", multiple: true,
      opts: () => `
        <div class="opt-row"><label>${t("imgSize")}</label>
          <div class="seg" data-opt="size">
            <input type="hidden" value="a4">
            <button type="button" data-val="a4" class="on">${t("imgA4")}</button>
            <button type="button" data-val="origin">${t("imgOrigin")}</button>
          </div></div>`,
      run: async (files, get, prog) => {
        const out = await PDFLib.PDFDocument.create();
        const size = get("size") || "a4";
        let done = 0;
        for (const f of files) {
          const bytes = await readBytes(f);
          let img = f.type.includes("png") ? await out.embedPng(bytes) : await out.embedJpg(bytes);
          const iw = img.width, ih = img.height;
          prog(10 + Math.round((done / files.length) * 80), t("progExtracting") + " " + (done + 1) + "/" + files.length);
          if (size === "a4") {
            const pw = 595.28, ph = 841.89, m = 40;
            const sc = Math.min((pw - 2 * m) / iw, (ph - 2 * m) / ih);
            const w = iw * sc, h = ih * sc;
            const page = out.addPage([pw, ph]);
            page.drawImage(img, { x: (pw - w) / 2, y: (ph - h) / 2, width: w, height: h });
          } else {
            const page = out.addPage([iw, ih]);
            page.drawImage(img, { x: 0, y: 0, width: iw, height: ih });
          }
          done++;
        }
        const b = await out.save();
        return { downloads: [{ name: "images.pdf", bytes: b, mime: "application/pdf" }], info: t("imgDone", out.getPageCount()) };
      }
    },
    {
      id: "compress", icon: "compress", accept: "application/pdf", multiple: false,
      opts: () => `<div class="opt-row"><label>${t("compLevel")}</label>
          <div class="seg" data-opt="level"><input type="hidden" value="balanced">
            <button type="button" data-val="balanced" class="on">${t("compBalanced")}</button>
            <button type="button" data-val="max">${t("compMax")}</button></div></div>`,
      run: async (files, get, prog) => {
        prog(20, t("progRepackage"));
        const bytes = await readBytes(files[0]);
        const doc = await PDFLib.PDFDocument.load(bytes);
        const useStreams = (get("level") || "balanced") === "max";
        const b = await doc.save({ useObjectStreams: useStreams });
        const before = bytes.length, after = b.length;
        const delta = after <= before
          ? t("compressBest", fmt(after))
          : t("compressSaved", fmt(before), fmt(after), Math.round((1 - after / before) * 100));
        return { downloads: [{ name: "compressed.pdf", bytes: b, mime: "application/pdf" }], info: delta };
      }
    },
    {
      id: "watermark", icon: "watermark", accept: "application/pdf", multiple: false,
      opts: () => `
        <div class="opt-row"><label>${t("wmText")}</label><input class="field" data-opt="text" value="机密 CONFIDENTIAL"></div>
        <div class="opt-row"><label>${t("wmColor")}</label>
          <div class="swatches" data-opt="color"><input type="hidden" value="#94a3b8">
            <span class="swatch on" data-color="#94a3b8" style="background:#94a3b8"></span>
            <span class="swatch" data-color="#6366f1" style="background:#6366f1"></span>
            <span class="swatch" data-color="#ef4444" style="background:#ef4444"></span>
            <span class="swatch" data-color="#0f172a" style="background:#0f172a"></span></div></div>
        <div class="opt-row"><label>${t("wmSize")} <span class="range-val" id="wmSize_val">26</span></label>
          <input type="range" min="14" max="60" value="26" data-opt="size" id="wmSize"></div>
        <div class="opt-row"><label>${t("wmOpacity")} <span class="range-val" id="wmOp_val">18</span>%</label>
          <input type="range" min="5" max="60" value="18" data-opt="opacity" id="wmOp"></div>
        <div class="opt-row"><label>${t("wmRot")} <span class="range-val" id="wmRot_val">30</span>°</label>
          <input type="range" min="0" max="60" value="30" data-opt="rotation" id="wmRot"></div>`,
      run: async (files, get, prog) => {
        prog(20, t("progFont"));
        const bytes = await readBytes(files[0]);
        const doc = await PDFLib.PDFDocument.load(bytes);
        const text = (get("text") || "WATERMARK").toString();
        const color = hexToRgb(get("color") || "#94a3b8");
        const size = +get("size") || 26, opacity = (+get("opacity") || 18) / 100, rot = +get("rotation") || 30;
        const cjk = hasCJK(text);
        const font = cjk ? null : await doc.embedFont(PDFLib.StandardFonts.Helvetica);
        let cjkImg = null, cjkW = 0, cjkH = 0;
        if (cjk) {
          const hex = "#" + [color.r, color.g, color.b].map((v) => Math.round(v * 255).toString(16).padStart(2, "0")).join("");
          const png = await cjkTextPngBytes(text, { size, color: hex, bold: true, pad: 12 });
          cjkImg = await doc.embedPng(png.bytes);
          cjkW = png.w; cjkH = png.h;
        }
        const pages = doc.getPages();
        prog(35, t("progWatermark"));
        const drawTile = (page, w, h) => {
          const sx = cjk ? cjkW * 1.8 : 240, sy = cjk ? cjkH * 1.8 : 130;
          for (let y = -sy; y < h + sy; y += sy)
            for (let x = -sx; x < w + sx; x += sx) {
              if (cjk) {
                const dw = cjkW, dh = cjkH;
                page.drawImage(cjkImg, { x: x + (sx - dw) / 2, y: y + (sy - dh) / 2, width: dw, height: dh, opacity, rotate: PDFLib.degrees(rot) });
              } else {
                page.drawText(text, { x, y, size, font, color, opacity, rotate: PDFLib.degrees(rot) });
              }
            }
        };
        pages.forEach((page, i) => {
          const { width, height } = page.getSize();
          drawTile(page, width, height);
          if (i % 5 === 0) prog(35 + Math.round((i / pages.length) * 55), t("progWatermarkPage", i + 1));
        });
        const b = await doc.save();
        return { downloads: [{ name: "watermarked.pdf", bytes: b, mime: "application/pdf" }], info: t("watermarkDone", pages.length) };
      }
    },
    {
      id: "pagenum", icon: "pagenum", accept: "application/pdf", multiple: false,
      opts: () => `
        <div class="opt-row"><label>${t("pnPos")}</label>
          <div class="seg" data-opt="pos"><input type="hidden" value="bottom-center">
            <button type="button" data-val="bottom-center" class="on">${t("pnBottomCenter")}</button>
            <button type="button" data-val="bottom-right">${t("pnBottomRight")}</button>
            <button type="button" data-val="top-right">${t("pnTopRight")}</button></div></div>
        <div class="opt-row"><label>${t("pnStart")}</label><input class="field" type="number" data-opt="start" value="1" style="max-width:120px"></div>
        <div class="opt-row"><label>${t("pnPrefix")}</label><input class="field" data-opt="prefix" placeholder="${t("pnPrefixPh")}"></div>`,
      run: async (files, get, prog) => {
        prog(20, t("progFont"));
        const bytes = await readBytes(files[0]);
        const doc = await PDFLib.PDFDocument.load(bytes);
        const font = await doc.embedFont(PDFLib.StandardFonts.Helvetica);
        const pos = get("pos") || "bottom-center", start = +(get("start") || 1), prefix = get("prefix") || "";
        const color = hexToRgb("#475569"), size = 12;
        const pages = doc.getPages();
        pages.forEach((page, i) => {
          const { width, height } = page.getSize();
          const label = prefix + (start + i);
          const w = font.widthOfTextAtSize(label, size);
          let x = 24, y = 24;
          if (pos === "bottom-center") x = (width - w) / 2;
          else if (pos === "bottom-right") x = width - w - 24;
          else if (pos === "top-right") { x = width - w - 24; y = height - 32; }
          page.drawText(label, { x, y, size, font, color });
        });
        prog(80, t("progPagenum"));
        const b = await doc.save();
        return { downloads: [{ name: "numbered.pdf", bytes: b, mime: "application/pdf" }], info: t("pagenumDone", pages.length) };
      }
    },
    {
      id: "rotate", icon: "rotate", accept: "application/pdf", multiple: false,
      opts: () => `
        <div class="opt-row"><label>${t("rotAngle")}</label>
          <div class="seg" data-opt="angle"><input type="hidden" value="90">
            <button type="button" data-val="90" class="on">90°</button>
            <button type="button" data-val="180">180°</button>
            <button type="button" data-val="270">270°</button></div></div>`,
      run: async (files, get, prog) => {
        const bytes = await readBytes(files[0]);
        const doc = await PDFLib.PDFDocument.load(bytes);
        const ang = +(get("angle") || 90);
        prog(30, t("progRotate"));
        doc.getPages().forEach((p) => p.setRotation(PDFLib.degrees(ang)));
        const b = await doc.save();
        return { downloads: [{ name: "rotated.pdf", bytes: b, mime: "application/pdf" }], info: t("rotateDone", doc.getPageCount(), ang) };
      }
    },
    {
      id: "delete", icon: "delete", accept: "application/pdf", multiple: false,
      opts: () => `
        <div class="opt-row"><label>${t("delRange")}<span class="hint">${t("delHint")}</span></label>
          <input class="field" data-opt="range" placeholder="1,3,5-8"></div>`,
      run: async (files, get, prog) => {
        const bytes = await readBytes(files[0]);
        const doc = await PDFLib.PDFDocument.load(bytes);
        const total = doc.getPageCount();
        const rm = parseRange(get("range") || "", total);
        if (!rm.length) throw new Error(t("errDeleteEmpty", total));
        prog(30, t("progDelete"));
        rm.sort((a, b) => b - a).forEach((p) => doc.removePage(p - 1));
        if (doc.getPageCount() === 0) throw new Error(t("errDeleteAll"));
        const b = await doc.save();
        return { downloads: [{ name: "deleted.pdf", bytes: b, mime: "application/pdf" }], info: t("deleteDone", rm.length, doc.getPageCount()) };
      }
    },
    {
      id: "ocr", icon: "ocr", accept: "application/pdf,image/png,image/jpeg", multiple: false,
      opts: () => `
        <div class="opt-row"><label>${t("ocrLang")}</label>
          <div class="seg" data-opt="lang"><input type="hidden" value="chi_sim+eng">
            <button type="button" data-val="chi_sim+eng" class="on">${t("ocrLangZhEn")}</button>
            <button type="button" data-val="chi_sim">${t("ocrLangZh")}</button>
            <button type="button" data-val="eng">${t("ocrLangEn")}</button></div></div>
        <div class="opt-row"><label>${t("ocrScale")} <span class="range-val" id="ocrScale_val">2">×</span></label>
          <input type="range" min="1.5" max="3" step="0.5" value="2" data-opt="scale" id="ocrScale"></div>
        <div class="opt-row"><label>${t("noteLabel")}</label>
          <div style="color:var(--muted);font-size:13.5px">${t("ocrNote")}</div></div>`,
      run: async (files, get, prog) => {
        if (typeof Tesseract === "undefined") throw new Error(t("errOcrEngine"));
        const lang = get("lang") || "chi_sim+eng";
        const scale = +get("scale") || 2;
        const TESS = new URL("vendor/tesseract/", location.href).href;
        const coreFile = (await simdSupported()) ? "tesseract-core-simd-lstm.wasm.js" : "tesseract-core-lstm.wasm.js";
        prog(4, t("progOcrEngine"));
        const worker = await Tesseract.createWorker(lang, 1, {
          workerPath: TESS + "worker.min.js",
          corePath: TESS + coreFile,
          langPath: TESS + "lang/",
          logger: (m) => {
            if (m && m.status === "recognizing text" && typeof m.progress === "number")
              prog(30 + m.progress * 62, t("progOcrPage", Math.round(m.progress * 100)));
          }
        });
        let text = "";
        try {
          const file = files[0];
          if (file.type === "application/pdf") {
            pdfjsLib.GlobalWorkerOptions.workerSrc = "vendor/pdf.worker.min.js";
            const bytes = await readBytes(file);
            const doc = await pdfjsLib.getDocument({ data: bytes.slice(0) }).promise;
            for (let i = 1; i <= doc.numPages; i++) {
              prog(6 + Math.round((i / doc.numPages) * 22), t("progRenderPage", i, doc.numPages));
              const page = await doc.getPage(i);
              const vp = page.getViewport({ scale });
              const canvas = document.createElement("canvas");
              canvas.width = vp.width; canvas.height = vp.height;
              await page.render({ canvasContext: canvas.getContext("2d"), viewport: vp }).promise;
              const { data } = await worker.recognize(canvas);
              text += "— " + t("t_ocr_name") + " " + i + " —\n" + data.text.trim() + "\n\n";
            }
          } else {
            prog(20, t("progOcrEngine"));
            const { data } = await worker.recognize(file);
            text += data.text.trim();
          }
        } finally {
          await worker.terminate();
        }
        const enc = new TextEncoder().encode(text);
        const preview = text.trim().length ? text.trim() : t("ocrEmpty");
        return { downloads: [{ name: "ocr_result.txt", bytes: enc, mime: "text/plain" }], info: t("ocrDone"), preview };
      }
    },
    {
      id: "pdf2img", icon: "topng", accept: "application/pdf", multiple: false,
      opts: () => `
        <div class="opt-row"><label>${t("p2iFmt")}</label>
          <div class="seg" data-opt="fmt"><input type="hidden" value="png">
            <button type="button" data-val="png" class="on">PNG</button>
            <button type="button" data-val="jpeg">JPG</button>
            <button type="button" data-val="webp">${t("p2iWebp")}</button></div></div>
        <div class="opt-row"><label>${t("p2iQual")}</label>
          <div class="seg" data-opt="qual"><input type="hidden" value="0.92">
            <button type="button" data-val="0.95">${t("p2iHigh")}</button>
            <button type="button" data-val="0.92" class="on">${t("p2iStd")}</button>
            <button type="button" data-val="0.7">${t("p2iWebp")}↓</button></div></div>
        <div class="opt-row"><label>${t("p2iScale")} <span class="range-val" id="p2iScale_val">2</span>×</label>
          <input type="range" min="1" max="3" step="0.5" value="2" data-opt="scale" id="p2iScale"></div>
        <div class="opt-row"><label>${t("p2iMode")}</label>
          <div class="seg" data-opt="mode"><input type="hidden" value="zip">
            <button type="button" data-val="zip" class="on">${t("p2iZip")}</button>
            <button type="button" data-val="each">${t("p2iEach")}</button></div></div>`,
      run: async (files, get, prog) => {
        pdfjsLib.GlobalWorkerOptions.workerSrc = "vendor/pdf.worker.min.js";
        prog(4, t("progOcrEngine"));
        const bytes = await readBytes(files[0]);
        const doc = await pdfjsLib.getDocument({ data: bytes.slice(0) }).promise;
        const fmt = get("fmt") || "png";
        const qual = Math.max(0.4, Math.min(1, parseFloat(get("qual")) || 0.92));
        const scale = +get("scale") || 2;
        const mode = get("mode") || "zip";
        const pages = [];
        for (let i = 1; i <= doc.numPages; i++) {
          prog(6 + Math.round((i / doc.numPages) * 86), t("progRenderPage", i, doc.numPages));
          const page = await doc.getPage(i);
          const vp = page.getViewport({ scale });
          const canvas = document.createElement("canvas");
          canvas.width = Math.ceil(vp.width); canvas.height = Math.ceil(vp.height);
          await page.render({ canvasContext: canvas.getContext("2d"), viewport: vp }).promise;
          let mime, ext, dataUrl;
          if (fmt === "jpeg") { mime = "image/jpeg"; ext = "jpg"; dataUrl = canvas.toDataURL("image/jpeg", qual); }
          else if (fmt === "webp") { mime = "image/webp"; ext = "webp"; dataUrl = canvas.toDataURL("image/webp", qual); }
          else { mime = "image/png"; ext = "png"; dataUrl = canvas.toDataURL("image/png"); }
          const bin = atob(dataUrl.split(",")[1]);
          const arr = new Uint8Array(bin.length);
          for (let j = 0; j < bin.length; j++) arr[j] = bin.charCodeAt(j);
          pages.push({ name: "page-" + String(i).padStart(3, "0") + "." + ext, bytes: arr, mime });
        }
        if (mode === "each") return { downloads: pages, info: t("p2iDone", pages.length) };
        const zip = makeZip(pages);
        return { downloads: [{ name: "pdf_images.zip", bytes: zip, mime: "application/zip" }], info: t("p2iZipDone", pages.length) };
      }
    },
    {
      id: "extract", icon: "text", accept: "application/pdf", multiple: false,
      opts: () => `
        <div class="opt-row"><label>${t("exNote")}</label>
          <div style="color:var(--muted);font-size:13.5px">${t("exNoteDesc")}</div></div>`,
      run: async (files, get, prog) => {
        pdfjsLib.GlobalWorkerOptions.workerSrc = "vendor/pdf.worker.min.js";
        prog(4, t("progOcrEngine"));
        const bytes = await readBytes(files[0]);
        const doc = await pdfjsLib.getDocument({ data: bytes.slice(0) }).promise;
        let text = "";
        for (let i = 1; i <= doc.numPages; i++) {
          prog(6 + Math.round((i / doc.numPages) * 86), t("progExtractPage", i, doc.numPages));
          const page = await doc.getPage(i);
          const content = await page.getTextContent();
          const lines = content.items.map((it) => it.str).join(" ");
          text += "— " + t("t_extract_name") + " " + i + " —\n" + lines + "\n\n";
        }
        const enc = new TextEncoder().encode(text);
        const preview = text.trim().length ? text.trim() : t("exEmpty");
        return { downloads: [{ name: "extracted.txt", bytes: enc, mime: "text/plain" }], info: t("exDone"), preview };
      }
    },
    {
      id: "encrypt", icon: "lock", accept: "application/pdf", multiple: false,
      opts: () => `
        <div class="opt-row"><label>${t("encUser")}</label><input class="field" type="password" data-opt="user" placeholder="${t("encUserPh")}"></div>
        <div class="opt-row"><label>${t("encOwner")}</label><input class="field" type="password" data-opt="owner" placeholder="${t("encOwnerPh")}"></div>
        <div class="opt-row"><label>${t("encPerm")}</label>
          <div class="checks">
            <label class="ck"><input type="checkbox" data-perm="printing" checked> ${t("encPPrint")}</label>
            <label class="ck"><input type="checkbox" data-perm="modifying" checked> ${t("encPMod")}</label>
            <label class="ck"><input type="checkbox" data-perm="copying" checked> ${t("encPCopy")}</label>
            <label class="ck"><input type="checkbox" data-perm="annotating" checked> ${t("encPAnn")}</label>
          </div></div>
        <div class="opt-row"><label>${t("noteLabel")}</label>
          <div style="color:var(--muted);font-size:13.5px">${t("encNote")}</div></div>`,
      run: async (files, get, prog) => {
        prog(20, t("progRepackage"));
        const bytes = await readBytes(files[0]);
        const doc = await PDFLib.PDFDocument.load(bytes);
        const user = get("user") || "";
        const owner = get("owner") || "";
        if (!user && !owner) throw new Error(t("encNeedPwd"));
        const perms = {};
        panel.querySelectorAll("[data-perm]").forEach((cb) => { perms[cb.dataset.perm] = cb.checked; });
        const b = await doc.save({
          encrypt: { userPassword: user || undefined, ownerPassword: owner || undefined, permissions: perms }
        });
        return { downloads: [{ name: "encrypted.pdf", bytes: b, mime: "application/pdf" }], info: t("encDone") };
      }
    },
    {
      id: "decrypt", icon: "unlock", accept: "application/pdf", multiple: false,
      opts: () => `
        <div class="opt-row"><label>${t("decPwd")}</label><input class="field" type="password" data-opt="pwd" placeholder="${t("decPwdPh")}"></div>
        <div class="opt-row"><label>${t("noteLabel")}</label>
          <div style="color:var(--muted);font-size:13.5px">${t("decNote")}</div></div>`,
      run: async (files, get, prog) => {
        prog(20, t("progRepackage"));
        const bytes = await readBytes(files[0]);
        const pwd = get("pwd") || "";
        let doc;
        try { doc = await PDFLib.PDFDocument.load(bytes, { password: pwd }); }
        catch (e) { throw new Error(t("decWrongPwd")); }
        const b = await doc.save();
        return { downloads: [{ name: "decrypted.pdf", bytes: b, mime: "application/pdf" }], info: t("decDone") };
      }
    },
    {
      id: "password", icon: "key", noFile: true, accept: "", multiple: false,
      opts: () => `
        <div class="opt-row"><label>${t("pwLen")} <span class="range-val" id="pwLen_val">16</span></label>
          <input type="range" min="6" max="40" value="16" data-opt="len" id="pwLen"></div>
        <div class="opt-row"><label>${t("pwSets")}</label>
          <div class="checks">
            <label class="ck"><input type="checkbox" data-set="lower" checked> ${t("pwLower")}</label>
            <label class="ck"><input type="checkbox" data-set="upper" checked> ${t("pwUpper")}</label>
            <label class="ck"><input type="checkbox" data-set="number" checked> ${t("pwNumber")}</label>
            <label class="ck"><input type="checkbox" data-set="symbol" checked> ${t("pwSymbol")}</label>
          </div></div>
        <div class="opt-row"><label>${t("pwCount")}</label>
          <div class="seg" data-opt="count"><input type="hidden" value="1">
            <button type="button" data-val="1" class="on">1</button>
            <button type="button" data-val="5">5</button>
            <button type="button" data-val="10">10</button></div></div>`,
      run: async (files, get, prog) => {
        prog(40, t("pwGenerating"));
        const len = +get("len") || 16;
        const count = +(get("count") || 1);
        const sets = {};
        panel.querySelectorAll("[data-set]").forEach((cb) => { sets[cb.dataset.set] = cb.checked; });
        if (!sets.lower && !sets.upper && !sets.number && !sets.symbol) throw new Error(t("pwNeedSet"));
        const list = [];
        for (let i = 0; i < count; i++) list.push(genPassword(len, sets));
        const text = list.join("\n");
        const enc = new TextEncoder().encode(text);
        return { downloads: [{ name: "passwords.txt", bytes: enc, mime: "text/plain" }], info: t("pwDone", count), preview: text, copyText: text };
      }
    },
    {
      id: "seal", icon: "stamp", accept: "application/pdf", multiple: false,
      opts: () => `
        <div class="opt-row"><label>${t("sealUp")}</label>
          <div class="up-seal">
            <input type="file" id="sealInput" accept="image/png,image/jpeg" hidden>
            <button type="button" class="btn-ghost" id="sealPick">${ICONS.upload} ${t("sealPick")}</button>
            <span class="seal-name" id="sealName">${t("sealNone")}</span>
          </div></div>
        <div class="opt-row"><label>${t("sealEdge")}</label>
          <div class="seg" data-opt="edge"><input type="hidden" value="right">
            <button type="button" data-val="right" class="on">${t("sealRight")}</button>
            <button type="button" data-val="left">${t("sealLeft")}</button></div></div>
        <div class="opt-row"><label>${t("sealScale")} <span class="range-val" id="sealSc_val">45</span>%</label>
          <input type="range" min="20" max="80" value="45" data-opt="sc" id="sealSc"></div>
        <div class="opt-row"><label>${t("noteLabel")}</label>
          <div style="color:var(--muted);font-size:13.5px">${t("sealNote")}</div></div>`,
      run: async (files, get, prog) => {
        if (!sealFile) throw new Error(t("sealNeed"));
        prog(8, t("progReading"));
        const pdfBytes = await readBytes(files[0]);
        const doc = await PDFLib.PDFDocument.load(pdfBytes);
        const url = URL.createObjectURL(sealFile);
        const img = new Image(); img.src = url;
        await new Promise((res, rej) => { img.onload = res; img.onerror = rej; });
        const sw = img.naturalWidth, sh = img.naturalHeight;
        const N = doc.getPageCount();
        const edge = get("edge") || "right";
        const scPct = (+get("sc") || 45) / 100;
        for (let i = 0; i < N; i++) {
          prog(15 + Math.round((i / N) * 80), t("progSealPage", i + 1));
          const page = doc.getPages()[i];
          const { width: pw, height: ph } = page.getSize();
          const scale = (ph * 0.85 * scPct) / sh;
          const drawH = sh * scale;
          const stripW = Math.max(1, Math.round(sw / N));
          const c = document.createElement("canvas");
          c.width = stripW; c.height = sh;
          c.getContext("2d").drawImage(img, i * stripW, 0, stripW, sh, 0, 0, stripW, sh);
          const blob = await new Promise((r) => c.toBlob(r, "image/png"));
          const stripBytes = new Uint8Array(await blob.arrayBuffer());
          const emb = await doc.embedPng(stripBytes);
          const drawStripW = stripW * scale;
          const x = edge === "right" ? pw - drawStripW - 10 : 10;
          const y = (ph - drawH) / 2;
          page.drawImage(emb, { x, y, width: drawStripW, height: drawH });
        }
        URL.revokeObjectURL(url);
        const b = await doc.save();
        return { downloads: [{ name: "sealed.pdf", bytes: b, mime: "application/pdf" }], info: t("sealDone", N) };
      }
    },
    /* ---- 新增：新增空白页 ---- */
    {
      id: "blank", icon: "blank", accept: "application/pdf", multiple: false,
      opts: () => `
        <div class="opt-row"><label>${t("blankCount")}</label>
          <input class="field" type="number" min="1" max="50" data-opt="count" value="1" style="max-width:140px"></div>
        <div class="opt-row"><label>${t("blankPos")}</label>
          <div class="seg" data-opt="pos"><input type="hidden" value="end">
            <button type="button" data-val="end" class="on">${t("blankEnd")}</button>
            <button type="button" data-val="start">${t("blankStart")}</button>
            <button type="button" data-val="specific">${t("blankSpecific")}</button></div></div>
        <div class="opt-row"><label>${t("blankAt")}<span class="hint">${t("blankAtHint")}</span></label>
          <input class="field" type="number" min="0" max="999" data-opt="at" value="0" style="max-width:140px"></div>`,
      run: async (files, get, prog) => {
        const bytes = await readBytes(files[0]);
        const doc = await PDFLib.PDFDocument.load(bytes);
        const total = doc.getPageCount();
        const size = doc.getPage(0).getSize();
        const n = Math.max(1, Math.min(50, parseInt(get("count"), 10) || 1));
        const pos = get("pos") || "end";
        const at = Math.max(0, Math.min(total, parseInt(get("at"), 10) || 0));
        prog(45, t("progRepackage"));
        if (pos === "end") { for (let i = 0; i < n; i++) doc.addPage(size); }
        else if (pos === "start") { for (let i = 0; i < n; i++) doc.insertPage(0, size); }
        else { for (let i = 0; i < n; i++) doc.insertPage(at, size); }
        const b = await doc.save();
        return { downloads: [{ name: "blank-added.pdf", bytes: b, mime: "application/pdf" }], info: t("blankDone", n, doc.getPageCount()) };
      }
    },
    /* ---- 新增：提取页面 ---- */
    {
      id: "extractpages", icon: "extractpages", accept: "application/pdf", multiple: false,
      opts: () => `
        <div class="opt-row"><label>${t("epRange")}<span class="hint">${t("epHint")}</span></label>
          <input class="field" data-opt="range" placeholder="1,3,5-8"></div>`,
      run: async (files, get, prog) => {
        const bytes = await readBytes(files[0]);
        const doc = await PDFLib.PDFDocument.load(bytes);
        const total = doc.getPageCount();
        const sel = parseRange(get("range") || "", total);
        if (!sel.length) throw new Error(t("errEpEmpty", total));
        prog(40, t("progExtracting"));
        const out = await PDFLib.PDFDocument.create();
        const pages = await out.copyPages(doc, sel.map((p) => p - 1));
        pages.forEach((p) => out.addPage(p));
        const b = await out.save();
        return { downloads: [{ name: "extracted.pdf", bytes: b, mime: "application/pdf" }], info: t("epDone", sel.length) };
      }
    },
    /* ---- 新增：PDF 信息与元数据 ---- */
    {
      id: "info", icon: "info", accept: "application/pdf", multiple: false,
      opts: () => `
        <div class="opt-row"><label>${t("infoMetaTitle")}</label></div>
        <div class="opt-row"><label>${t("infoTitle")}</label><input class="field" data-opt="title" placeholder="${t("infoTitle")}"></div>
        <div class="opt-row"><label>${t("infoAuthor")}</label><input class="field" data-opt="author" placeholder="${t("infoAuthor")}"></div>
        <div class="opt-row"><label>${t("infoSubject")}</label><input class="field" data-opt="subject" placeholder="${t("infoSubject")}"></div>
        <div class="opt-row"><label>${t("infoKeywords")}</label><input class="field" data-opt="keywords" placeholder="${t("infoKeywords")}"></div>
        <div class="opt-row"><label>${t("infoWrite")}</label>
          <div class="seg" data-opt="write"><input type="hidden" value="no">
            <button type="button" data-val="no" class="on">${t("infoWriteNo")}</button>
            <button type="button" data-val="yes">${t("infoWriteYes")}</button></div></div>`,
      run: async (files, get, prog) => {
        const bytes = await readBytes(files[0]);
        const size0 = bytes.length;
        const doc = await PDFLib.PDFDocument.load(bytes);
        const total = doc.getPageCount();
        prog(50, t("progReading"));
        let meta = {};
        try { meta = (await doc.getMetadata()) || {}; } catch (e) { meta = {}; }
        const write = get("write") === "yes";
        const fT = (get("title") || "").trim(), fA = (get("author") || "").trim(),
              fS = (get("subject") || "").trim(), fK = (get("keywords") || "").trim();
        const downloads = [];
        if (write && (fT || fA || fS || fK)) {
          if (fT) doc.setTitle(fT); if (fA) doc.setAuthor(fA);
          if (fS) doc.setSubject(fS); if (fK) doc.setKeywords(fK);
          const b = await doc.save();
          downloads.push({ name: "with-metadata.pdf", bytes: b, mime: "application/pdf" });
        }
        const rows = [
          [t("infoPages"), total], [t("infoSize"), fmt(size0)],
          [t("infoTitle"), meta.Title || "—"], [t("infoAuthor"), meta.Author || "—"],
          [t("infoSubject"), meta.Subject || "—"], [t("infoKeywords"), meta.Keywords || "—"],
          [t("infoCreator"), meta.Creator || "—"], [t("infoProducer"), meta.Producer || "—"],
          [t("infoVersion"), meta.PDFVersion || "—"]
        ];
        const html = '<table class="info-table">' + rows.map((r) =>
          '<tr><th>' + escapeHtml(r[0]) + '</th><td>' + escapeHtml(String(r[1])) + '</td></tr>').join("") + '</table>';
        return { downloads, info: t("infoDone", total, fmt(size0)), previewHtml: html };
      }
    },
    /* ---- 新增：重排页面 ---- */
    {
      id: "reorder", icon: "reorder", accept: "application/pdf", multiple: false,
      opts: () => `
        <div class="opt-row"><label>${t("reorderOrder")}<span class="hint">${t("reorderHint")}</span></label>
          <input class="field" data-opt="order" placeholder="3,1,2,4"></div>`,
      run: async (files, get, prog) => {
        const bytes = await readBytes(files[0]);
        const doc = await PDFLib.PDFDocument.load(bytes);
        const total = doc.getPageCount();
        const raw = (get("order") || "").split(",").map((s) => parseInt(s.trim(), 10))
          .filter((n) => n >= 1 && n <= total);
        if (!raw.length) throw new Error(t("errOrderEmpty", total));
        prog(40, t("progExtracting"));
        const out = await PDFLib.PDFDocument.create();
        const pages = await out.copyPages(doc, raw.map((p) => p - 1));
        pages.forEach((p) => out.addPage(p));
        const b = await out.save();
        return { downloads: [{ name: "reordered.pdf", bytes: b, mime: "application/pdf" }], info: t("reorderDone", raw.length) };
      }
    },
    /* ---- 新增：按 N 页拆分 ---- */
    {
      id: "splitn", icon: "splitn", accept: "application/pdf", multiple: false,
      opts: () => `
        <div class="opt-row"><label>${t("splitnN")}</label>
          <input class="field" type="number" min="1" max="999" data-opt="n" value="1" style="max-width:140px"></div>`,
      run: async (files, get, prog) => {
        const bytes = await readBytes(files[0]);
        const doc = await PDFLib.PDFDocument.load(bytes);
        const total = doc.getPageCount();
        const n = Math.max(1, Math.min(total, parseInt(get("n"), 10) || 1));
        const downloads = [];
        let idx = 0;
        const chunks = Math.ceil(total / n);
        for (let s = 0; s < total; s += n) {
          prog(15 + Math.round((idx / chunks) * 75), t("progSplitPage", idx + 1));
          const e = Math.min(s + n, total);
          const out = await PDFLib.PDFDocument.create();
          const pages = await out.copyPages(doc, doc.getPageIndices().slice(s, e));
          pages.forEach((p) => out.addPage(p));
          const b = await out.save();
          downloads.push({ name: "part-" + String(idx + 1).padStart(2, "0") + ".pdf", bytes: b, mime: "application/pdf" });
          idx++;
        }
        return { downloads, info: t("splitnDone", n, downloads.length) };
      }
    },
    /* ---- 新增：优化 PDF ---- */
    {
      id: "optimize", icon: "optimize", accept: "application/pdf", multiple: false,
      opts: () => `
        <div class="opt-row"><label>${t("optCleanMeta")}</label>
          <div class="seg" data-opt="clean"><input type="hidden" value="no">
            <button type="button" data-val="no" class="on">${t("optNo")}</button>
            <button type="button" data-val="yes">${t("optYes")}</button></div></div>`,
      run: async (files, get, prog) => {
        const bytes = await readBytes(files[0]);
        const size0 = bytes.length;
        const doc = await PDFLib.PDFDocument.load(bytes);
        prog(55, t("progRepackage"));
        if (get("clean") === "yes") {
          doc.setTitle(""); doc.setAuthor(""); doc.setSubject(""); doc.setKeywords("");
          try { doc.setCreator(""); doc.setProducer(""); } catch (e) {}
        }
        const b = await doc.save({ useObjectStreams: true });
        const saved = Math.max(0, size0 - b.length);
        return { downloads: [{ name: "optimized.pdf", bytes: b, mime: "application/pdf" }], info: t("optDone", fmt(size0), fmt(b.length), fmt(saved)) };
      }
    },
    /* ---- 新增：插入页面（双文件） ---- */
    {
      id: "insert", icon: "insert",
      sources: [
        { role: "main", label: t("insMain"), accept: "application/pdf", multiple: false },
        { role: "src", label: t("insSrc"), accept: "application/pdf", multiple: false }
      ],
      opts: () => `
        <div class="opt-row"><label>${t("insPos")}</label>
          <div class="seg" data-opt="pos"><input type="hidden" value="end">
            <button type="button" data-val="end" class="on">${t("insEnd")}</button>
            <button type="button" data-val="start">${t("insStart")}</button>
            <button type="button" data-val="specific">${t("insSpecific")}</button></div></div>
        <div class="opt-row"><label>${t("insAt")}<span class="hint">${t("insAtHint")}</span></label>
          <input class="field" type="number" min="0" max="999" data-opt="at" value="0" style="max-width:140px"></div>`,
      run: async (src, get, prog) => {
        const mainBytes = await readBytes(src.main[0]);
        const srcBytes = await readBytes(src.src[0]);
        const doc = await PDFLib.PDFDocument.load(mainBytes);
        const insDoc = await PDFLib.PDFDocument.load(srcBytes);
        const total = doc.getPageCount();
        const insTotal = insDoc.getPageCount();
        const pos = get("pos") || "end";
        const at = Math.max(0, Math.min(total, parseInt(get("at"), 10) || 0));
        prog(45, t("progInsert"));
        const pages = await doc.copyPages(insDoc, insDoc.getPageIndices());
        if (pos === "end") {
          pages.forEach((p) => doc.addPage(p));
        } else {
          const idx = pos === "start" ? 0 : at;
          for (let i = pages.length - 1; i >= 0; i--) doc.insertPage(idx, pages[i]);
        }
        const b = await doc.save();
        return { downloads: [{ name: "inserted.pdf", bytes: b, mime: "application/pdf" }], info: t("insDone", insTotal, doc.getPageCount()) };
      }
    },
    /* ---- 新增：HTML 转 PDF（无文件，纯文本输入） ---- */
    {
      id: "html2pdf", icon: "html2pdf", noFile: true,
      opts: () => `
        <div class="opt-row col">
          <label>${t("htmlInputLabel")}</label>
          <textarea class="field html-area" data-opt="html" rows="9" placeholder="${t("htmlInputHint")}">${t("htmlSample")}</textarea>
        </div>
        <div class="opt-row"><label>${t("htmlSize")}</label>
          <div class="seg" data-opt="size"><input type="hidden" value="a4">
            <button type="button" data-val="a4" class="on">A4</button>
            <button type="button" data-val="letter">Letter</button></div></div>
        <div class="opt-row"><label>${t("htmlOrient")}</label>
          <div class="seg" data-opt="orient"><input type="hidden" value="portrait">
            <button type="button" data-val="portrait" class="on">${t("orientP")}</button>
            <button type="button" data-val="landscape">${t("orientL")}</button></div></div>`,
      run: async (files, get, prog) => {
        await ensureExt();
        const html = (get("html") || "").trim();
        if (!html) throw new Error(t("htmlEmpty"));
        const size = get("size") === "letter" ? "letter" : "a4";
        const orient = get("orient") === "landscape" ? "landscape" : "portrait";
        prog(12, t("progRender"));
        const { jsPDF } = window.jspdf;
        const probe = new jsPDF({ orientation: orient, unit: "pt", format: size });
        const pageWpt = probe.internal.pageSize.getWidth();
        const pageHpt = probe.internal.pageSize.getHeight();
        const hostW = Math.round(pageWpt * 96 / 72);
        const host = document.createElement("div");
        host.className = "html2pdf-host";
        host.style.width = hostW + "px";
        host.innerHTML = html;
        document.body.appendChild(host);
        try {
          const canvas = await window.html2canvas(host, { backgroundColor: "#ffffff", scale: 2, logging: false, useCORS: true, windowWidth: hostW });
          prog(60, t("progBuild"));
          const pdf = new jsPDF({ orientation: orient, unit: "pt", format: size });
          const imgW = pageWpt;
          const imgH = canvas.height * imgW / canvas.width;
          const imgData = canvas.toDataURL("image/jpeg", 0.92);
          let heightLeft = imgH;
          let position = 0;
          pdf.addImage(imgData, "JPEG", 0, position, imgW, imgH);
          heightLeft -= pageHpt;
          while (heightLeft > 0) {
            position -= pageHpt;
            pdf.addPage();
            pdf.addImage(imgData, "JPEG", 0, position, imgW, imgH);
            heightLeft -= pageHpt;
          }
          const out = pdf.output("arraybuffer");
          const bytes = new Uint8Array(out);
          return { downloads: [{ name: "converted.pdf", bytes, mime: "application/pdf" }], info: t("htmlDone", fmt(bytes.length)) };
        } finally {
          if (host.parentNode) host.parentNode.removeChild(host);
        }
      }
    },
    /* ---- 新增：裁剪页面 ---- */
    {
      id: "crop", icon: "crop", accept: "application/pdf", multiple: false,
      opts: () => `
        <div class="opt-row"><label>${t("cropMargin")}</label>
          <div class="opt-cols">
            <input class="field" type="number" min="0" data-opt="ct" value="10" title="${t("cropTop")}">
            <input class="field" type="number" min="0" data-opt="cr" value="10" title="${t("cropRight")}">
            <input class="field" type="number" min="0" data-opt="cb" value="10" title="${t("cropBottom")}">
            <input class="field" type="number" min="0" data-opt="cl" value="10" title="${t("cropLeft")}">
          </div>
        </div>`,
      run: async (files, get, prog) => {
        const bytes = await readBytes(files[0]);
        const doc = await PDFLib.PDFDocument.load(bytes);
        const k = 2.8346456693;
        const mt = Math.max(0, parseFloat(get("ct")) || 0) * k;
        const mr = Math.max(0, parseFloat(get("cr")) || 0) * k;
        const mb = Math.max(0, parseFloat(get("cb")) || 0) * k;
        const ml = Math.max(0, parseFloat(get("cl")) || 0) * k;
        prog(40, t("progRepackage"));
        doc.getPages().forEach((p) => {
          const w = p.getWidth(), h = p.getHeight();
          p.setCropBox(ml, mb, Math.max(1, w - ml - mr), Math.max(1, h - mt - mb));
        });
        const b = await doc.save();
        return { downloads: [{ name: "cropped.pdf", bytes: b, mime: "application/pdf" }], info: t("cropDone", doc.getPageCount()) };
      }
    },
    /* ---- 新增：调整页面尺寸 ---- */
    {
      id: "resize", icon: "resize", accept: "application/pdf", multiple: false,
      opts: () => `
        <div class="opt-row"><label>${t("rsSize")}</label>
          <div class="seg" data-opt="size"><input type="hidden" value="a4">
            <button type="button" data-val="a4" class="on">A4</button>
            <button type="button" data-val="a3">A3</button>
            <button type="button" data-val="a5">A5</button>
            <button type="button" data-val="letter">Letter</button></div></div>
        <div class="opt-row"><label>${t("rsFit")}</label>
          <div class="seg" data-opt="fit"><input type="hidden" value="fit">
            <button type="button" data-val="fit" class="on">${t("rsFitFit")}</button>
            <button type="button" data-val="stretch">${t("rsFitStretch")}</button>
            <button type="button" data-val="center">${t("rsFitCenter")}</button></div></div>`,
      run: async (files, get, prog) => {
        const bytes = await readBytes(files[0]);
        const doc = await PDFLib.PDFDocument.load(bytes);
        const size = get("size") || "a4";
        const fitMode = get("fit") || "fit";
        const dims = { a4: [595.28, 841.89], a3: [841.89, 1190.55], a5: [419.53, 595.28], letter: [612, 792] }[size] || [595.28, 841.89];
        const [TW, TH] = dims;
        const srcPages = doc.getPages();
        const out = await PDFLib.PDFDocument.create();
        prog(35, t("progRepackage"));
        for (let i = 0; i < srcPages.length; i++) {
          const sp = srcPages[i];
          const cw = sp.getWidth(), ch = sp.getHeight();
          const emb = await out.embedPage(sp);
          const np = out.addPage([TW, TH]);
          let dw, dh;
          if (fitMode === "stretch") { dw = TW; dh = TH; }
          else if (fitMode === "center") { dw = cw; dh = ch; }
          else { const s = Math.min(TW / cw, TH / ch) * 0.96; dw = cw * s; dh = ch * s; }
          const x = (TW - dw) / 2, y = (TH - dh) / 2;
          np.drawPage(emb, { x, y, width: dw, height: dh });
        }
        const b = await out.save();
        const name = { a4: "A4", a3: "A3", a5: "A5", letter: "Letter" }[size];
        return { downloads: [{ name: "resized.pdf", bytes: b, mime: "application/pdf" }], info: t("rsDone", srcPages.length, name) };
      }
    },
    /* ---- 新增：页眉页脚 ---- */
    {
      id: "headerfooter", icon: "headerfooter", accept: "application/pdf", multiple: false,
      opts: () => `
        <div class="opt-row col"><label>${t("hfHeader")}</label><input class="field" type="text" data-opt="header" placeholder=""></div>
        <div class="opt-row col"><label>${t("hfFooter")}</label><input class="field" type="text" data-opt="footer"></div>
        <div class="opt-row"><label>${t("hfPageNum")}</label>
          <div class="seg" data-opt="pagenum"><input type="hidden" value="yes">
            <button type="button" data-val="yes" class="on">${t("hfYes")}</button>
            <button type="button" data-val="no">${t("hfNo")}</button></div></div>
        <div class="opt-row"><label>${t("hfSize")}</label>
          <input class="field" type="number" min="6" max="24" data-opt="size" value="11" style="max-width:90px"></div>`,
      run: async (files, get, prog) => {
        const bytes = await readBytes(files[0]);
        const doc = await PDFLib.PDFDocument.load(bytes);
        const header = (get("header") || "").trim();
        const footer = (get("footer") || "").trim();
        const withNum = get("pagenum") === "yes";
        const size = Math.max(6, Math.min(24, parseInt(get("size"), 10) || 11));
        const font = await doc.embedFont(PDFLib.StandardFonts.Helvetica);
        const pages = doc.getPages();
        const total = pages.length;
        const m = 36;
        prog(40, t("progRepackage"));
        pages.forEach((p, i) => {
          const W = p.getWidth(), H = p.getHeight();
          const num = (j) => withNum ? "   " + j + " / " + total : "";
          if (header) p.drawText(header + num(i + 1), { x: m, y: H - m - size, size, font });
          if (footer) p.drawText(footer + num(i + 1), { x: m, y: m, size, font });
        });
        const b = await doc.save();
        return { downloads: [{ name: "headerfooter.pdf", bytes: b, mime: "application/pdf" }], info: t("hfDone", total) };
      }
    },
    /* ---- 新增：编辑元数据 ---- */
    {
      id: "metadata", icon: "metadata", accept: "application/pdf", multiple: false,
      opts: () => `
        <div class="opt-row col"><label>${t("mdTitle")}</label><input class="field" type="text" data-opt="title"></div>
        <div class="opt-row col"><label>${t("mdAuthor")}</label><input class="field" type="text" data-opt="author"></div>
        <div class="opt-row col"><label>${t("mdSubject")}</label><input class="field" type="text" data-opt="subject"></div>
        <div class="opt-row col"><label>${t("mdKeywords")}</label><input class="field" type="text" data-opt="keywords" placeholder="PDF, 工具"></div>`,
      run: async (files, get, prog) => {
        const bytes = await readBytes(files[0]);
        const doc = await PDFLib.PDFDocument.load(bytes);
        const title = (get("title") || "").trim();
        const author = (get("author") || "").trim();
        const subject = (get("subject") || "").trim();
        const kw = (get("keywords") || "").trim();
        if (title) doc.setTitle(title);
        if (author) doc.setAuthor(author);
        if (subject) doc.setSubject(subject);
        if (kw) doc.setKeywords(kw.split(/[,，]/).map((s) => s.trim()).filter(Boolean));
        prog(60, t("progRepackage"));
        const b = await doc.save();
        return { downloads: [{ name: "metadata.pdf", bytes: b, mime: "application/pdf" }], info: t("mdDone") };
      }
    },
    /* ---- 新增：复制页面 ---- */
    {
      id: "duplicate", icon: "duplicate", accept: "application/pdf", multiple: false,
      opts: () => `
        <div class="opt-row col"><label>${t("dupRange")}</label><input class="field" type="text" data-opt="range" placeholder="1,3 或 2-4"></div>
        <div class="opt-row"><label>${t("dupCopies")}</label><input class="field" type="number" min="1" max="50" data-opt="copies" value="1" style="max-width:90px"></div>`,
      run: async (files, get, prog) => {
        const bytes = await readBytes(files[0]);
        const doc = await PDFLib.PDFDocument.load(bytes);
        const total = doc.getPageCount();
        const sel = parseRange(get("range"), total);
        if (!sel.length) throw new Error(t("dupEmpty"));
        const copies = Math.max(1, Math.min(50, parseInt(get("copies"), 10) || 1));
        const selSet = new Set(sel);
        const order = [];
        for (let i = 1; i <= total; i++) { order.push(i - 1); if (selSet.has(i)) for (let c = 0; c < copies; c++) order.push(i - 1); }
        const out = await PDFLib.PDFDocument.create();
        const cp = await out.copyPages(doc, order);
        cp.forEach((p) => out.addPage(p));
        prog(70, t("progRepackage"));
        const b = await out.save();
        return { downloads: [{ name: "duplicated.pdf", bytes: b, mime: "application/pdf" }], info: t("dupDone", out.getPageCount()) };
      }
    },
    /* ---- 新增：添加图片/签名（双文件） ---- */
    {
      id: "sign", icon: "sign",
      sources: [
        { role: "main", label: t("insMain"), accept: "application/pdf", multiple: false },
        { role: "img", label: t("t_sign_name"), accept: "image/png,image/jpeg", multiple: false }
      ],
      opts: () => `
        <div class="opt-row"><label>${t("sigPos")}</label>
          <div class="pos-grid" data-opt="pos"><input type="hidden" value="br">
            <button type="button" data-val="tl"></button><button type="button" data-val="tc"></button><button type="button" data-val="tr"></button>
            <button type="button" data-val="ml"></button><button type="button" data-val="mc"></button><button type="button" data-val="mr"></button>
            <button type="button" data-val="bl"></button><button type="button" data-val="bc"></button><button type="button" data-val="br" class="on"></button>
          </div></div>
        <div class="opt-row"><label>${t("sigScale")}</label><input class="field" type="number" min="2" max="100" data-opt="scale" value="20" style="max-width:90px"></div>
        <div class="opt-row"><label>${t("sigPages")}</label>
          <div class="seg" data-opt="scope"><input type="hidden" value="all">
            <button type="button" data-val="all" class="on">${t("sigAll")}</button>
            <button type="button" data-val="first">${t("sigFirst")}</button>
            <button type="button" data-val="last">${t("sigLast")}</button></div></div>`,
      run: async (src, get, prog) => {
        const pdfBytes = await readBytes(src.main[0]);
        const imgBytes = await readBytes(src.img[0]);
        const doc = await PDFLib.PDFDocument.load(pdfBytes);
        const name = (src.img[0].name || "").toLowerCase();
        const img = name.endsWith(".jpg") || name.endsWith(".jpeg") ? await doc.embedJpg(imgBytes) : await doc.embedPng(imgBytes);
        const pos = get("pos") || "br";
        const pct = Math.max(2, Math.min(100, parseFloat(get("scale")) || 20));
        const scope = get("scope") || "all";
        const pages = doc.getPages();
        const total = pages.length;
        let targets;
        if (scope === "first") targets = [0];
        else if (scope === "last") targets = [total - 1];
        else targets = pages.map((_, i) => i);
        const ar = img.width / img.height;
        prog(45, t("progRepackage"));
        targets.forEach((ti) => {
          const p = pages[ti];
          const W = p.getWidth(), H = p.getHeight();
          const w = Math.min(W, H) * (pct / 100);
          const h = w / ar;
          const m = 28;
          const col = pos[1], row = pos[0];
          let x = m, y = m;
          if (col === "c") x = (W - w) / 2; else if (col === "r") x = W - w - m;
          if (row === "t") y = H - h - m; else if (row === "m") y = (H - h) / 2;
          p.drawImage(img, { x, y, width: w, height: h });
        });
        const b = await doc.save();
        return { downloads: [{ name: "signed.pdf", bytes: b, mime: "application/pdf" }], info: t("sigDone", targets.length) };
      }
    },
    /* ---- 新增：倒序排列 ---- */
    {
      id: "reverse", icon: "reverse", accept: "application/pdf", multiple: false,
      opts: () => "",
      run: async (files, get, prog) => {
        const bytes = await readBytes(files[0]);
        const doc = await PDFLib.PDFDocument.load(bytes);
        const total = doc.getPageCount();
        const order = [];
        for (let i = total; i >= 1; i--) order.push(i - 1);
        const out = await PDFLib.PDFDocument.create();
        const cp = await out.copyPages(doc, order);
        cp.forEach((p) => out.addPage(p));
        prog(70, t("progRepackage"));
        const b = await out.save();
        return { downloads: [{ name: "reversed.pdf", bytes: b, mime: "application/pdf" }], info: t("revDone", out.getPageCount()) };
      }
    },
    {
      id: "grayscale", icon: "grayscale", accept: "application/pdf", multiple: false,
      opts: () => `
        <div class="opt-row"><label>${t("grayScale")} <span class="range-val" id="gScale_val">2</span>×</label>
          <input type="range" min="1" max="3" step="0.5" value="2" data-opt="scale" id="gScale"></div>`,
      run: async (files, get, prog) => {
        await ensureExt();
        pdfjsLib.GlobalWorkerOptions.workerSrc = "vendor/pdf.worker.min.js";
        prog(4, t("progOcrEngine"));
        const bytes = await readBytes(files[0]);
        const doc = await pdfjsLib.getDocument({ data: bytes.slice(0) }).promise;
        const { jsPDF } = window.jspdf;
        const scale = +get("scale") || 2;
        let pdf = null;
        for (let i = 1; i <= doc.numPages; i++) {
          prog(6 + Math.round((i / doc.numPages) * 88), t("progRenderPage", i, doc.numPages));
          const page = await doc.getPage(i);
          const vp0 = page.getViewport({ scale: 1 });
          const wpt = vp0.width, hpt = vp0.height;
          const vp = page.getViewport({ scale });
          const canvas = document.createElement("canvas");
          canvas.width = Math.ceil(vp.width); canvas.height = Math.ceil(vp.height);
          await page.render({ canvasContext: canvas.getContext("2d"), viewport: vp }).promise;
          const g = document.createElement("canvas");
          g.width = canvas.width; g.height = canvas.height;
          const gctx = g.getContext("2d");
          gctx.filter = "grayscale(1)";
          gctx.drawImage(canvas, 0, 0);
          const imgData = g.toDataURL("image/jpeg", 0.92);
          if (!pdf) pdf = new jsPDF({ unit: "pt", format: [wpt, hpt] });
          else pdf.addPage([wpt, hpt]);
          pdf.addImage(imgData, "JPEG", 0, 0, wpt, hpt);
        }
        const out = pdf.output("arraybuffer");
        const b = new Uint8Array(out);
        return { downloads: [{ name: "grayscale.pdf", bytes: b, mime: "application/pdf" }], info: t("grayDone", doc.numPages) };
      }
    },
    {
      id: "pdf2word", icon: "pdf2word", accept: "application/pdf", multiple: false,
      opts: () => `
        <div class="opt-row"><label>${t("wordPageNum")}</label>
          <div class="seg" data-opt="pagenum"><input type="hidden" value="yes">
            <button type="button" data-val="yes" class="on">${t("wordYes")}</button>
            <button type="button" data-val="no">${t("wordNo")}</button></div></div>
        <div class="opt-row"><label>${t("wordPageBreak")}</label>
          <div class="seg" data-opt="break"><input type="hidden" value="yes">
            <button type="button" data-val="yes" class="on">${t("wordYes")}</button>
            <button type="button" data-val="no">${t("wordNo")}</button></div></div>
        <div class="opt-row"><label style="color:var(--muted);font-size:13px">${t("wordNote")}</label></div>`,
      run: async (files, get, prog) => {
        pdfjsLib.GlobalWorkerOptions.workerSrc = "vendor/pdf.worker.min.js";
        prog(4, t("progOcrEngine"));
        const bytes = await readBytes(files[0]);
        const doc = await pdfjsLib.getDocument({ data: bytes.slice(0) }).promise;
        const withNum = get("pagenum") !== "no";
        const doBreak = get("break") !== "no";
        const pageTexts = [];
        for (let i = 1; i <= doc.numPages; i++) {
          prog(6 + Math.round((i / doc.numPages) * 86), t("progRenderPage", i, doc.numPages));
          const page = await doc.getPage(i);
          const content = await page.getTextContent();
          let lastY = null, line = "", lines = [];
          content.items.forEach((it) => {
            const y = it.transform ? it.transform[5] : null;
            if (lastY !== null && y !== null && Math.abs(y - lastY) > 2) { lines.push(line); line = ""; }
            line += (it.str || "");
            if (y !== null) lastY = y;
          });
          if (line) lines.push(line);
          let txt = lines.join("\n");
          if (withNum) txt = "[" + t("t_word_name") + " · " + i + "]\n" + txt;
          pageTexts.push(txt);
        }
        const xml = buildDocx(pageTexts, doBreak);
        const zip = makeZip(xml.files);
        return { downloads: [{ name: "document.docx", bytes: zip, mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }], info: t("wordDone", doc.numPages) };
      }
    },
    {
      id: "extractimg", icon: "extract", accept: "application/pdf", multiple: false,
      opts: () => `
        <div class="opt-row"><label>${t("extScale")} <span class="range-val" id="eScale_val">2</span>×</label>
          <input type="range" min="1" max="3" step="0.5" value="2" data-opt="scale" id="eScale"></div>
        <div class="opt-row"><label style="color:var(--muted);font-size:13px">${t("extNote")}</label></div>`,
      run: async (files, get, prog) => {
        pdfjsLib.GlobalWorkerOptions.workerSrc = "vendor/pdf.worker.min.js";
        prog(4, t("progOcrEngine"));
        const bytes = await readBytes(files[0]);
        const doc = await pdfjsLib.getDocument({ data: bytes.slice(0) }).promise;
        const OPS = pdfjsLib.OPS;
        const scale = +get("scale") || 2;
        const seen = new Set();
        const out = [];
        for (let p = 1; p <= doc.numPages; p++) {
          prog(6 + Math.round((p / doc.numPages) * 86), t("progRenderPage", p, doc.numPages));
          const page = await doc.getPage(p);
          let opList;
          try { opList = await page.getOperatorList(); } catch (e) { continue; }
          for (let i = 0; i < opList.fnArray.length; i++) {
            if (opList.fnArray[i] !== OPS.paintImageXObject) continue;
            const imgId = opList.argsArray[i][0];
            let img;
            try { img = await getObjSafe(page, imgId); } catch (e) { continue; }
            if (!img || !img.data || !img.width) continue;
            const key = fnv1a(img.data);
            if (seen.has(key)) continue; seen.add(key);
            out.push({ name: "image-" + String(out.length + 1).padStart(3, "0") + ".png", bytes: imageDataToPng(img.data, img.width, img.height) });
          }
        }
        if (!out.length) return { downloads: [], info: t("extNone") };
        const zip = makeZip(out);
        return { downloads: [{ name: "pdf_images.zip", bytes: zip, mime: "application/zip" }], info: t("extDone", out.length) };
      }
    },
    {
      id: "pdf2ppt", icon: "ppt", accept: "application/pdf", multiple: false,
      opts: () => `
        <div class="opt-row"><label>${t("pptQuality")} <span class="range-val" id="pScale_val">2</span>×</label>
          <input type="range" min="1" max="3" step="0.5" value="2" data-opt="scale" id="pScale"></div>
        <div class="opt-row"><label style="color:var(--muted);font-size:13px">${t("pptNote")}</label></div>`,
      run: async (files, get, prog) => {
        pdfjsLib.GlobalWorkerOptions.workerSrc = "vendor/pdf.worker.min.js";
        prog(4, t("progOcrEngine"));
        const bytes = await readBytes(files[0]);
        const doc = await pdfjsLib.getDocument({ data: bytes.slice(0) }).promise;
        const scale = +get("scale") || 2;
        const slides = [];
        for (let i = 1; i <= doc.numPages; i++) {
          prog(6 + Math.round((i / doc.numPages) * 88), t("progRenderPage", i, doc.numPages));
          const page = await doc.getPage(i);
          const vp = page.getViewport({ scale });
          const canvas = document.createElement("canvas");
          canvas.width = Math.ceil(vp.width); canvas.height = Math.ceil(vp.height);
          await page.render({ canvasContext: canvas.getContext("2d"), viewport: vp }).promise;
          const blob = await new Promise((res) => canvas.toBlob(res, "image/png"));
          const png = new Uint8Array(await blob.arrayBuffer());
          slides.push({ bytes: png, w: canvas.width, h: canvas.height });
        }
        const zip = buildPptx(slides);
        return { downloads: [{ name: "presentation.pptx", bytes: zip, mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation" }], info: t("pptDone", doc.numPages) };
      }
    },
    {
      id: "pdf2excel", icon: "xlsx", accept: "application/pdf", multiple: false,
      opts: () => `
        <div class="opt-row"><label style="color:var(--muted);font-size:13px">${t("xlsxNote")}</label></div>`,
      run: async (files, get, prog) => {
        pdfjsLib.GlobalWorkerOptions.workerSrc = "vendor/pdf.worker.min.js";
        prog(4, t("progOcrEngine"));
        const bytes = await readBytes(files[0]);
        const doc = await pdfjsLib.getDocument({ data: bytes.slice(0) }).promise;
        const grid = [];
        let anyText = false;
        for (let i = 1; i <= doc.numPages; i++) {
          prog(6 + Math.round((i / doc.numPages) * 88), t("progRenderPage", i, doc.numPages));
          const page = await doc.getPage(i);
          const vp = page.getViewport({ scale: 1 });
          const content = await page.getTextContent();
          const g = extractGrid(content, vp.height);
          if (g.length) { anyText = true; grid.push([t("t_pdf2excel_name") + " · " + i]); g.forEach((r) => grid.push(r)); grid.push([]); }
        }
        if (!anyText) return { downloads: [], info: t("xlsxNone") };
        const zip = buildXlsx(grid);
        return { downloads: [{ name: "spreadsheet.xlsx", bytes: zip, mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }], info: t("xlsxDone", doc.numPages, grid.length) };
      }
    },
    {
      id: "rmblank", icon: "rmblank", accept: "application/pdf", multiple: false,
      opts: () => `
        <div class="opt-row"><label>${t("rmblankMode")}</label>
          <div class="seg" data-opt="rmblankMode"><input type="hidden" value="strict">
            <button type="button" data-val="strict" class="on">${t("rmblankStrict")}</button>
            <button type="button" data-val="loose">${t("rmblankLoose")}</button></div></div>`,
      run: async (files, get, prog) => {
        pdfjsLib.GlobalWorkerOptions.workerSrc = "vendor/pdf.worker.min.js";
        prog(4, t("progOcrEngine"));
        const bytes = await readBytes(files[0]);
        const doc = await pdfjsLib.getDocument({ data: bytes.slice(0) }).promise;
        const thresh = (get("rmblankMode") === "loose") ? 0.06 : 0.012;
        const keep = [];
        for (let i = 1; i <= doc.numPages; i++) {
          prog(6 + Math.round((i / doc.numPages) * 80), t("progRenderPage", i, doc.numPages));
          const page = await doc.getPage(i);
          const vp = page.getViewport({ scale: 0.5 });
          const cv = document.createElement("canvas");
          cv.width = Math.max(1, Math.ceil(vp.width)); cv.height = Math.max(1, Math.ceil(vp.height));
          const ctx = cv.getContext("2d");
          await page.render({ canvasContext: ctx, viewport: vp }).promise;
          const d = ctx.getImageData(0, 0, cv.width, cv.height).data;
          let non = 0; const samples = d.length / 16;
          for (let p = 0; p < d.length; p += 16) {
            if (!(d[p] > 248 && d[p + 1] > 248 && d[p + 2] > 248)) non++;
          }
          if (non / samples >= thresh) keep.push(i - 1);
        }
        if (!keep.length) return { downloads: [], info: t("rmblankNone") };
        const src = await PDFLib.PDFDocument.load(bytes);
        const out = await PDFLib.PDFDocument.create();
        const ps = await out.copyPages(src, keep);
        ps.forEach((p) => out.addPage(p));
        const b = await out.save();
        return { downloads: [{ name: "no-blank.pdf", bytes: b, mime: "application/pdf" }], info: t("rmblankDone", doc.numPages - keep.length, keep.length) };
      }
    },
    {
      id: "pdf2long", icon: "pdf2long", accept: "application/pdf", multiple: false,
      opts: () => `
        <div class="opt-row"><label>${t("longScale")} <span class="range-val" id="longScale_val">2</span>×</label>
          <input type="range" min="1" max="3" step="0.5" value="2" data-opt="scale" id="longScale"></div>
        <div class="opt-row"><label style="color:var(--muted);font-size:13px">${t("longNote")}</label></div>`,
      run: async (files, get, prog) => {
        pdfjsLib.GlobalWorkerOptions.workerSrc = "vendor/pdf.worker.min.js";
        prog(4, t("progOcrEngine"));
        const bytes = await readBytes(files[0]);
        const doc = await pdfjsLib.getDocument({ data: bytes.slice(0) }).promise;
        const scale = +get("scale") || 2;
        const cvs = []; let totalH = 0, maxW = 0;
        for (let i = 1; i <= doc.numPages; i++) {
          prog(6 + Math.round((i / doc.numPages) * 85), t("progRenderPage", i, doc.numPages));
          const page = await doc.getPage(i);
          const vp = page.getViewport({ scale });
          const c = document.createElement("canvas");
          c.width = Math.ceil(vp.width); c.height = Math.ceil(vp.height);
          await page.render({ canvasContext: c.getContext("2d"), viewport: vp }).promise;
          cvs.push(c); totalH += c.height; maxW = Math.max(maxW, c.width);
        }
        const MAXH = 16000; let fs = 1;
        if (totalH > MAXH) fs = MAXH / totalH;
        const ow = Math.floor(maxW * fs), oh = Math.floor(totalH * fs);
        const big = document.createElement("canvas");
        big.width = ow; big.height = oh;
        const bx = big.getContext("2d");
        bx.fillStyle = "#fff"; bx.fillRect(0, 0, ow, oh);
        let y = 0;
        for (const c of cvs) {
          const w = Math.floor(c.width * fs), h = Math.floor(c.height * fs);
          bx.drawImage(c, Math.floor((ow - w) / 2), y, w, h);
          y += h;
        }
        const blob = await new Promise((res) => big.toBlob(res, "image/png"));
        const b = new Uint8Array(await blob.arrayBuffer());
        return { downloads: [{ name: "long-image.png", bytes: b, mime: "image/png" }], info: t("longDone", doc.numPages, fmt(b.length)) + (fs < 1 ? " " + t("longWarn") : "") };
      }
    },
    {
      id: "links", icon: "links", accept: "application/pdf", multiple: false,
      opts: () => `
        <div class="opt-row"><label style="color:var(--muted);font-size:13px">${t("linksNote")}</label></div>`,
      run: async (files, get, prog) => {
        prog(10, t("progReading"));
        const bytes = await readBytes(files[0]);
        const doc = await PDFLib.PDFDocument.load(bytes, { ignoreEncryption: true });
        const ctx = doc.context;
        const found = [];
        const pages = doc.getPages();
        for (let i = 0; i < pages.length; i++) {
          prog(10 + Math.round((i / pages.length) * 85), t("progExtracting") + " " + (i + 1) + "/" + pages.length);
          const annots = pages[i].node.lookupMaybe(PDFLib.PDFName.of("Annots"), PDFLib.PDFArray);
          if (!annots) continue;
          for (const a of annots.asArray()) {
            const dict = ctx.lookup(a);
            if (!dict) continue;
            const sub = dict.lookupMaybe(PDFLib.PDFName.of("Subtype"), PDFLib.PDFName);
            if (!sub || sub !== PDFLib.PDFName.of("Link")) continue;
            let url = null, kind = "uri";
            const A = dict.lookupMaybe(PDFLib.PDFName.of("A"), PDFLib.PDFDict);
            if (A) {
              const S = A.lookupMaybe(PDFLib.PDFName.of("S"), PDFLib.PDFName);
              if (S === PDFLib.PDFName.of("URI")) {
                const U = A.lookupMaybe(PDFLib.PDFName.of("URI"), PDFLib.PDFString);
                if (U) url = U.decode();
              } else if (S === PDFLib.PDFName.of("GoTo") || S === PDFLib.PDFName.of("GoToR")) { kind = "internal"; }
            } else {
              const U = dict.lookupMaybe(PDFLib.PDFName.of("URI"), PDFLib.PDFString);
              if (U) url = U.decode();
            }
            found.push({ page: i + 1, url, kind });
          }
        }
        if (!found.length) return { downloads: [], info: t("linksNone") };
        const lines = found.map((f) => "p" + f.page + "\t" + (f.kind === "internal" ? "[" + t("linksInternal") + "]" : (f.url || "")));
        const text = lines.join("\n");
        const b = new TextEncoder().encode(text);
        return { downloads: [{ name: "links.txt", bytes: b, mime: "text/plain" }], info: t("linksDone", found.length), copyText: text };
      }
    },
    {
      id: "booklet", icon: "booklet", accept: "application/pdf", multiple: false,
      opts: () => `
        <div class="opt-row"><label>${t("bookLayout")}</label>
          <div class="seg" data-opt="bookLayout"><input type="hidden" value="2">
            <button type="button" data-val="2" class="on">${t("book2")}</button>
            <button type="button" data-val="4">${t("book4")}</button></div></div>`,
      run: async (files, get, prog) => {
        prog(10, t("progReading"));
        const bytes = await readBytes(files[0]);
        const src = await PDFLib.PDFDocument.load(bytes, { ignoreEncryption: true });
        const sp = src.getPages();
        const n = (get("bookLayout") === "4") ? 4 : 2;
        const cols = 2, rows = (n === 4) ? 2 : 1;
        const ow = sp[0].getWidth(), oh = sp[0].getHeight();
        const out = await PDFLib.PDFDocument.create();
        const blocks = Math.ceil(sp.length / n);
        for (let bi = 0; bi < blocks; bi++) {
          prog(10 + Math.round((bi / blocks) * 85), t("progExtracting") + " " + (bi + 1) + "/" + blocks);
          const op = out.addPage([ow * cols, oh * rows]);
          for (let k = 0; k < n; k++) {
            const idx = bi * n + k; if (idx >= sp.length) break;
            const ep = await out.embedPage(sp[idx]);
            const col = k % cols, row = Math.floor(k / cols);
            op.drawPage(ep, { x: col * ow, y: oh * (rows - 1 - row), width: ow, height: oh });
          }
        }
        const b = await out.save();
        return { downloads: [{ name: "booklet.pdf", bytes: b, mime: "application/pdf" }], info: t("bookDone", sp.length, out.getPageCount()) };
      }
    },
    {
      id: "cover", icon: "cover", accept: "application/pdf", multiple: false,
      opts: () => `
        <div class="opt-row"><label>${t("coverTitle")}</label><input class="field" data-opt="coverTitle" value="${t("coverDefault")}"></div>
        <div class="opt-row"><label>${t("coverSub")}</label><input class="field" data-opt="coverSub" placeholder="${t("coverSubPh")}"></div>
        <div class="opt-row"><label style="color:var(--muted);font-size:13px">${t("coverNote")}</label></div>`,
      run: async (files, get, prog) => {
        await ensureExt();
        prog(10, t("progFont"));
        const bytes = await readBytes(files[0]);
        const src = await PDFLib.PDFDocument.load(bytes, { ignoreEncryption: true });
        const pw = 595.28, ph = 841.89;
        const title = (get("coverTitle") || "").trim() || t("coverDefault");
        const sub = (get("coverSub") || "").trim();
        const wrap = document.createElement("div");
        wrap.style.cssText = "position:fixed;left:-99999px;top:0;width:" + pw + "px;";
        wrap.innerHTML = '<div style="width:' + pw + 'px;height:' + ph + 'px;box-sizing:border-box;background:#ffffff;display:flex;flex-direction:column;justify-content:center;padding:90px;font-family:-apple-system,\'Segoe UI\',\'Microsoft YaHei\',sans-serif;">'
          + '<div style="width:120px;height:10px;background:#6366f1;border-radius:6px;margin-bottom:46px;"></div>'
          + '<div style="font-size:48px;font-weight:800;color:#0f172a;line-height:1.18;word-break:break-word;">' + escapeHtml(title) + '</div>'
          + (sub ? '<div style="font-size:22px;color:#475569;margin-top:26px;line-height:1.5;word-break:break-word;">' + escapeHtml(sub) + '</div>' : '')
          + '<div style="margin-top:auto;font-size:14px;color:#94a3b8;">' + escapeHtml(t("coverFoot")) + '</div></div>';
        document.body.appendChild(wrap);
        let cv;
        try { cv = await html2canvas(wrap.firstElementChild, { scale: 2, backgroundColor: "#ffffff", logging: false }); }
        finally { document.body.removeChild(wrap); }
        const imgBytes = (function (du) { const bin = atob(du.split(",")[1]); const a = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) a[i] = bin.charCodeAt(i); return a; })(cv.toDataURL("image/jpeg", 0.92));
        const out = await PDFLib.PDFDocument.create();
        const img = await out.embedJpg(imgBytes);
        const cp = out.addPage([pw, ph]);
        cp.drawImage(img, { x: 0, y: 0, width: pw, height: ph });
        const ps = await out.copyPages(src, src.getPageIndices());
        ps.forEach((p) => out.addPage(p));
        const b = await out.save();
        return { downloads: [{ name: "with-cover.pdf", bytes: b, mime: "application/pdf" }], info: t("coverDone", out.getPageCount()) };
      }
    },
    {
      id: "repair", icon: "repair", accept: "application/pdf", multiple: false,
      opts: () => `
        <div class="opt-row"><label style="color:var(--muted);font-size:13px">${t("repairNote")}</label></div>`,
      run: async (files, get, prog) => {
        prog(15, t("progReading"));
        const bytes = await readBytes(files[0]);
        try {
          const doc = await PDFLib.PDFDocument.load(bytes, { ignoreEncryption: true });
          const cnt = doc.getPageCount();
          const out = await doc.save();
          if (out.length >= bytes.length) return { downloads: [{ name: "repaired.pdf", bytes: out, mime: "application/pdf" }], info: t("repairSame", cnt) };
          return { downloads: [{ name: "repaired.pdf", bytes: out, mime: "application/pdf" }], info: t("repairDone", cnt, fmt(bytes.length), fmt(out.length)) };
        } catch (e) {
          return { downloads: [], info: t("repairFail") };
        }
      }
    },
    /* ---- 新增：添加背景 ---- */
    {
      id: "bg", icon: "bg", accept: "application/pdf", multiple: false,
      opts: () => `
        <div class="opt-row"><label>${t("bgColor")}</label>
          <div class="swatches" data-opt="color"><input type="hidden" value="#fff7ed">
            <span class="swatch on" data-color="#fff7ed" style="background:#fff7ed"></span>
            <span class="swatch" data-color="#eff6ff" style="background:#eff6ff"></span>
            <span class="swatch" data-color="#f0fdf4" style="background:#f0fdf4"></span>
            <span class="swatch" data-color="#fef2f2" style="background:#fef2f2"></span>
            <span class="swatch" data-color="#faf5ff" style="background:#faf5ff"></span>
            <span class="swatch" data-color="#1e293b" style="background:#1e293b"></span></div></div>
        <div class="opt-row"><label>${t("bgMode")}</label>
          <div class="seg" data-opt="mode"><input type="hidden" value="full">
            <button type="button" data-val="full" class="on">${t("bgFull")}</button>
            <button type="button" data-val="frame">${t("bgFrame")}</button></div></div>`,
      run: async (files, get, prog) => {
        prog(15, t("progReading"));
        const bytes = await readBytes(files[0]);
        const src = await PDFLib.PDFDocument.load(bytes, { ignoreEncryption: true });
        const sp = src.getPages();
        const color = hexToRgb(get("color") || "#fff7ed");
        const mode = get("mode") || "full";
        const out = await PDFLib.PDFDocument.create();
        for (let i = 0; i < sp.length; i++) {
          prog(15 + Math.round((i / sp.length) * 80), t("progExtracting") + " " + (i + 1) + "/" + sp.length);
          const [w, h] = sp[i].getSize();
          const op = out.addPage([w, h]);
          if (mode === "frame") {
            const m = Math.min(w, h) * 0.05;
            op.drawRectangle({ x: 0, y: 0, width: w, height: h, color });
            const ep0 = await out.embedPage(sp[i]);
            op.drawPage(ep0, { x: m, y: m, width: w - 2 * m, height: h - 2 * m });
          } else {
            op.drawRectangle({ x: 0, y: 0, width: w, height: h, color });
            const ep = await out.embedPage(sp[i]);
            op.drawPage(ep, { x: 0, y: 0, width: w, height: h });
          }
        }
        const b = await out.save();
        return { downloads: [{ name: "background.pdf", bytes: b, mime: "application/pdf" }], info: t("bgDone", sp.length) };
      }
    },
    /* ---- 新增：增加页边距 ---- */
    {
      id: "margin", icon: "margin", accept: "application/pdf", multiple: false,
      opts: () => `
        <div class="opt-row"><label>${t("mgSize")} <span class="range-val" id="mgSize_val">15</span> mm</label>
          <input type="range" min="3" max="40" value="15" data-opt="mm" id="mgSize"></div>
        <div class="opt-row"><label>${t("mgColor")}</label>
          <div class="swatches" data-opt="color"><input type="hidden" value="#ffffff">
            <span class="swatch on" data-color="#ffffff" style="background:#ffffff;border:1px solid #e2e8f0"></span>
            <span class="swatch" data-color="#f8fafc" style="background:#f8fafc"></span>
            <span class="swatch" data-color="#fffbeb" style="background:#fffbeb"></span>
            <span class="swatch" data-color="#eff6ff" style="background:#eff6ff"></span>
            <span class="swatch" data-color="#f0fdf4" style="background:#f0fdf4"></span></div></div>`,
      run: async (files, get, prog) => {
        prog(15, t("progReading"));
        const bytes = await readBytes(files[0]);
        const src = await PDFLib.PDFDocument.load(bytes, { ignoreEncryption: true });
        const sp = src.getPages();
        const mm = Math.max(3, Math.min(40, +(get("mm") || 15)));
        const m = mm * 2.834645669;
        const cv = get("color") || "#ffffff";
        const color = cv === "#ffffff" ? PDFLib.rgb(1, 1, 1) : hexToRgb(cv);
        const out = await PDFLib.PDFDocument.create();
        for (let i = 0; i < sp.length; i++) {
          prog(15 + Math.round((i / sp.length) * 80), t("progExtracting") + " " + (i + 1) + "/" + sp.length);
          const [w, h] = sp[i].getSize();
          const op = out.addPage([w + 2 * m, h + 2 * m]);
          op.drawRectangle({ x: 0, y: 0, width: w + 2 * m, height: h + 2 * m, color });
          const ep = await out.embedPage(sp[i]);
          op.drawPage(ep, { x: m, y: m, width: w, height: h });
        }
        const b = await out.save();
        return { downloads: [{ name: "margins.pdf", bytes: b, mime: "application/pdf" }], info: t("mgDone", sp.length, mm) };
      }
    },
    /* ---- 新增：图片水印 ---- */
    {
      id: "wmimg", icon: "wmimg",
      sources: [
        { role: "main", label: t("insMain"), accept: "application/pdf", multiple: false },
        { role: "img", label: t("wmimgUpload"), accept: "image/png,image/jpeg", multiple: false }
      ],
      opts: () => `
        <div class="opt-row"><label>${t("wmimgLayout")}</label>
          <div class="seg" data-opt="layout"><input type="hidden" value="tile">
            <button type="button" data-val="tile" class="on">${t("wmimgTile")}</button>
            <button type="button" data-val="single">${t("wmimgSingle")}</button></div></div>
        <div class="opt-row"><label>${t("wmimgScale")} <span class="range-val" id="wmimgScale_val">22</span>%</label>
          <input type="range" min="5" max="70" value="22" data-opt="scale" id="wmimgScale"></div>
        <div class="opt-row"><label>${t("wmimgOpacity")} <span class="range-val" id="wmimgOp_val">30</span>%</label>
          <input type="range" min="5" max="90" value="30" data-opt="opacity" id="wmimgOp"></div>`,
      run: async (src, get, prog) => {
        prog(15, t("progReading"));
        const pdfBytes = await readBytes(src.main[0]);
        const doc = await PDFLib.PDFDocument.load(pdfBytes, { ignoreEncryption: true });
        const imBytes = await readBytes(src.img[0]);
        const nm = (src.img[0].name || "").toLowerCase();
        const img = nm.endsWith(".png") ? await doc.embedPng(imBytes) : await doc.embedJpg(imBytes);
        const layout = get("layout") || "tile";
        const pct = Math.max(5, Math.min(70, +(get("scale") || 22))) / 100;
        const opacity = Math.max(5, Math.min(90, +(get("opacity") || 30))) / 100;
        const pages = doc.getPages();
        const iw = img.width, ih = img.height, ar = iw / ih;
        for (let i = 0; i < pages.length; i++) {
          prog(15 + Math.round((i / pages.length) * 80), t("progExtracting") + " " + (i + 1) + "/" + pages.length);
          const p = pages[i]; const W = p.getWidth(), H = p.getHeight();
          const w = Math.min(W, H) * pct, h = w / ar;
          if (layout === "single") {
            p.drawImage(img, { x: (W - w) / 2, y: (H - h) / 2, width: w, height: h, opacity });
          } else {
            const gx = w * 1.6, gy = h * 1.6;
            for (let y = -gy / 2; y < H + gy / 2; y += gy)
              for (let x = -gx / 2; x < W + gx / 2; x += gx)
                p.drawImage(img, { x, y, width: w, height: h, opacity });
          }
        }
        const b = await doc.save();
        return { downloads: [{ name: "image-watermark.pdf", bytes: b, mime: "application/pdf" }], info: t("wmimgDone", pages.length) };
      }
    },
    /* ---- 新增：提取书签 ---- */
    {
      id: "outline", icon: "outline", accept: "application/pdf", multiple: false,
      opts: () => `<div class="opt-row"><label style="color:var(--muted);font-size:13px">${t("outlineNote")}</label></div>`,
      run: async (files, get, prog) => {
        prog(15, t("progReading"));
        const bytes = await readBytes(files[0]);
        const doc = await PDFLib.PDFDocument.load(bytes, { ignoreEncryption: true });
        const ctx = doc.context;
        const root = doc.catalog.lookupMaybe(PDFLib.PDFName.of("Outlines"), PDFLib.PDFDict);
        if (!root) return { downloads: [], info: t("outlineNone") };
        const pages = doc.getPages();
        const resolvePage = (node) => {
          let dest = node.lookupMaybe(PDFLib.PDFName.of("Dest"));
          if (!dest) { const A = node.lookupMaybe(PDFLib.PDFName.of("A"), PDFLib.PDFDict); if (A) dest = A.lookupMaybe(PDFLib.PDFName.of("D")); }
          if (!dest) return null;
          let arr = dest; if (dest instanceof PDFLib.PDFRef) arr = ctx.lookup(dest);
          if (!arr || !arr.lookup) return null;
          const p = arr.lookup(0); if (!p) return null;
          const pd = (p instanceof PDFLib.PDFRef) ? ctx.lookup(p) : p;
          if (!pd) return null;
          for (let i = 0; i < pages.length; i++) if (pages[i].node === pd) return i + 1;
          return null;
        };
        const lines = [];
        const walk = (node, depth) => {
          let cur = node.lookupMaybe(PDFLib.PDFName.of("First"), PDFLib.PDFDict);
          while (cur) {
            if (cur instanceof PDFLib.PDFRef) cur = ctx.lookup(cur);
            if (!cur || !cur.lookupMaybe) break;
            const title = cur.lookupMaybe(PDFLib.PDFName.of("Title"), PDFLib.PDFString);
            const ttl = title ? title.decode() : "(untitled)";
            const pg = resolvePage(cur);
            lines.push("  ".repeat(depth) + "• " + ttl + (pg ? ("  → p" + pg) : ""));
            walk(cur, depth + 1);
            cur = cur.lookupMaybe(PDFLib.PDFName.of("Next"), PDFLib.PDFDict);
          }
        };
        walk(root, 0);
        if (!lines.length) return { downloads: [], info: t("outlineNone") };
        const text = lines.join("\n");
        const b = new TextEncoder().encode(text);
        return { downloads: [{ name: "bookmarks.txt", bytes: b, mime: "text/plain" }], info: t("outlineDone", lines.length), copyText: text };
      }
    },
    /* ---- 新增：提取表单字段 ---- */
    {
      id: "formfields", icon: "formfields", accept: "application/pdf", multiple: false,
      opts: () => `<div class="opt-row"><label style="color:var(--muted);font-size:13px">${t("formNote")}</label></div>`,
      run: async (files, get, prog) => {
        prog(15, t("progReading"));
        const bytes = await readBytes(files[0]);
        const doc = await PDFLib.PDFDocument.load(bytes, { ignoreEncryption: true });
        let form;
        try { form = doc.getForm(); } catch (e) { form = null; }
        if (!form) return { downloads: [], info: t("formNone") };
        const fields = form.getFields();
        if (!fields || !fields.length) return { downloads: [], info: t("formNone") };
        const typeName = (f) => {
          if (f instanceof PDFLib.PDFTextField) return "text";
          if (f instanceof PDFLib.PDFCheckBox) return "checkbox";
          if (f instanceof PDFLib.PDFRadioGroup) return "radio";
          if (f instanceof PDFLib.PDFDropdown) return "dropdown";
          if (f instanceof PDFLib.PDFOptionList) return "list";
          if (f instanceof PDFLib.PDFButton) return "button";
          return "field";
        };
        const valOf = (f) => {
          try {
            if (f instanceof PDFLib.PDFTextField) return f.getText() || "";
            if (f instanceof PDFLib.PDFCheckBox) return f.isChecked() ? "checked" : "";
            if (f instanceof PDFLib.PDFRadioGroup) return f.getSelected() || "";
            if (f instanceof PDFLib.PDFDropdown) return (f.getSelected() || []).join("|");
            if (f instanceof PDFLib.PDFOptionList) return (f.getSelected() || []).join("|");
            return "";
          } catch (e) { return ""; }
        };
        const nameOf = (f) => { try { return f.getName() || ""; } catch (e) { return ""; } };
        const rows = fields.map((f) => nameOf(f) + "\t" + typeName(f) + "\t" + valOf(f).replace(/\t/g, " "));
        const text = "name\ttype\tvalue\n" + rows.join("\n");
        const b = new TextEncoder().encode(text);
        return { downloads: [{ name: "form-fields.tsv", bytes: b, mime: "text/tab-separated-values" }], info: t("formDone", fields.length), copyText: text };
      }
    },
    /* ---- 新增：删除注释 ---- */
    {
      id: "rmanno", icon: "rmanno", accept: "application/pdf", multiple: false,
      opts: () => `
        <div class="opt-row"><label>${t("rmKeepLinks")}</label>
          <div class="seg" data-opt="keep"><input type="hidden" value="no">
            <button type="button" data-val="no" class="on">${t("rmAll")}</button>
            <button type="button" data-val="yes">${t("rmKeep")}</button></div></div>`,
      run: async (files, get, prog) => {
        prog(15, t("progReading"));
        const bytes = await readBytes(files[0]);
        const doc = await PDFLib.PDFDocument.load(bytes, { ignoreEncryption: true });
        const keep = get("keep") === "yes";
        const pages = doc.getPages();
        let n = 0;
        for (const p of pages) {
          const annots = p.node.lookupMaybe(PDFLib.PDFName.of("Annots"), PDFLib.PDFArray);
          if (!annots) continue;
          n++;
          if (!keep) { p.node.delete(PDFLib.PDFName.of("Annots")); continue; }
          const kept = [];
          for (const a of annots.asArray()) {
            const dict = doc.context.lookup(a);
            if (!dict) continue;
            const sub = dict.lookupMaybe(PDFLib.PDFName.of("Subtype"), PDFLib.PDFName);
            if (sub === PDFLib.PDFName.of("Link")) kept.push(a);
          }
          if (kept.length) {
            const na = PDFLib.PDFArray.withContext(doc.context);
            kept.forEach((r) => na.push(r));
            p.node.set(PDFLib.PDFName.of("Annots"), na);
          } else {
            p.node.delete(PDFLib.PDFName.of("Annots"));
          }
        }
        const b = await doc.save();
        return { downloads: [{ name: "no-annotations.pdf", bytes: b, mime: "application/pdf" }], info: t("rmDone", n) };
      }
    },
    /* ---- 新增：单页拆分 / 奇偶页拆分 / 提取附件 / 交错合并 / 按书签拆分 / 字数统计 ---- */
    {
      id: "burst", icon: "burst", accept: "application/pdf", multiple: false,
      opts: () => `<div class="opt-row"><label style="color:var(--muted);font-size:13px">${t("burstNote")}</label></div>`,
      run: async (files, get, prog) => {
        prog(8, t("progReading"));
        const bytes = await readBytes(files[0]);
        const doc = await PDFLib.PDFDocument.load(bytes, { ignoreEncryption: true });
        const pages = doc.getPages();
        const out = [];
        for (let i = 0; i < pages.length; i++) {
          prog(10 + Math.round((i / pages.length) * 82), t("burstProg", i + 1, pages.length));
          const nd = await PDFLib.PDFDocument.create();
          const np = await nd.embedPage(pages[i]);
          nd.addPage(np);
          out.push({ name: "page-" + String(i + 1).padStart(4, "0") + ".pdf", bytes: await nd.save(), mime: "application/pdf" });
        }
        if (out.length <= 1) return { downloads: out, info: t("burstOne") };
        return { downloads: [{ name: "single-pages.zip", bytes: makeZip(out), mime: "application/zip" }], info: t("burstDone", out.length) };
      }
    },
    {
      id: "oddeven", icon: "oddeven", accept: "application/pdf", multiple: false,
      opts: () => `<div class="opt-row"><label style="color:var(--muted);font-size:13px">${t("oeNote")}</label></div>`,
      run: async (files, get, prog) => {
        prog(8, t("progReading"));
        const bytes = await readBytes(files[0]);
        const doc = await PDFLib.PDFDocument.load(bytes, { ignoreEncryption: true });
        const pages = doc.getPages();
        const mk = async (idxs) => {
          const nd = await PDFLib.PDFDocument.create();
          for (const k of idxs) { const np = await nd.embedPage(pages[k]); nd.addPage(np); }
          return nd.save();
        };
        const odd = [], even = [];
        pages.forEach((p, i) => (i % 2 === 0 ? odd : even).push(i));
        const downs = [];
        if (odd.length) downs.push({ name: "odd-pages.pdf", bytes: await mk(odd), mime: "application/pdf" });
        if (even.length) downs.push({ name: "even-pages.pdf", bytes: await mk(even), mime: "application/pdf" });
        if (!downs.length) return { downloads: [], info: t("oeNone") };
        return { downloads: downs, info: t("oeDone", odd.length, even.length) };
      }
    },
    {
      id: "attach", icon: "attach", accept: "application/pdf", multiple: false,
      opts: () => `<div class="opt-row"><label style="color:var(--muted);font-size:13px">${t("attNote")}</label></div>`,
      run: async (files, get, prog) => {
        const guessMime = (nm) => {
          const ext = (nm.split(".").pop() || "").toLowerCase();
          const m = { png:"image/png", jpg:"image/jpeg", jpeg:"image/jpeg", gif:"image/gif", bmp:"image/bmp", webp:"image/webp", pdf:"application/pdf", txt:"text/plain", csv:"text/csv", html:"text/html", htm:"text/html", json:"application/json", xml:"application/xml", zip:"application/zip", rar:"application/x-rar-compressed", doc:"application/msword", docx:"application/vnd.openxmlformats-officedocument.wordprocessingml.document", xls:"application/vnd.ms-excel", xlsx:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", ppt:"application/vnd.ms-powerpoint", pptx:"application/vnd.openxmlformats-officedocument.presentationml.presentation", mp3:"audio/mpeg", wav:"audio/wav", mp4:"video/mp4", mov:"video/quicktime" };
          return m[ext] || "application/octet-stream";
        };
        prog(8, t("progReading"));
        const bytes = await readBytes(files[0]);
        const doc = await PDFLib.PDFDocument.load(bytes, { ignoreEncryption: true });
        const ctx = doc.context;
        const names = doc.catalog.lookupMaybe(PDFLib.PDFName.of("Names"), PDFLib.PDFDict);
        if (!names) return { downloads: [], info: t("attNone") };
        const efRoot = names.lookupMaybe(PDFLib.PDFName.of("EmbeddedFiles"), PDFLib.PDFDict);
        if (!efRoot) return { downloads: [], info: t("attNone") };
        const out = [];
        const walk = (node) => {
          if (!node || !node.lookupMaybe) return;
          const leaf = node.lookupMaybe(PDFLib.PDFName.of("Names"), PDFLib.PDFArray);
          if (leaf) {
            const arr = leaf.asArray();
            for (let i = 1; i < arr.length; i += 2) {
              let fs = arr[i];
              if (fs instanceof PDFLib.PDFRef) fs = ctx.lookup(fs);
              if (!fs || !fs.lookupMaybe) continue;
              const ef = fs.lookupMaybe(PDFLib.PDFName.of("EF"), PDFLib.PDFDict);
              if (!ef) continue;
              let stream = ef.lookupMaybe(PDFLib.PDFName.of("F"), PDFLib.PDFStream);
              if (!stream) stream = ef.lookupMaybe(PDFLib.PDFName.of("UF"), PDFLib.PDFStream);
              if (!stream || !stream.getContents) continue;
              let fn = fs.lookupMaybe(PDFLib.PDFName.of("UF"), PDFLib.PDFString) || fs.lookupMaybe(PDFLib.PDFName.of("F"), PDFLib.PDFString);
              const raw = fn ? fn.decode() : "";
              const safe = (raw.split(/[\\/]/).pop() || ("file-" + (out.length + 1))).replace(/[^\w.\-\u4e00-\u9fff]/g, "_");
              out.push({ name: safe, bytes: stream.getContents(), mime: guessMime(safe) });
            }
          }
          const kids = node.lookupMaybe(PDFLib.PDFName.of("Kids"), PDFLib.PDFArray);
          if (kids) kids.asArray().forEach((k) => { let c = k; if (c instanceof PDFLib.PDFRef) c = ctx.lookup(c); walk(c); });
        };
        walk(efRoot);
        if (!out.length) return { downloads: [], info: t("attNone") };
        return { downloads: [{ name: "attachments.zip", bytes: makeZip(out), mime: "application/zip" }], info: t("attDone", out.length) };
      }
    },
    {
      id: "collate", icon: "collate", accept: "application/pdf", multiple: true,
      opts: () => `<div class="opt-row"><label style="color:var(--muted);font-size:13px">${t("collateNote")}</label></div>`,
      run: async (files, get, prog) => {
        if (files.length < 2) return { downloads: [], info: t("collateNeed") };
        prog(6, t("progReading"));
        const A = await PDFLib.PDFDocument.load(await readBytes(files[0]), { ignoreEncryption: true });
        const B = await PDFLib.PDFDocument.load(await readBytes(files[1]), { ignoreEncryption: true });
        const out = await PDFLib.PDFDocument.create();
        const pa = A.getPages().length, pb = B.getPages().length;
        const n = Math.max(pa, pb);
        for (let i = 0; i < n; i++) {
          prog(8 + Math.round((i / n) * 86), t("collateProg", i + 1, n));
          if (i < pa) { const np = await out.embedPage(A.getPages()[i]); out.addPage(np); }
          if (i < pb) { const np = await out.embedPage(B.getPages()[i]); out.addPage(np); }
        }
        const b = await out.save();
        return { downloads: [{ name: "collated.pdf", bytes: b, mime: "application/pdf" }], info: t("collateDone", pa, pb, out.getPages().length) };
      }
    },
    {
      id: "splitbm", icon: "splitbm", accept: "application/pdf", multiple: false,
      opts: () => `<div class="opt-row"><label style="color:var(--muted);font-size:13px">${t("sbmNote")}</label></div>`,
      run: async (files, get, prog) => {
        prog(8, t("progReading"));
        const bytes = await readBytes(files[0]);
        const doc = await PDFLib.PDFDocument.load(bytes, { ignoreEncryption: true });
        const ctx = doc.context;
        const root = doc.catalog.lookupMaybe(PDFLib.PDFName.of("Outlines"), PDFLib.PDFDict);
        if (!root) return { downloads: [], info: t("sbmNone") };
        const pages = doc.getPages();
        const resolvePage = (node) => {
          let dest = node.lookupMaybe(PDFLib.PDFName.of("Dest"));
          if (!dest) { const A = node.lookupMaybe(PDFLib.PDFName.of("A"), PDFLib.PDFDict); if (A) dest = A.lookupMaybe(PDFLib.PDFName.of("D")); }
          if (!dest) return null;
          let arr = dest; if (dest instanceof PDFLib.PDFRef) arr = ctx.lookup(dest);
          if (!arr || !arr.lookup) return null;
          const p = arr.lookup(0); if (!p) return null;
          const pd = (p instanceof PDFLib.PDFRef) ? ctx.lookup(p) : p;
          if (!pd) return null;
          for (let i = 0; i < pages.length; i++) if (pages[i].node === pd) return i + 1;
          return null;
        };
        const top = [];
        let cur = root.lookupMaybe(PDFLib.PDFName.of("First"), PDFLib.PDFDict);
        while (cur) {
          if (cur instanceof PDFLib.PDFRef) cur = ctx.lookup(cur);
          if (!cur || !cur.lookupMaybe) break;
          const title = cur.lookupMaybe(PDFLib.PDFName.of("Title"), PDFLib.PDFString);
          const ttl = title ? title.decode() : ("part-" + (top.length + 1));
          const pg = resolvePage(cur);
          top.push({ title: ttl, page: pg ? pg - 1 : 0 });
          cur = cur.lookupMaybe(PDFLib.PDFName.of("Next"), PDFLib.PDFDict);
        }
        if (top.length < 2) return { downloads: [], info: t("sbmFew") };
        top.sort((a, b) => a.page - b.page);
        const out = [];
        for (let k = 0; k < top.length; k++) {
          prog(12 + Math.round((k / top.length) * 80), t("sbmProg", k + 1, top.length));
          const start = top[k].page;
          const end = (k + 1 < top.length) ? top[k + 1].page : pages.length;
          const nd = await PDFLib.PDFDocument.create();
          for (let i = start; i < end; i++) { const np = await nd.embedPage(pages[i]); nd.addPage(np); }
          const nm = (top[k].title.replace(/[\\/:*?"<>|]/g, "_").trim() || ("part-" + (k + 1))) + ".pdf";
          out.push({ name: nm, bytes: await nd.save(), mime: "application/pdf" });
        }
        return { downloads: [{ name: "by-bookmarks.zip", bytes: makeZip(out), mime: "application/zip" }], info: t("sbmDone", top.length) };
      }
    },
    {
      id: "wordcount", icon: "wordcount", accept: "application/pdf", multiple: false,
      opts: () => `<div class="opt-row"><label style="color:var(--muted);font-size:13px">${t("wcNote")}</label></div>`,
      run: async (files, get, prog) => {
        pdfjsLib.GlobalWorkerOptions.workerSrc = "vendor/pdf.worker.min.js";
        prog(4, t("progOcrEngine"));
        const bytes = await readBytes(files[0]);
        const doc = await pdfjsLib.getDocument({ data: bytes.slice(0) }).promise;
        const reCJK = /[\u4e00-\u9fff\u3400-\u4dbf]/g;
        let chars = 0, cjk = 0, words = 0;
        for (let i = 1; i <= doc.numPages; i++) {
          prog(6 + Math.round((i / doc.numPages) * 86), t("wcProg", i, doc.numPages));
          const page = await doc.getPage(i);
          const tc = await page.getTextContent();
          const text = tc.items.map((it) => it.str).join("");
          chars += text.length;
          const c = (text.match(reCJK) || []).length;
          cjk += c;
          words += (text.replace(reCJK, " ").match(/[A-Za-z0-9]+(?:[''-][A-Za-z0-9]+)*/g) || []).length;
        }
        const report = t("wcReport", doc.numPages, chars, cjk, words);
        const b = new TextEncoder().encode(report);
        return { downloads: [{ name: "word-count.txt", bytes: b, mime: "text/plain" }], info: t("wcDone", doc.numPages, chars, words), copyText: report };
      }
    },
    {
      id: 'addlink', icon: 'addlink', accept: 'application/pdf', multiple: false,
      opts: () => `
        <div class='opt-row'><label>${t('alUrl')}</label><input class='field' type='text' data-opt='url' placeholder='https://example.com'></div>
        <div class='opt-row'><label>${t('alPages')}</label><input class='field' type='text' data-opt='pages' value='all' placeholder='1-3,5'></div>
        <div class='opt-row'><label>${t('alRegion')}</label>
          <div class='seg' data-opt='region'><input type='hidden' value='full'>
            <button type='button' data-val='full' class='on'>${t('alFull')}</button>
            <button type='button' data-val='top'>${t('alTop')}</button>
            <button type='button' data-val='mid'>${t('alMid')}</button>
            <button type='button' data-val='bot'>${t('alBot')}</button></div></div>`,
      run: async (files, get, prog) => {
        const url = (get('url') || '').trim();
        if (url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) return { downloads: [], info: t('alNeedUrl') };
        prog(6, t('progReading'));
        const doc = await PDFLib.PDFDocument.load(await readBytes(files[0]), { ignoreEncryption: true });
        const parsePages = (str, total) => {
          const res = new Set();
          const toks = (str || '').split(',');
          for (const raw of toks) {
            const part = raw.trim();
            if (!part) continue;
            if (part === 'all') { for (let i = 0; i < total; i++) res.add(i); continue; }
            const dash = part.indexOf('-');
            if (dash > 0) {
              const a = parseInt(part.slice(0, dash), 10) - 1, b = parseInt(part.slice(dash + 1), 10) - 1;
              if (isNaN(a) || isNaN(b)) continue;
              const lo = Math.min(a, b), hi = Math.max(a, b);
              for (let i = lo; i <= hi && i < total; i++) if (i >= 0) res.add(i);
            } else {
              const i = parseInt(part, 10) - 1;
              if (!isNaN(i) && i >= 0 && i < total) res.add(i);
            }
          }
          return [...res].sort((a, b) => a - b);
        };
        const idx = parsePages(get('pages') || 'all', doc.getPages().length);
        if (!idx.length) return { downloads: [], info: t('alErr') };
        const region = get('region') || 'full';
        const ctx = doc.context;
        idx.forEach((i) => {
          const p = doc.getPages()[i];
          const W = p.getWidth(), H = p.getHeight();
          let rect;
          if (region === 'top') rect = [0, H * 0.72, W, H];
          else if (region === 'mid') rect = [0, H * 0.30, W, H * 0.70];
          else if (region === 'bot') rect = [0, 0, W, H * 0.28];
          else rect = [0, 0, W, H];
          const annot = ctx.obj({ Type: 'Annot', Subtype: 'Link', Rect: rect, Border: [0, 0, 0], A: ctx.obj({ Type: 'Action', S: 'URI', URI: PDFLib.PDFString.of(url) }) });
          const ref = ctx.register(annot);
          const ex = p.node.lookupMaybe(PDFLib.PDFName.of('Annots'), PDFLib.PDFArray);
          if (ex) ex.push(ref); else p.node.set(PDFLib.PDFName.of('Annots'), PDFLib.PDFArray.fromArray([ref], ctx));
        });
        const b = await doc.save();
        return { downloads: [{ name: 'with-links.pdf', bytes: b, mime: 'application/pdf' }], info: t('alDone', idx.length) };
      }
    },
    {
      id: 'bates', icon: 'bates', accept: 'application/pdf', multiple: false,
      opts: () => `
        <div class='opt-row'><label>${t('btPrefix')}</label><input class='field' type='text' data-opt='prefix' value='NO.'></div>
        <div class='opt-row'><label>${t('btStart')}</label><input class='field' type='number' data-opt='start' value='1' style='max-width:90px'></div>
        <div class='opt-row'><label>${t('btDigits')}</label><input class='field' type='number' min='1' max='9' data-opt='digits' value='5' style='max-width:90px'></div>
        <div class='opt-row'><label>${t('btPos')}</label>
          <div class='seg' data-opt='pos'><input type='hidden' value='br'>
            <button type='button' data-val='tl'>${t('posTL')}</button>
            <button type='button' data-val='tr'>${t('posTR')}</button>
            <button type='button' data-val='bl'>${t('posBL')}</button>
            <button type='button' data-val='br' class='on'>${t('posBR')}</button>
            <button type='button' data-val='mc'>${t('posMC')}</button></div></div>`,
      run: async (files, get, prog) => {
        prog(6, t('progReading'));
        const doc = await PDFLib.PDFDocument.load(await readBytes(files[0]), { ignoreEncryption: true });
        const prefix = get('prefix') || '';
        const cjk = hasCJK(prefix);
        const font = cjk ? null : await doc.embedFont(PDFLib.StandardFonts.Helvetica);
        const start = Math.max(0, parseInt(get('start') || '1', 10) || 1);
        const digits = Math.max(1, Math.min(9, parseInt(get('digits') || '5', 10) || 5));
        const pos = get('pos') || 'br';
        const pages = doc.getPages();
        const m = 22;
        prog(60, t('progRepackage'));
        for (let i = 0; i < pages.length; i++) {
          const p = pages[i];
          const label = prefix + String(start + i).padStart(digits, '0');
          const W = p.getWidth(), H = p.getHeight();
          const size = Math.max(7, Math.min(W, H) * 0.02);
          let x = m, y = m, w, h;
          if (cjk) {
            const png = await cjkTextPngBytes(label, { size, color: '#000000', bold: true, pad: 2 });
            const img = await doc.embedPng(png.bytes);
            w = png.w + 8; h = png.h + 6;
            if (pos[1] === 'c' || pos === 'mc') x = (W - w) / 2; else if (pos[1] === 'r') x = W - w - m;
            if (pos[0] === 't') y = H - h - m; else if (pos[0] === 'm' || pos === 'mc') y = (H - h) / 2;
            p.drawImage(img, { x: x + 4, y: y + 3, width: png.w, height: png.h });
          } else {
            w = font.widthOfTextAtSize(label, size) + 8;
            h = size + 6;
            if (pos[1] === 'c' || pos === 'mc') x = (W - w) / 2; else if (pos[1] === 'r') x = W - w - m;
            if (pos[0] === 't') y = H - h - m; else if (pos[0] === 'm' || pos === 'mc') y = (H - h) / 2;
            p.drawText(label, { x, y, size, font, color: PDFLib.rgb(0, 0, 0) });
          }
        }
        const b = await doc.save();
        return { downloads: [{ name: 'bates.pdf', bytes: b, mime: 'application/pdf' }], info: t('btDone', pages.length) };
      }
    },
    {
      id: 'overlay', icon: 'overlay',
      sources: [
        { role: 'main', label: t('ovMain'), accept: 'application/pdf', multiple: false },
        { role: 'tmpl', label: t('ovTmpl'), accept: 'application/pdf', multiple: false }
      ],
      opts: () => `<div class='opt-row'><label style='color:var(--muted);font-size:13px'>${t('ovNote')}</label></div>`,
      run: async (src, get, prog) => {
        if (!src.main || !src.tmpl) return { downloads: [], info: t('ovNeed') };
        prog(6, t('progReading'));
        const target = await PDFLib.PDFDocument.load(await readBytes(src.main[0]), { ignoreEncryption: true });
        const tmpl = await PDFLib.PDFDocument.load(await readBytes(src.tmpl[0]), { ignoreEncryption: true });
        const out = await PDFLib.PDFDocument.create();
        const tp = target.getPages(), mp = tmpl.getPages();
        const n = tp.length;
        for (let i = 0; i < n; i++) {
          prog(8 + Math.round((i / n) * 86), t('ovProg', i + 1, n));
          const pg = tp[i];
          const W = pg.getWidth(), H = pg.getHeight();
          const np = out.addPage([W, H]);
          np.drawPage(await out.embedPage(pg), { x: 0, y: 0, width: W, height: H });
          const srcPg = mp[Math.min(i, mp.length - 1)];
          np.drawPage(await out.embedPage(srcPg), { x: 0, y: 0, width: W, height: H });
        }
        const b = await out.save();
        return { downloads: [{ name: 'overlaid.pdf', bytes: b, mime: 'application/pdf' }], info: t('ovDone', n) };
      }
    },
    {
      id: 'compare', icon: 'compare', accept: 'application/pdf', multiple: true,
      opts: () => `<div class='opt-row'><label style='color:var(--muted);font-size:13px'>${t('cmpNote')}</label></div>`,
      run: async (files, get, prog) => {
        if (files.length < 2) return { downloads: [], info: t('cmpNeed') };
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'vendor/pdf.worker.min.js';
        prog(6, t('progOcrEngine'));
        const dA = await pdfjsLib.getDocument({ data: (await readBytes(files[0])).slice(0) }).promise;
        const dB = await pdfjsLib.getDocument({ data: (await readBytes(files[1])).slice(0) }).promise;
        const norm = (s) => {
          if (!s) return '';
          let r = '';
          for (let k = 0; k < s.length; k++) { const c = s.charCodeAt(k); r += (c === 32 || c === 9 || c === 10 || c === 13) ? ' ' : String.fromCharCode(c).toLowerCase(); }
          return r;
        };
        const getText = async (d, i) => { const pg = await d.getPage(i); const tc = await pg.getTextContent(); return tc.items.map((it) => it.str).join(' '); };
        const m = Math.max(dA.numPages, dB.numPages);
        const diffs = [];
        for (let i = 1; i <= m; i++) {
          prog(8 + Math.round((i / m) * 86), t('cmpProg', i, m));
          const ta = i <= dA.numPages ? norm(await getText(dA, i)) : '';
          const tb = i <= dB.numPages ? norm(await getText(dB, i)) : '';
          if (ta !== tb) diffs.push(i);
        }
        let report;
        if (diffs.length === 0) report = t('cmpSame', m);
        else report = t('cmpReport', dA.numPages, dB.numPages, diffs.length, diffs.join(', '));
        const b = new TextEncoder().encode(report);
        return { downloads: [{ name: 'compare-report.txt', bytes: b, mime: 'text/plain' }], info: diffs.length ? t('cmpDone', m, diffs.length) : t('cmpSame', m), copyText: report };
      }
    },
    {
      id: 'annoextract', icon: 'annoextract', accept: 'application/pdf', multiple: false,
      opts: () => `<div class='opt-row'><label style='color:var(--muted);font-size:13px'>${t('aeNote')}</label></div>`,
      run: async (files, get, prog) => {
        prog(6, t('progReading'));
        const doc = await PDFLib.PDFDocument.load(await readBytes(files[0]), { ignoreEncryption: true });
        const pages = doc.getPages();
        const lines = [];
        let count = 0;
        for (let i = 0; i < pages.length; i++) {
          prog(8 + Math.round((i / pages.length) * 84), t('aeProg', i + 1, pages.length));
          const annots = pages[i].node.lookupMaybe(PDFLib.PDFName.of('Annots'), PDFLib.PDFArray);
          if (!annots) continue;
          for (const ref of annots.asArray()) {
            const a = doc.context.lookup(ref);
            if (!a || a instanceof PDFLib.PDFRef) continue;
            const sub = a.lookupMaybe(PDFLib.PDFName.of('Subtype'), PDFLib.PDFName);
            const subName = sub ? sub.asString() : '?';
            const c = a.lookupMaybe(PDFLib.PDFName.of('Contents'), PDFLib.PDFString);
            const txt = c ? c.decodeText() : '';
            if (!txt && !subName) continue;
            count++;
            lines.push('P' + (i + 1) + ' [' + (subName || '?') + '] ' + txt);
          }
        }
        if (!count) return { downloads: [], info: t('aeNone') };
        const out = t('aeHead', pages.length, count) + '\n' + lines.join('\n');
        const b = new TextEncoder().encode(out);
        return { downloads: [{ name: 'annotations.txt', bytes: b, mime: 'text/plain' }], info: t('aeDone', count), copyText: out };
      }
    },
    {
      id: 'papersize', icon: 'papersize', accept: 'application/pdf', multiple: false,
      opts: () => `
        <div class='opt-row'><label>${t('psTarget')}</label>
          <div class='seg' data-opt='size'><input type='hidden' value='a4'>
            <button type='button' data-val='a4' class='on'>A4</button>
            <button type='button' data-val='a3'>A3</button>
            <button type='button' data-val='a5'>A5</button>
            <button type='button' data-val='letter'>Letter</button>
            <button type='button' data-val='legal'>Legal</button></div></div>
        <div class='opt-row'><label>${t('psMode')}</label>
          <div class='seg' data-opt='mode'><input type='hidden' value='contain'>
            <button type='button' data-val='contain' class='on'>${t('psContain')}</button>
            <button type='button' data-val='center'>${t('psCenter')}</button></div></div>`,
      run: async (files, get, prog) => {
        prog(6, t('progReading'));
        const doc = await PDFLib.PDFDocument.load(await readBytes(files[0]), { ignoreEncryption: true });
        const DIMS = { a4: [595.28, 841.89], a3: [841.89, 1190.55], a5: [419.53, 595.28], letter: [612, 792], legal: [612, 1008] };
        const key = get('size') || 'a4';
        const tgt = DIMS[key] || DIMS.a4;
        const mode = get('mode') || 'contain';
        const out = await PDFLib.PDFDocument.create();
        const pages = doc.getPages();
        for (let i = 0; i < pages.length; i++) {
          prog(8 + Math.round((i / pages.length) * 86), t('psProg', i + 1, pages.length));
          const pg = pages[i];
          const w = pg.getWidth(), h = pg.getHeight();
          const np = out.addPage([tgt[0], tgt[1]]);
          const emb = await out.embedPage(pg);
          if (mode === 'center') np.drawPage(emb, { x: (tgt[0] - w) / 2, y: (tgt[1] - h) / 2, width: w, height: h });
          else { const s = Math.min(tgt[0] / w, tgt[1] / h); np.drawPage(emb, { x: (tgt[0] - w * s) / 2, y: (tgt[1] - h * s) / 2, width: w * s, height: h * s }); }
        }
        const b = await out.save();
        const name = { a4: 'A4', a3: 'A3', a5: 'A5', letter: 'Letter', legal: 'Legal' }[key];
        return { downloads: [{ name: 'resized.pdf', bytes: b, mime: 'application/pdf' }], info: t('psDone', name, pages.length) };
      }
    },
    {
      id: 'border', icon: 'border', accept: 'application/pdf', multiple: false,
      opts: () => `
        <div class='opt-row'><label>${t('bdColor')}</label>
          <div class='seg' data-opt='color'><input type='hidden' value='#111827'>
            <button type='button' data-val='#111827' class='on'>${t('bdDark')}</button>
            <button type='button' data-val='#dc2626'>${t('bdRed')}</button>
            <button type='button' data-val='#2563eb'>${t('bdBlue')}</button>
            <button type='button' data-val='#16a34a'>${t('bdGreen')}</button></div></div>
        <div class='opt-row'><label>${t('bdW')}</label><input class='field' type='number' data-opt='w' value='2' min='0.5' max='20' step='0.5'></div>`,
      run: async (files, get, prog) => {
        prog(6, t('progReading'));
        const doc = await PDFLib.PDFDocument.load(await readBytes(files[0]), { ignoreEncryption: true });
        const rgb = hexToRgb(get('color') || '#111827');
        const w = Math.max(0.5, Math.min(20, parseFloat(get('w')) || 2));
        const c = PDFLib.rgb(rgb.r/255, rgb.g/255, rgb.b/255);
        const n = doc.getPageCount();
        for (let i = 0; i < n; i++) {
          prog(8 + Math.round(i/n*88), t('bdProg', i+1, n));
          const p = doc.getPage(i);
          const { width, height } = p.getSize();
          p.drawRectangle({ x: w/2, y: w/2, width: width - w, height: height - w, borderWidth: w, borderColor: c });
        }
        const b = await doc.save();
        return { downloads: [{ name: 'bordered.pdf', bytes: b, mime: 'application/pdf' }], info: t('bdDone', n) };
      }
    },
    {
      id: 'redact', icon: 'redact', accept: 'application/pdf', multiple: false,
      opts: () => `
        <div class='opt-row'><label>${t('rdPages')}</label><input class='field' type='text' data-opt='pages' value='all' placeholder='1-3,5'></div>
        <div class='opt-row'><label>${t('rdRegion')}</label>
          <div class='seg' data-opt='region'><input type='hidden' value='full'>
            <button type='button' data-val='full' class='on'>${t('rdFull')}</button>
            <button type='button' data-val='top'>${t('rdTop')}</button>
            <button type='button' data-val='bot'>${t('rdBot')}</button></div></div>
        <div class='opt-row'><label>${t('rdColor')}</label>
          <div class='seg' data-opt='color'><input type='hidden' value='#000000'>
            <button type='button' data-val='#000000' class='on'>${t('rdBlack')}</button>
            <button type='button' data-val='#ffffff'>${t('rdWhite')}</button></div></div>`,
      run: async (files, get, prog) => {
        prog(6, t('progReading'));
        const doc = await PDFLib.PDFDocument.load(await readBytes(files[0]), { ignoreEncryption: true });
        const n = doc.getPageCount();
        const pages = parseRange(get('pages') || 'all', n);
        if (!pages.length) return { downloads: [], info: t('rdErr') };
        const region = get('region') || 'full';
        const rgb = hexToRgb(get('color') || '#000000');
        const c = PDFLib.rgb(rgb.r/255, rgb.g/255, rgb.b/255);
        pages.forEach((pi, idx) => {
          if (pi < 1 || pi > n) return;
          prog(8 + Math.round(idx/pages.length*88), t('rdProg', pi, n));
          const p = doc.getPage(pi - 1);
          const { width, height } = p.getSize();
          let rect;
          if (region === 'top') rect = { x: 0, y: height*0.66, width, height: height*0.34 };
          else if (region === 'bot') rect = { x: 0, y: 0, width, height: height*0.34 };
          else rect = { x: 0, y: 0, width, height };
          p.drawRectangle({ ...rect, color: c });
        });
        const b = await doc.save();
        return { downloads: [{ name: 'redacted.pdf', bytes: b, mime: 'application/pdf' }], info: t('rdDone', pages.length) };
      }
    },
    {
      id: 'fontlist', icon: 'fontlist', accept: 'application/pdf', multiple: false,
      opts: () => `<div class='opt-row'><label style='color:var(--muted);font-size:13px'>${t('flNote')}</label></div>`,
      run: async (files, get, prog) => {
        prog(6, t('progReading'));
        const doc = await PDFLib.PDFDocument.load(await readBytes(files[0]), { ignoreEncryption: true });
        const n = doc.getPageCount();
        const set = new Map();
        for (let i = 0; i < n; i++) {
          prog(8 + Math.round(i/n*86), t('flProg', i+1, n));
          const p = doc.getPage(i);
          const res = p.node.Resources();
          if (!res) continue;
          const fonts = res.lookup(PDFLib.PDFName.of('Font'), PDFLib.PDFDict);
          if (!fonts) continue;
          fonts.entries().forEach((kv) => {
            const f = doc.context.lookup(kv[1]);
            if (!f) return;
            let name = '?', sub = '?';
            try {
              const base = f.get(PDFLib.PDFName.of('BaseFont'));
              if (base) name = (base.asString ? base.asString() : String(base).replace(/^\//, '')) || '?';
              const st = f.get(PDFLib.PDFName.of('Subtype'));
              if (st) sub = (st.asString ? st.asString() : String(st).replace(/^\//, '')) || '?';
            } catch (e) {}
            const key = name + '  /  ' + sub;
            set.set(key, (set.get(key) || 0) + 1);
          });
        }
        const lines = [t('flHead', set.size)];
        for (const [k, cnt] of set) lines.push('- ' + k + '  (×' + cnt + ')');
        if (!set.size) lines.push(t('flNone'));
        const txt = lines.join('\n');
        return { downloads: [{ name: 'fonts.txt', bytes: new TextEncoder().encode(txt), mime: 'text/plain' }], info: t('flDone', set.size), copyText: txt };
      }
    },
    {
      id: 'pagesizes', icon: 'pagesizes', accept: 'application/pdf', multiple: false,
      opts: () => `<div class='opt-row'><label style='color:var(--muted);font-size:13px'>${t('pszNote')}</label></div>`,
      run: async (files, get, prog) => {
        prog(6, t('progReading'));
        const doc = await PDFLib.PDFDocument.load(await readBytes(files[0]), { ignoreEncryption: true });
        const n = doc.getPageCount();
        const isoName = (w, h) => {
          const mmw = Math.round(w / 72 * 25.4), mmh = Math.round(h / 72 * 25.4);
          const tbl = [[210,297,'A4'],[297,420,'A3'],[148,210,'A5'],[216,279,'Letter'],[216,356,'Legal']];
          for (const [a, b, nm] of tbl) {
            if (Math.abs(mmw - a) <= 2 && Math.abs(mmh - b) <= 2) return nm;
            if (Math.abs(mmw - b) <= 2 && Math.abs(mmh - a) <= 2) return nm + '（横向）';
          }
          return mmw + '×' + mmh + 'mm';
        };
        const lines = [t('pszHead', n)];
        for (let i = 0; i < n; i++) {
          prog(8 + Math.round(i/n*86), t('pszProg', i+1, n));
          const { width, height } = doc.getPage(i).getSize();
          lines.push(t('pszRow', i+1, Math.round(width), Math.round(height), isoName(width, height)));
        }
        const txt = lines.join('\n');
        return { downloads: [{ name: 'page-sizes.txt', bytes: new TextEncoder().encode(txt), mime: 'text/plain' }], info: t('pszDone', n), copyText: txt };
      }
    },
    {
      id: 'removemeta', icon: 'removemeta', accept: 'application/pdf', multiple: false,
      opts: () => `
        <div class='opt-row'><label>${t('rm2Mode')}</label>
          <div class='seg' data-opt='mode'><input type='hidden' value='fields'>
            <button type='button' data-val='fields' class='on'>${t('rm2Fields')}</button>
            <button type='button' data-val='all'>${t('rm2All')}</button></div></div>
        <div class='opt-row'><label style='color:var(--muted);font-size:13px'>${t('rm2Note')}</label></div>`,
      run: async (files, get, prog) => {
        prog(6, t('progReading'));
        const doc = await PDFLib.PDFDocument.load(await readBytes(files[0]), { ignoreEncryption: true });
        const cat = doc.catalog;
        if (cat.get(PDFLib.PDFName.of('Metadata'))) cat.delete(PDFLib.PDFName.of('Metadata'));
        const mode = get('mode') || 'fields';
        const infoRef = cat.get(PDFLib.PDFName.of('Info'));
        if (mode === 'all') {
          if (infoRef) cat.delete(PDFLib.PDFName.of('Info'));
        } else if (infoRef) {
          const d = doc.context.lookup(infoRef);
          if (d && d instanceof PDFLib.PDFDict) {
            [PDFLib.PDFName.of('Title'),PDFLib.PDFName.of('Author'),PDFLib.PDFName.of('Subject'),PDFLib.PDFName.of('Keywords'),PDFLib.PDFName.of('Creator'),PDFLib.PDFName.of('Producer')].forEach((k)=>{ if (d.get(k)) d.delete(k); });
          }
        }
        const b = await doc.save();
        return { downloads: [{ name: 'no-metadata.pdf', bytes: b, mime: 'application/pdf' }], info: t('rm2Done', mode === 'all' ? t('rm2All') : t('rm2Fields')) };
      }
    },
    {
      id: 'datestamp', icon: 'datestamp', accept: 'application/pdf', multiple: false,
      opts: () => `
        <div class='opt-row'><label>${t('dsText')}</label><input class='field' type='text' data-opt='text' value='${new Date().toISOString().slice(0,10)}'></div>
        <div class='opt-row'><label>${t('dsPos')}</label>
          <div class='seg' data-opt='pos'><input type='hidden' value='br'>
            <button type='button' data-val='tl'>${t('posTL')}</button>
            <button type='button' data-val='tr'>${t('posTR')}</button>
            <button type='button' data-val='bl'>${t('posBL')}</button>
            <button type='button' data-val='br' class='on'>${t('posBR')}</button></div></div>
        <div class='opt-row'><label style='color:var(--muted);font-size:13px'>${t('dsNote')}</label></div>`,
      run: async (files, get, prog) => {
        prog(6, t('progReading'));
        const doc = await PDFLib.PDFDocument.load(await readBytes(files[0]), { ignoreEncryption: true });
        const text = (get('text') || '').trim();
        if (!text) return { downloads: [], info: t('dsNeed') };
        const cjk = hasCJK(text);
        const font = cjk ? null : await doc.embedFont(PDFLib.StandardFonts.Helvetica);
        let cjkImg = null, cjkW = 0, cjkH = 0, cjkDim = null;
        if (cjk) {
          const png = await cjkTextPngBytes(text, { size: 11, color: '#33333a', bold: true, pad: 3 });
          cjkImg = await doc.embedPng(png.bytes);
          cjkDim = { w: png.w, h: png.h };
          cjkW = png.w + 8; cjkH = png.h + 6;
        }
        const pos = get('pos') || 'br';
        const n = doc.getPageCount();
        const M = 22, pad = 4, size = 11;
        for (let i = 0; i < n; i++) {
          prog(8 + Math.round(i/n*88), t('dsProg', i+1, n));
          const p = doc.getPage(i);
          const W = p.getWidth(), H = p.getHeight();
          const tw = cjk ? cjkW : font.widthOfTextAtSize(text, size) + pad*2;
          const th = cjk ? cjkH : size + pad*2;
          let x = M, y = M;
          if (pos[1] === 'r') x = W - tw - M;
          if (pos[0] === 't') y = H - th - M;
          p.drawRectangle({ x, y, width: tw, height: th, color: PDFLib.rgb(0.96,0.96,0.98), borderWidth: 0.5, borderColor: PDFLib.rgb(0.8,0.8,0.85) });
          if (cjk) p.drawImage(cjkImg, { x: x + 4, y: y + 3, width: cjkDim.w, height: cjkDim.h });
          else p.drawText(text, { x: x + pad, y: y + pad, size, font, color: PDFLib.rgb(0.2,0.2,0.25) });
        }
        const b = await doc.save();
        return { downloads: [{ name: 'dated.pdf', bytes: b, mime: 'application/pdf' }], info: t('dsDone', n) };
      }
    },
    /* ---- 新增：表单扁平化 ---- */
    {
      id: 'flatten', icon: 'flatten', accept: 'application/pdf', multiple: false,
      opts: () => `
        <div class='opt-row'><label style="color:var(--muted);font-size:13px">${t('flNote')}</label></div>
        <div class='opt-row'><label>${t('flKeep')}</label>
          <div class='seg' data-opt='keep'><input type='hidden' value='remove'>
            <button type='button' data-val='remove' class='on'>${t('flRemove')}</button>
            <button type='button' data-val='keep'>${t('flKeepWidgets')}</button></div></div>`,
      run: async (files, get, prog) => {
        prog(6, t('progReading'));
        const doc = await PDFLib.PDFDocument.load(await readBytes(files[0]), { ignoreEncryption: true });
        const ctx = doc.context;
        const catalog = doc.catalog;
        const font = await doc.embedFont(PDFLib.StandardFonts.Helvetica);
        const pages = doc.getPages();
        let count = 0;
        const decodeVal = (v) => {
          if (!v) return '';
          try { if (v.decodeText) return v.decodeText(); if (v.asString) return v.asString(); } catch (e) {}
          return '';
        };
        for (let pi = 0; pi < pages.length; pi++) {
          prog(8 + Math.round((pi / pages.length) * 80), t('flProg', pi + 1, pages.length));
          const page = pages[pi];
          const annots = page.node.lookupMaybe(PDFLib.PDFName.of('Annots'), PDFLib.PDFArray);
          if (!annots) continue;
          const keep = [];
          for (const ref of annots.asArray()) {
            const a = ctx.lookup(ref);
            if (!a || !(a instanceof PDFLib.PDFDict)) { keep.push(ref); continue; }
            const sub = a.lookupMaybe(PDFLib.PDFName.of('Subtype'), PDFLib.PDFName);
            if (!sub || sub !== PDFLib.PDFName.of('Widget')) { keep.push(ref); continue; }
            const field = a.lookupMaybe(PDFLib.PDFName.of('Parent'), PDFLib.PDFDict);
            const ft = field ? field.lookupMaybe(PDFLib.PDFName.of('FT'), PDFLib.PDFName) : null;
            const rect = a.lookupMaybe(PDFLib.PDFName.of('Rect'), PDFLib.PDFArray);
            let text = '';
            if (field) {
              if (ft === PDFLib.PDFName.of('Tx') || ft === PDFLib.PDFName.of('Ch')) {
                text = decodeVal(field.lookupMaybe(PDFLib.PDFName.of('V'), null));
              } else if (ft === PDFLib.PDFName.of('Btn')) {
                const as = a.lookupMaybe(PDFLib.PDFName.of('AS'), PDFLib.PDFName);
                if (as && as !== PDFLib.PDFName.of('Off')) { text = 'X'; }
              }
            }
            if (rect && text) {
              const r = rect.asArray().map((n) => (n instanceof PDFLib.PDFNumber ? n.value : Number(n)));
              const x1 = r[0], y1 = r[1], x2 = r[2], y2 = r[3];
              const h = y2 - y1;
              const size = Math.max(6, Math.min(h * 0.62, 13));
              page.drawText(text, { x: x1 + 2, y: y1 + Math.max(2, h * 0.22), size, font, color: PDFLib.rgb(0, 0, 0) });
              count++;
            }
            if (get('keep') !== 'keep') { /* drop widget (flatten) */ } else { keep.push(ref); }
          }
          if (keep.length) page.node.set(PDFLib.PDFName.of('Annots'), PDFLib.PDFArray.fromArray(keep, ctx));
          else page.node.delete(PDFLib.PDFName.of('Annots'));
        }
        catalog.delete(PDFLib.PDFName.of('AcroForm'));
        const b = await doc.save();
        return { downloads: [{ name: 'flattened.pdf', bytes: b, mime: 'application/pdf' }], info: t('flDone', count) };
      }
    },
    /* ---- 新增：嵌入附件 ---- */
    {
      id: 'embed', icon: 'embed',
      sources: [
        { role: 'main', label: t('emPdf'), accept: 'application/pdf', multiple: false },
        { role: 'att', label: t('emFile'), accept: '*/*', multiple: false }
      ],
      opts: () => `<div class='opt-row'><label style="color:var(--muted);font-size:13px">${t('emNote')}</label></div>`,
      run: async (src, get, prog) => {
        if (!src.att || !src.att.length) return { downloads: [], info: t('emNeed') };
        prog(6, t('progReading'));
        const doc = await PDFLib.PDFDocument.load(await readBytes(src.main[0]), { ignoreEncryption: true });
        const ctx = doc.context;
        const attBytes = await readBytes(src.att[0]);
        const name = src.att[0].name || 'attachment.bin';
        const streamDict = PDFLib.PDFDict.withContext(ctx);
        streamDict.set(PDFLib.PDFName.of('Type'), PDFLib.PDFName.of('EmbeddedFile'));
        const streamRef = ctx.register(PDFLib.PDFRawStream.of(streamDict, attBytes));
        const fs = PDFLib.PDFDict.withContext(ctx);
        fs.set(PDFLib.PDFName.of('Type'), PDFLib.PDFName.of('Filespec'));
        fs.set(PDFLib.PDFName.of('F'), PDFLib.PDFString.of(name));
        fs.set(PDFLib.PDFName.of('UF'), PDFLib.PDFString.of(name));
        fs.set(PDFLib.PDFName.of('EF'), ctx.obj({ F: streamRef, UF: streamRef }));
        const fsRef = ctx.register(fs);
        let names = doc.catalog.lookupMaybe(PDFLib.PDFName.of('Names'), PDFLib.PDFDict);
        if (!names) { names = PDFLib.PDFDict.withContext(ctx); doc.catalog.set(PDFLib.PDFName.of('Names'), ctx.register(names)); }
        let ef = names.lookupMaybe(PDFLib.PDFName.of('EmbeddedFiles'), PDFLib.PDFDict);
        if (!ef) { ef = PDFLib.PDFDict.withContext(ctx); names.set(PDFLib.PDFName.of('EmbeddedFiles'), ctx.register(ef)); }
        let efNames = ef.lookupMaybe(PDFLib.PDFName.of('Names'), PDFLib.PDFArray);
        if (!efNames) { efNames = PDFLib.PDFArray.withContext(ctx); ef.set(PDFLib.PDFName.of('Names'), efNames); }
        efNames.push(PDFLib.PDFString.of(name));
        efNames.push(fsRef);
        const b = await doc.save();
        return { downloads: [{ name: 'with-attachment.pdf', bytes: b, mime: 'application/pdf' }], info: t('emDone', name) };
      }
    },
    /* ---- 新增：生成书签 ---- */
    {
      id: 'mkbm', icon: 'mkbm', accept: 'application/pdf', multiple: false,
      opts: () => `
        <div class='opt-row'><label style="color:var(--muted);font-size:13px">${t('bmFmt')}</label></div>
        <textarea class='field' data-opt='spec' rows='8' placeholder='1 封面&#10;2 第一章&#10;  2.1 概述&#10;3 第二章'>1 封面&#10;2 引言&#10;3 正文&#10;  3.1 背景&#10;  3.2 方法</textarea>
        <div class='opt-row'><label style="color:var(--muted);font-size:13px">${t('bmNote')}</label></div>`,
      run: async (files, get, prog) => {
        const spec = (get('spec') || '').replace(/\r/g, '');
        const lines = spec.split('\n').filter((l) => l.trim().length);
        if (!lines.length) return { downloads: [], info: t('bmNeed') };
        prog(6, t('progReading'));
        const doc = await PDFLib.PDFDocument.load(await readBytes(files[0]), { ignoreEncryption: true });
        const ctx = doc.context;
        const pages = doc.getPages();
        const root = PDFLib.PDFDict.withContext(ctx);
        root.set(PDFLib.PDFName.of('Type'), PDFLib.PDFName.of('Outlines'));
        const rootRef = ctx.register(root);
        doc.catalog.set(PDFLib.PDFName.of('Outlines'), rootRef);
        const stack = [rootRef];
        let count = 0;
        for (const line of lines) {
          const m = line.match(/^(\s*)(\d+)\s+(.*)$/);
          if (!m) continue;
          const indent = m[1].replace(/\t/g, '  ').length;
          const level = Math.floor(indent / 2);
          const pageNo = parseInt(m[2], 10) - 1;
          const title = m[3].trim();
          if (pageNo < 0 || pageNo >= pages.length) continue;
          const parentRef = stack[Math.min(level, stack.length - 1)] || rootRef;
          const item = PDFLib.PDFDict.withContext(ctx);
          item.set(PDFLib.PDFName.of('Title'), PDFLib.PDFString.of(title));
          item.set(PDFLib.PDFName.of('Parent'), parentRef);
          item.set(PDFLib.PDFName.of('Dest'), ctx.obj([pages[pageNo].ref, PDFLib.PDFName.of('Fit')]));
          const itemRef = ctx.register(item);
          const parent = ctx.lookup(parentRef);
          if (!parent.lookupMaybe(PDFLib.PDFName.of('First'), null)) {
            parent.set(PDFLib.PDFName.of('First'), itemRef);
            parent.set(PDFLib.PDFName.of('Last'), itemRef);
          } else {
            const prevRef = parent.lookup(PDFLib.PDFName.of('Last'));
            ctx.lookup(prevRef).set(PDFLib.PDFName.of('Next'), itemRef);
            item.set(PDFLib.PDFName.of('Prev'), prevRef);
            parent.set(PDFLib.PDFName.of('Last'), itemRef);
          }
          stack[level] = itemRef;
          stack.length = level + 1;
          count++;
        }
        if (!count) return { downloads: [], info: t('bmNeed') };
        const b = await doc.save();
        return { downloads: [{ name: 'with-bookmarks.pdf', bytes: b, mime: 'application/pdf' }], info: t('bmDone', count) };
      }
    },
    /* ---- 新增：OCR 搜索型 PDF ---- */
    {
      id: 'ocrpdf', icon: 'ocrpdf', accept: 'application/pdf', multiple: false,
      opts: () => `
        <div class="opt-row"><label>${t('ocrLang')}</label>
          <div class="seg" data-opt="lang"><input type="hidden" value="chi_sim+eng">
            <button type="button" data-val="chi_sim+eng" class="on">${t('ocrLangZhEn')}</button>
            <button type="button" data-val="chi_sim">${t('ocrLangZh')}</button>
            <button type="button" data-val="eng">${t('ocrLangEn')}</button></div></div>
        <div class="opt-row"><label style="color:var(--muted);font-size:13px">${t('ocrpdfNote')}</label></div>`,
      run: async (files, get, prog) => {
        if (typeof Tesseract === 'undefined') throw new Error(t('errOcrEngine'));
        const lang = get('lang') || 'chi_sim+eng';
        const SC = 2;
        const TESS = new URL('vendor/tesseract/', location.href).href;
        const coreFile = (await simdSupported()) ? 'tesseract-core-simd-lstm.wasm.js' : 'tesseract-core-lstm.wasm.js';
        prog(4, t('progOcrEngine'));
        const worker = await Tesseract.createWorker(lang, 1, {
          workerPath: TESS + 'worker.min.js',
          corePath: TESS + coreFile,
          langPath: TESS + 'lang/',
          logger: (m) => { if (m && m.status === 'recognizing text' && typeof m.progress === 'number') prog(30 + m.progress * 58, t('progOcrPage', Math.round(m.progress * 100))); }
        });
        try {
          pdfjsLib.GlobalWorkerOptions.workerSrc = 'vendor/pdf.worker.min.js';
          const bytes = await readBytes(files[0]);
          const doc = await pdfjsLib.getDocument({ data: bytes.slice(0) }).promise;
          const out = await PDFLib.PDFDocument.create();
          const font = await out.embedFont(PDFLib.StandardFonts.Helvetica);
          for (let i = 1; i <= doc.numPages; i++) {
            prog(6 + Math.round((i / doc.numPages) * 22), t('ocrpdfProg', i, doc.numPages));
            const page = await doc.getPage(i);
            const vp = page.getViewport({ scale: SC });
            const canvas = document.createElement('canvas');
            canvas.width = Math.ceil(vp.width); canvas.height = Math.ceil(vp.height);
            await page.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise;
            const pw = vp.width / SC, ph = vp.height / SC;
            const np = out.addPage([pw, ph]);
            const pngBin = atob(canvas.toDataURL('image/png').split(',')[1]);
            const png = new Uint8Array(pngBin.length);
            for (let j = 0; j < pngBin.length; j++) png[j] = pngBin.charCodeAt(j);
            const img = await out.embedPng(png);
            np.drawImage(img, { x: 0, y: 0, width: pw, height: ph });
            const { data } = await worker.recognize(canvas);
            const words = data.words || [];
            for (const w of words) {
              const txt = (w.text || '').trim();
              if (!txt) continue;
              try {
                const x0 = w.bbox.x0 / SC, yBot = w.bbox.y1 / SC;
                const size = (w.bbox.y1 - w.bbox.y0) / SC;
                if (!(size > 0) || size > 220) continue;
                np.drawText(txt, { x: x0, y: ph - yBot, size: size, font, color: PDFLib.rgb(0, 0, 0), opacity: 0 });
              } catch (e) { /* 跳过无法用 Helvetica 编码的文字（如中文） */ }
            }
          }
          const b = await out.save();
          return { downloads: [{ name: 'searchable.pdf', bytes: b, mime: 'application/pdf' }], info: t('ocrpdfDone', doc.numPages) };
        } finally {
          await worker.terminate();
        }
      }
    },
    /* ---- 新增：PDF 转 HTML ---- */
    {
      id: 'pdf2html', icon: 'pdf2html', accept: 'application/pdf', multiple: false,
      opts: () => `<div class="opt-row"><label style="color:var(--muted);font-size:13px">${t('p2hNote')}</label></div>`,
      run: async (files, get, prog) => {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'vendor/pdf.worker.min.js';
        prog(4, t('progOcrEngine'));
        const bytes = await readBytes(files[0]);
        const doc = await pdfjsLib.getDocument({ data: bytes.slice(0) }).promise;
        let body = '';
        for (let i = 1; i <= doc.numPages; i++) {
          prog(6 + Math.round((i / doc.numPages) * 88), t('p2hProg', i, doc.numPages));
          const page = await doc.getPage(i);
          const tc = await page.getTextContent();
          let text = '';
          for (const it of tc.items) { text += it.str; if (it.hasEOL) text += '\n'; }
          body += '<section class="page"><h2>Page ' + i + '</h2><p>' + escapeHtml(text) + '</p></section>\n';
        }
        const html = '<!doctype html><html lang="zh"><head><meta charset="utf-8"><title>' + escapeHtml(t('p2hTitle')) + '</title><style>body{font-family:-apple-system,\'Segoe UI\',\'Microsoft YaHei\',sans-serif;max-width:860px;margin:32px auto;padding:0 20px;color:#1f2937;line-height:1.7}.page{border-bottom:1px solid #e5e7eb;padding:18px 0;margin-bottom:18px}.page h2{font-size:15px;color:#6b7280;margin:0 0 10px}</style></head><body>\n' + body + '</body></html>';
        const b = new TextEncoder().encode(html);
        return { downloads: [{ name: 'export.html', bytes: b, mime: 'text/html' }], info: t('p2hDone', doc.numPages), copyText: html };
      }
    },
    /* ---- 新增：合并统一尺寸 ---- */
    {
      id: 'unify', icon: 'unify', accept: 'application/pdf', multiple: true,
      opts: () => `
        <div class="opt-row"><label>${t('psTarget')}</label>
          <div class="seg" data-opt="size"><input type="hidden" value="a4">
            <button type="button" data-val="a4" class="on">A4</button>
            <button type="button" data-val="a3">A3</button>
            <button type="button" data-val="a5">A5</button>
            <button type="button" data-val="letter">Letter</button>
            <button type="button" data-val="legal">Legal</button></div></div>
        <div class="opt-row"><label>${t('psMode')}</label>
          <div class="seg" data-opt="mode"><input type="hidden" value="contain">
            <button type="button" data-val="contain" class="on">${t('psContain')}</button>
            <button type="button" data-val="center">${t('psCenter')}</button></div></div>`,
      run: async (files, get, prog) => {
        prog(6, t('progReading'));
        const DIMS = { a4: [595.28, 841.89], a3: [841.89, 1190.55], a5: [419.53, 595.28], letter: [612, 792], legal: [612, 1008] };
        const key = get('size') || 'a4';
        const tgt = DIMS[key] || DIMS.a4;
        const mode = get('mode') || 'contain';
        const out = await PDFLib.PDFDocument.create();
        let done = 0, pc = 0;
        for (const f of files) {
          const bytes = await readBytes(f);
          const doc = await PDFLib.PDFDocument.load(bytes, { ignoreEncryption: true });
          const pages = doc.getPages();
          for (let i = 0; i < pages.length; i++) {
            prog(6 + Math.round((done / files.length) * 86), t('unProg', done + 1, files.length));
            const pg = pages[i]; const w = pg.getWidth(), h = pg.getHeight();
            const np = out.addPage([tgt[0], tgt[1]]);
            const emb = await out.embedPage(pg);
            if (mode === 'center') np.drawPage(emb, { x: (tgt[0] - w) / 2, y: (tgt[1] - h) / 2, width: w, height: h });
            else { const s = Math.min(tgt[0] / w, tgt[1] / h); np.drawPage(emb, { x: (tgt[0] - w * s) / 2, y: (tgt[1] - h * s) / 2, width: w * s, height: h * s }); }
            pc++;
          }
          done++;
        }
        const b = await out.save();
        const name = { a4: 'A4', a3: 'A3', a5: 'A5', letter: 'Letter', legal: 'Legal' }[key];
        return { downloads: [{ name: 'unified.pdf', bytes: b, mime: 'application/pdf' }], info: t('unDone', name, pc) };
      }
    },
    /* ---- 新增：中文水印 ---- */
    {
      id: 'wmcn', icon: 'wmcn', accept: 'application/pdf', multiple: false,
      opts: () => `
        <div class="opt-row"><label>${t('wmcnText')}</label><input class="field" data-opt="text" value="${t('wmcnDefault')}"></div>
        <div class="opt-row"><label>${t('wmcnColor')}</label>
          <div class="seg" data-opt="color"><input type="hidden" value="#999999">
            <button type="button" data-val="#999999" class="on">${t('wmcnGray')}</button>
            <button type="button" data-val="#dc2626">${t('wmcnRed')}</button>
            <button type="button" data-val="#2563eb">${t('wmcnBlue')}</button></div></div>
        <div class="opt-row"><label>${t('wmcnSize')} <span class="range-val" id="wmcnSize_val">48</span></label>
          <input type="range" min="20" max="120" step="4" value="48" data-opt="size" id="wmcnSize"></div>
        <div class="opt-row"><label>${t('wmcnAngle')} <span class="range-val" id="wmcnAngle_val">-30</span>°</label>
          <input type="range" min="-60" max="60" step="5" value="-30" data-opt="angle" id="wmcnAngle"></div>
        <div class="opt-row"><label>${t('wmcnMode')}</label>
          <div class="seg" data-opt="mode"><input type="hidden" value="tile">
            <button type="button" data-val="tile" class="on">${t('wmcnTile')}</button>
            <button type="button" data-val="center">${t('wmcnCenter')}</button></div></div>
        <div class="opt-row"><label>${t('wmcnOpacity')}</label>
          <div class="seg" data-opt="op"><input type="hidden" value="0.18">
            <button type="button" data-val="0.12">${t('wmcnLight')}</button>
            <button type="button" data-val="0.18" class="on">${t('wmcnMid')}</button>
            <button type="button" data-val="0.3">${t('wmcnStrong')}</button></div></div>
        <div class="opt-row"><label style="color:var(--muted);font-size:13px">${t('wmcnNote')}</label></div>`,
      run: async (files, get, prog) => {
        await ensureExt();
        prog(8, t('progFont'));
        const bytes = await readBytes(files[0]);
        const src = await PDFLib.PDFDocument.load(bytes, { ignoreEncryption: true });
        const text = (get('text') || '').trim();
        if (!text) return { downloads: [], info: t('wmcnNeed') };
        const color = get('color') || '#999999';
        const size = +get('size') || 48;
        const angle = +get('angle') || -30;
        const mode = get('mode') || 'tile';
        const op = Math.max(0.05, Math.min(0.6, parseFloat(get('op')) || 0.18));
        const TileW = 460, TileH = 230;
        const wrap = document.createElement('div');
        wrap.style.cssText = 'position:fixed;left:-99999px;top:0;width:' + TileW + 'px;height:' + TileH + 'px;display:flex;align-items:center;justify-content:center;background:transparent;overflow:hidden;';
        wrap.innerHTML = '<div style="transform:rotate(' + angle + 'deg);color:' + color + ';font-size:' + size + 'px;font-weight:700;font-family:-apple-system,\'Segoe UI\',\'Microsoft YaHei\',sans-serif;white-space:nowrap;">' + escapeHtml(text) + '</div>';
        document.body.appendChild(wrap);
        let cv;
        try { cv = await html2canvas(wrap.firstElementChild, { scale: 1, backgroundColor: null, logging: false }); }
        finally { document.body.removeChild(wrap); }
        const wmBin = atob(cv.toDataURL('image/png').split(',')[1]);
        const wm = new Uint8Array(wmBin.length);
        for (let j = 0; j < wmBin.length; j++) wm[j] = wmBin.charCodeAt(j);
        const out = await PDFLib.PDFDocument.create();
        const wmImg = await out.embedPng(wm);
        const pages = src.getPages();
        const n = pages.length;
        for (let i = 0; i < n; i++) {
          prog(8 + Math.round((i / n) * 86), t('wmcnProg', i + 1, n));
          const pg = pages[i]; const w = pg.getWidth(), h = pg.getHeight();
          const np = out.addPage([w, h]);
          const emb = await out.embedPage(pg);
          np.drawPage(emb, { x: 0, y: 0, width: w, height: h });
          if (mode === 'center') {
            const sc = Math.min(w / TileW, h / TileH) * 1.4;
            np.drawImage(wmImg, { x: (w - TileW * sc) / 2, y: (h - TileH * sc) / 2, width: TileW * sc, height: TileH * sc, opacity: op });
          } else {
            const tw = TileW * 0.9, th = TileH * 0.9;
            for (let x = -tw; x < w + tw; x += tw) for (let y = -th; y < h + th; y += th) np.drawImage(wmImg, { x, y, width: tw, height: th, opacity: op });
          }
        }
        const b = await out.save();
        return { downloads: [{ name: 'cn-watermarked.pdf', bytes: b, mime: 'application/pdf' }], info: t('wmcnDone', n) };
      }
    },
    /* ---- 新增：书签导出 Markdown ---- */
    {
      id: 'bm2md', icon: 'bm2md', accept: 'application/pdf', multiple: false,
      opts: () => `<div class="opt-row"><label style="color:var(--muted);font-size:13px">${t('bm2mdNote')}</label></div>`,
      run: async (files, get, prog) => {
        prog(15, t('progReading'));
        const bytes = await readBytes(files[0]);
        const doc = await PDFLib.PDFDocument.load(bytes, { ignoreEncryption: true });
        const ctx = doc.context;
        const root = doc.catalog.lookupMaybe(PDFLib.PDFName.of('Outlines'), PDFLib.PDFDict);
        if (!root) return { downloads: [], info: t('bm2mdNone') };
        const pages = doc.getPages();
        const resolvePage = (node) => {
          let dest = node.lookupMaybe(PDFLib.PDFName.of('Dest'));
          if (!dest) { const A = node.lookupMaybe(PDFLib.PDFName.of('A'), PDFLib.PDFDict); if (A) dest = A.lookupMaybe(PDFLib.PDFName.of('D')); }
          if (!dest) return null;
          let arr = dest; if (dest instanceof PDFLib.PDFRef) arr = ctx.lookup(dest);
          if (!arr || !arr.lookup) return null;
          const p = arr.lookup(0); if (!p) return null;
          const pd = (p instanceof PDFLib.PDFRef) ? ctx.lookup(p) : p;
          if (!pd) return null;
          for (let i = 0; i < pages.length; i++) if (pages[i].node === pd) return i + 1;
          return null;
        };
        let md = '# ' + t('bm2mdTitle') + '\n\n';
        const walk = (node, depth) => {
          let cur = node.lookupMaybe(PDFLib.PDFName.of('First'), PDFLib.PDFDict);
          while (cur) {
            if (cur instanceof PDFLib.PDFRef) cur = ctx.lookup(cur);
            if (!cur || !cur.lookupMaybe) break;
            const title = cur.lookupMaybe(PDFLib.PDFName.of('Title'), PDFLib.PDFString);
            const ttl = title ? title.decode() : '(untitled)';
            const pg = resolvePage(cur);
            const hashes = '#'.repeat(Math.min(depth + 1, 6));
            md += hashes + ' ' + ttl + (pg ? ('  （第 ' + pg + ' 页）') : '') + '\n';
            walk(cur, depth + 1);
            cur = cur.lookupMaybe(PDFLib.PDFName.of('Next'), PDFLib.PDFDict);
          }
        };
        walk(root, 0);
        const b = new TextEncoder().encode(md);
        return { downloads: [{ name: 'bookmarks.md', bytes: b, mime: 'text/markdown' }], info: t('bm2mdDone', (md.match(/^#/gm) || []).length), copyText: md };
      }
    },
    /* ---- 新增：自定义尺寸 ---- */
    {
      id: 'resize2', icon: 'resize2', accept: 'application/pdf', multiple: false,
      opts: () => `
        <div class="opt-row"><label>${t('r2W')}</label><input class="field" type="number" data-opt="w" value="210" min="10" max="1000" step="1"></div>
        <div class="opt-row"><label>${t('r2H')}</label><input class="field" type="number" data-opt="h" value="297" min="10" max="1000" step="1"></div>
        <div class="opt-row"><label>${t('psMode')}</label>
          <div class="seg" data-opt="mode"><input type="hidden" value="contain">
            <button type="button" data-val="contain" class="on">${t('psContain')}</button>
            <button type="button" data-val="center">${t('psCenter')}</button></div></div>`,
      run: async (files, get, prog) => {
        const wmm = parseFloat(get('w')), hmm = parseFloat(get('h'));
        if (!(wmm > 0) || !(hmm > 0)) return { downloads: [], info: t('r2Need') };
        const tgt = [wmm * 72 / 25.4, hmm * 72 / 25.4];
        const mode = get('mode') || 'contain';
        prog(6, t('progReading'));
        const doc = await PDFLib.PDFDocument.load(await readBytes(files[0]), { ignoreEncryption: true });
        const out = await PDFLib.PDFDocument.create();
        const pages = doc.getPages();
        for (let i = 0; i < pages.length; i++) {
          prog(8 + Math.round((i / pages.length) * 86), t('r2Prog', i + 1, pages.length));
          const pg = pages[i]; const w = pg.getWidth(), h = pg.getHeight();
          const np = out.addPage([tgt[0], tgt[1]]);
          const emb = await out.embedPage(pg);
          if (mode === 'center') np.drawPage(emb, { x: (tgt[0] - w) / 2, y: (tgt[1] - h) / 2, width: w, height: h });
          else { const s = Math.min(tgt[0] / w, tgt[1] / h); np.drawPage(emb, { x: (tgt[0] - w * s) / 2, y: (tgt[1] - h * s) / 2, width: w * s, height: h * s }); }
        }
        const b = await out.save();
        return { downloads: [{ name: 'resized.pdf', bytes: b, mime: 'application/pdf' }], info: t('r2Done', wmm, hmm, pages.length) };
      }
    },
    /* ---- 新增：填写表单 ---- */
    {
      id: 'formfill', icon: 'formfill',
      sources: [
        { role: 'main', label: t('ffPdf'), accept: 'application/pdf', multiple: false },
        { role: 'json', label: t('ffJsonFile'), accept: 'application/json,.json', multiple: false }
      ],
      opts: () => `<div class="opt-row"><label style="color:var(--muted);font-size:13px">${t('ffNote')}</label></div>`,
      run: async (src, get, prog) => {
        if (!src || !src.main || !src.main.length || !src.json || !src.json.length) return { downloads: [], info: t('ffNeed') };
        prog(10, t('progReading'));
        let map;
        try { map = JSON.parse(await src.json[0].text()); } catch (e) { return { downloads: [], info: t('ffJson') }; }
        const doc = await PDFLib.PDFDocument.load(await readBytes(src.main[0]), { ignoreEncryption: true });
        let form; try { form = doc.getForm(); } catch (e) { form = null; }
        if (!form) return { downloads: [], info: t('formNone') };
        const fields = form.getFields();
        if (!fields.length) return { downloads: [], info: t('formNone') };
        let done = 0;
        for (const f of fields) {
          const name = (() => { try { return f.getName(); } catch (e) { return ''; } })();
          if (!name || !(name in map)) continue;
          const v = map[name];
          try {
            if (f instanceof PDFLib.PDFTextField) { f.setText(String(v)); done++; }
            else if (f instanceof PDFLib.PDFCheckBox) {
              if (v === true || v === 'true' || v === 'checked' || v === 1 || v === '1' || v === 'on') f.check(); else f.uncheck(); done++;
            } else if (f instanceof PDFLib.PDFRadioGroup) { try { f.select(String(v)); done++; } catch (e) {} }
            else if (f instanceof PDFLib.PDFDropdown) { try { f.select(String(v)); done++; } catch (e) {} }
            else if (f instanceof PDFLib.PDFOptionList) { try { f.select([].concat(v)); done++; } catch (e) {} }
          } catch (e) {}
        }
        const b = await doc.save();
        return { downloads: [{ name: 'filled.pdf', bytes: b, mime: 'application/pdf' }], info: t('ffDone', done, fields.length) };
      }
    },
    /* ---- 新增：导出表单字段 ---- */
    {
      id: 'formexport', icon: 'formexport', accept: 'application/pdf', multiple: false,
      opts: () => `<div class="opt-row"><label style="color:var(--muted);font-size:13px">${t('feNote')}</label></div>`,
      run: async (files, get, prog) => {
        prog(12, t('progReading'));
        const doc = await PDFLib.PDFDocument.load(await readBytes(files[0]), { ignoreEncryption: true });
        let form; try { form = doc.getForm(); } catch (e) { form = null; }
        if (!form) return { downloads: [], info: t('feNone') };
        const fields = form.getFields();
        if (!fields || !fields.length) return { downloads: [], info: t('feNone') };
        const typeName = (f) => {
          if (f instanceof PDFLib.PDFTextField) return 'text';
          if (f instanceof PDFLib.PDFCheckBox) return 'checkbox';
          if (f instanceof PDFLib.PDFRadioGroup) return 'radio';
          if (f instanceof PDFLib.PDFDropdown) return 'dropdown';
          if (f instanceof PDFLib.PDFOptionList) return 'list';
          if (f instanceof PDFLib.PDFButton) return 'button';
          return 'field';
        };
        const valOf = (f) => {
          try {
            if (f instanceof PDFLib.PDFTextField) return f.getText() || '';
            if (f instanceof PDFLib.PDFCheckBox) return f.isChecked() ? 'checked' : '';
            if (f instanceof PDFLib.PDFRadioGroup) return f.getSelected() || '';
            if (f instanceof PDFLib.PDFDropdown) return (f.getSelected() || []).join('|');
            if (f instanceof PDFLib.PDFOptionList) return (f.getSelected() || []).join('|');
            return '';
          } catch (e) { return ''; }
        };
        const nameOf = (f) => { try { return f.getName() || ''; } catch (e) { return ''; } };
        const arr = fields.map((f) => ({ name: nameOf(f), type: typeName(f), value: valOf(f) }));
        const text = JSON.stringify(arr, null, 2);
        const b = new TextEncoder().encode(text);
        return { downloads: [{ name: 'form-fields.json', bytes: b, mime: 'application/json' }], info: t('feDone', arr.length), copyText: text };
      }
    },
    /* ---- 新增：双页拼版 ---- */
    {
      id: 'duplex', icon: 'duplex', accept: 'application/pdf', multiple: false,
      opts: () => `<div class="opt-row"><label>${t('dpGap')}</label><input class="field" type="number" data-opt="gap" value="12" min="0" max="80" step="1" style="max-width:120px"></div>`,
      run: async (files, get, prog) => {
        const gap = Math.max(0, parseFloat(get('gap')) || 0);
        prog(6, t('progReading'));
        const doc = await PDFLib.PDFDocument.load(await readBytes(files[0]), { ignoreEncryption: true });
        const pages = doc.getPages();
        const total = pages.length;
        const out = await PDFLib.PDFDocument.create();
        let pairs = 0;
        for (let i = 0; i < total; i += 2) {
          prog(8 + Math.round((i / total) * 86), t('dpProg', Math.floor(i / 2) + 1, Math.ceil(total / 2)));
          const left = pages[i];
          const lw = left.getWidth(), lh = left.getHeight();
          const right = (i + 1 < total) ? pages[i + 1] : null;
          const rw = right ? right.getWidth() : lw;
          const rh = right ? right.getHeight() : lh;
          const sheetW = lw + rw + gap + 2 * 18;
          const sheetH = Math.max(lh, rh) + 2 * 18;
          const np = out.addPage([sheetW, sheetH]);
          const le = await out.embedPage(left);
          np.drawPage(le, { x: 18, y: (sheetH - lh) / 2, width: lw, height: lh });
          if (right) {
            const re = await out.embedPage(right);
            np.drawPage(re, { x: 18 + lw + gap, y: (sheetH - rh) / 2, width: rw, height: rh });
          }
          pairs++;
        }
        const b = await out.save();
        return { downloads: [{ name: 'two-up.pdf', bytes: b, mime: 'application/pdf' }], info: t('dpDone', pairs, total) };
      }
    },
    /* ---- 新增：按大小拆分 ---- */
    {
      id: 'splitsize', icon: 'splitsize', accept: 'application/pdf', multiple: false,
      opts: () => `<div class="opt-row"><label>${t('ssSize')}</label><input class="field" type="number" data-opt="sz" value="5" min="0.1" max="200" step="0.5" style="max-width:140px"></div>`,
      run: async (files, get, prog) => {
        const mb = parseFloat(get('sz'));
        if (!(mb > 0)) return { downloads: [], info: t('ssNeed') };
        const maxBytes = mb * 1024 * 1024;
        prog(6, t('progReading'));
        const doc = await PDFLib.PDFDocument.load(await readBytes(files[0]), { ignoreEncryption: true });
        const total = doc.getPageCount();
        const downloads = [];
        let out = await PDFLib.PDFDocument.create();
        for (let i = 0; i < total; i++) {
          prog(8 + Math.round((i / total) * 86), t('ssProg', i + 1, total));
          const ps = await out.copyPages(doc, [i]);
          out.addPage(ps[0]);
          const b = await out.save();
          if (b.length > maxBytes || i === total - 1) {
            downloads.push({ name: 'part-' + String(downloads.length + 1).padStart(2, '0') + '.pdf', bytes: b, mime: 'application/pdf' });
            out = await PDFLib.PDFDocument.create();
          }
        }
        return { downloads, info: t('ssDone', downloads.length, mb) };
      }
    },
    /* ---- 新增：自动裁剪白边 ---- */
    {
      id: 'autocrop', icon: 'autocrop', accept: 'application/pdf', multiple: false,
      opts: () => `<div class="opt-row"><label>${t('acTol')}</label><input class="field" type="number" data-opt="tol" value="6" min="0" max="40" step="1" style="max-width:120px"></div>
        <div class="opt-row"><label style="color:var(--muted);font-size:13px">${t('acNote')}</label></div>`,
      run: async (files, get, prog) => {
        const tol = Math.max(0, parseFloat(get('tol')) || 0);
        prog(4, t('progReading'));
        const bytes = await readBytes(files[0]);
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'vendor/pdf.worker.min.js';
        const pdoc = await pdfjsLib.getDocument({ data: bytes.slice(0) }).promise;
        const libDoc = await PDFLib.PDFDocument.load(bytes, { ignoreEncryption: true });
        const pages = libDoc.getPages();
        const scale = 1.5;
        const thr = 240;
        let changed = 0;
        for (let i = 0; i < pdoc.numPages; i++) {
          prog(5 + Math.round((i / pdoc.numPages) * 88), t('acProg', i + 1, pdoc.numPages));
          const pg = await pdoc.getPage(i + 1);
          const vp = pg.getViewport({ scale });
          const cw = Math.ceil(vp.width), chh = Math.ceil(vp.height);
          const canvas = document.createElement('canvas');
          canvas.width = cw; canvas.height = chh;
          const cx2 = canvas.getContext('2d');
          cx2.fillStyle = '#fff'; cx2.fillRect(0, 0, cw, chh);
          await pg.render({ canvasContext: cx2, viewport: vp }).promise;
          const data = cx2.getImageData(0, 0, cw, chh).data;
          let minX = cw, minY = chh, maxX = -1, maxY = -1;
          for (let y = 0; y < chh; y++) {
            for (let x = 0; x < cw; x++) {
              const k = (y * cw + x) * 4;
              if (data[k] < thr || data[k + 1] < thr || data[k + 2] < thr) {
                if (x < minX) minX = x; if (x > maxX) maxX = x;
                if (y < minY) minY = y; if (y > maxY) maxY = y;
              }
            }
          }
          if (maxX <= minX || maxY <= minY) continue;
          const libPage = pages[i];
          const W = libPage.getWidth(), H = libPage.getHeight();
          const tolPx = tol * scale;
          const left = Math.max(0, minX - tolPx);
          const right = Math.min(cw, maxX + tolPx);
          const top = Math.max(0, minY - tolPx);
          const bottom = Math.min(chh, maxY + tolPx);
          const cropX = (left / cw) * W;
          const cropW = ((right - left) / cw) * W;
          const cropY = ((chh - bottom) / chh) * H;
          const cropH = ((bottom - top) / chh) * H;
          if (cropW > 0 && cropH > 0) { libPage.setCropBox(cropX, cropY, cropW, cropH); changed++; }
        }
        if (!changed) return { downloads: [], info: t('acNone') };
        const b = await libDoc.save();
        return { downloads: [{ name: 'auto-cropped.pdf', bytes: b, mime: 'application/pdf' }], info: t('acDone', changed) };
      }
    },
    /* ---- 新增：自动生成书签 ---- */
    {
      id: 'autobm', icon: 'autobm', accept: 'application/pdf', multiple: false,
      opts: () => `<div class="opt-row"><label>${t('abMin')}</label><input class="field" type="number" data-opt="min" value="12" min="4" max="72" step="1" style="max-width:120px"></div>
        <div class="opt-row"><label style="color:var(--muted);font-size:13px">${t('abNote')}</label></div>`,
      run: async (files, get, prog) => {
        const minSize = Math.max(1, parseFloat(get('min')) || 12);
        prog(4, t('progReading'));
        const bytes = await readBytes(files[0]);
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'vendor/pdf.worker.min.js';
        const pdoc = await pdfjsLib.getDocument({ data: bytes.slice(0) }).promise;
        const libDoc = await PDFLib.PDFDocument.load(bytes, { ignoreEncryption: true });
        const pages = libDoc.getPages();
        const ctx = libDoc.context;
        const root = PDFLib.PDFDict.withContext(ctx);
        root.set(PDFLib.PDFName.of('Type'), PDFLib.PDFName.of('Outlines'));
        const rootRef = ctx.register(root);
        libDoc.catalog.set(PDFLib.PDFName.of('Outlines'), rootRef);
        let count = 0;
        for (let i = 0; i < pdoc.numPages; i++) {
          prog(5 + Math.round((i / pdoc.numPages) * 88), t('abProg', i + 1, pdoc.numPages));
          const pg = await pdoc.getPage(i + 1);
          const tc = await pg.getTextContent();
          let best = null, bestSize = 0;
          for (const it of tc.items) {
            const sz = Math.abs(it.transform ? it.transform[3] : 0);
            if (sz >= minSize && sz > bestSize) {
              const txt = (it.str || '').trim();
              if (txt.length >= 2 && txt.length <= 60) { best = txt; bestSize = sz; }
            }
          }
          if (!best) continue;
          const item = PDFLib.PDFDict.withContext(ctx);
          item.set(PDFLib.PDFName.of('Title'), PDFLib.PDFString.of(best));
          item.set(PDFLib.PDFName.of('Parent'), rootRef);
          item.set(PDFLib.PDFName.of('Dest'), ctx.obj([pages[i].ref, PDFLib.PDFName.of('Fit')]));
          const itemRef = ctx.register(item);
          const parent = ctx.lookup(rootRef);
          if (!parent.lookupMaybe(PDFLib.PDFName.of('First'), null)) {
            parent.set(PDFLib.PDFName.of('First'), itemRef);
            parent.set(PDFLib.PDFName.of('Last'), itemRef);
          } else {
            const prevRef = parent.lookup(PDFLib.PDFName.of('Last'));
            ctx.lookup(prevRef).set(PDFLib.PDFName.of('Next'), itemRef);
            item.set(PDFLib.PDFName.of('Prev'), prevRef);
            parent.set(PDFLib.PDFName.of('Last'), itemRef);
          }
          count++;
        }
        if (!count) return { downloads: [], info: t('abNone') };
        const b = await libDoc.save();
        return { downloads: [{ name: 'auto-bookmarks.pdf', bytes: b, mime: 'application/pdf' }], info: t('abDone', count) };
      }
    },
    /* ---- 新增：N-up 拼版 ---- */
    {
      id: 'nup', icon: 'nup', accept: 'application/pdf', multiple: false,
      opts: () => `
        <div class="opt-row"><label>${t('npLayout')}</label>
          <div class="seg" data-opt="grid"><input type="hidden" value="2">
            <button type="button" data-val="2" class="on">2×2</button>
            <button type="button" data-val="3">3×3</button>
            <button type="button" data-val="4">4×4</button></div></div>
        <div class="opt-row"><label style="color:var(--muted);font-size:13px">${t('npNote')}</label></div>`,
      run: async (files, get, prog) => {
        const g = Math.max(2, Math.min(4, parseInt(get('grid') || '2', 10) || 2));
        prog(6, t('progReading'));
        const doc = await PDFLib.PDFDocument.load(await readBytes(files[0]), { ignoreEncryption: true });
        const pages = doc.getPages();
        const total = pages.length;
        const out = await PDFLib.PDFDocument.create();
        const cell0 = pages[0];
        const cw = cell0.getWidth(), ch = cell0.getHeight();
        const sheetW = cw * g, sheetH = ch * g;
        let sheets = 0;
        for (let s = 0; s < total; s += g * g) {
          prog(8 + Math.round((s / total) * 86), t('npProg', Math.floor(s / (g * g)) + 1, Math.ceil(total / (g * g))));
          const np = out.addPage([sheetW, sheetH]);
          for (let k = 0; k < g * g; k++) {
            const idx = s + k;
            if (idx >= total) break;
            const pg = pages[idx];
            const e = await out.embedPage(pg);
            const sc = Math.min(cw / e.width, ch / e.height);
            const dw = e.width * sc, dh = e.height * sc;
            const col = k % g, row = Math.floor(k / g);
            const x = col * cw + (cw - dw) / 2;
            const y = sheetH - (row + 1) * ch + (ch - dh) / 2;
            np.drawPage(e, { x, y, width: dw, height: dh });
          }
          sheets++;
        }
        const b = await out.save();
        return { downloads: [{ name: 'nup.pdf', bytes: b, mime: 'application/pdf' }], info: t('npDone', sheets, total) };
      }
    },
    /* ---- 新增：全文转 Markdown ---- */
    {
      id: 'mdtext', icon: 'mdtext', accept: 'application/pdf', multiple: false,
      opts: () => `<div class="opt-row"><label style="color:var(--muted);font-size:13px">${t('mtNote')}</label></div>`,
      run: async (files, get, prog) => {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'vendor/pdf.worker.min.js';
        prog(4, t('progOcrEngine'));
        const bytes = await readBytes(files[0]);
        const doc = await pdfjsLib.getDocument({ data: bytes.slice(0) }).promise;
        let md = '# ' + t('t_mdtext_name') + '\n\n';
        for (let i = 1; i <= doc.numPages; i++) {
          prog(6 + Math.round((i / doc.numPages) * 88), t('mtProg', i, doc.numPages));
          const page = await doc.getPage(i);
          const tc = await page.getTextContent();
          let lastY = null, line = '', lines = [];
          tc.items.forEach((it) => {
            const y = it.transform ? it.transform[5] : null;
            const str = it.str || '';
            if (lastY !== null && y !== null && Math.abs(y - lastY) > 2) { if (line) lines.push(line); line = ''; }
            line += str;
            if (y !== null) lastY = y;
          });
          if (line) lines.push(line);
          md += '## ' + t('t_mdtext_name') + ' ' + i + '\n\n' + lines.join('\n') + '\n\n';
        }
        const enc = new TextEncoder().encode(md);
        return { downloads: [{ name: 'document.md', bytes: enc, mime: 'text/markdown' }], info: t('mtDone', doc.numPages), copyText: md };
      }
    },
    /* ---- 新增：真压缩（重采样） ---- */
    {
      id: 'recompress', icon: 'recompress', accept: 'application/pdf', multiple: false,
      opts: () => `
        <div class="opt-row"><label>${t('rcQuality')}</label>
          <div class="seg" data-opt="q"><input type="hidden" value="0.5">
            <button type="button" data-val="0.7">${t('p2iHigh')}</button>
            <button type="button" data-val="0.5" class="on">${t('p2iStd')}</button>
            <button type="button" data-val="0.3">${t('rcQuality')}↓</button></div></div>
        <div class="opt-row"><label style="color:var(--muted);font-size:13px">${t('rcNote')}</label></div>`,
      run: async (files, get, prog) => {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'vendor/pdf.worker.min.js';
        prog(4, t('progOcrEngine'));
        const bytes = await readBytes(files[0]);
        const src = await pdfjsLib.getDocument({ data: bytes.slice(0) }).promise;
        const quality = Math.max(0.2, Math.min(0.9, parseFloat(get('q')) || 0.5));
        const scale = 1.5;
        const out = await PDFLib.PDFDocument.create();
        const n = src.numPages;
        for (let i = 1; i <= n; i++) {
          prog(6 + Math.round((i / n) * 86), t('rcProg', i, n));
          const pg = await src.getPage(i);
          const vp = pg.getViewport({ scale });
          const canvas = document.createElement('canvas');
          canvas.width = Math.ceil(vp.width); canvas.height = Math.ceil(vp.height);
          await pg.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise;
          const jpg = canvas.toDataURL('image/jpeg', quality);
          const bin = atob(jpg.split(',')[1]);
          const arr = new Uint8Array(bin.length);
          for (let j = 0; j < bin.length; j++) arr[j] = bin.charCodeAt(j);
          const img = await out.embedJpg(arr);
          const vp0 = pg.getViewport({ scale: 1 });
          const np = out.addPage([vp0.width, vp0.height]);
          np.drawImage(img, { x: 0, y: 0, width: vp0.width, height: vp0.height });
        }
        const b = await out.save();
        const before = bytes.length, after = b.length;
        const saved = before > after ? Math.round((1 - after / before) * 100) : 0;
        return { downloads: [{ name: 'compressed-resampled.pdf', bytes: b, mime: 'application/pdf' }], info: t('rcDone', fmt(before), fmt(after), saved) };
      }
    },
    /* ---- 新增：PDF 批注 ---- */
    {
      id: 'annotate', icon: 'annotate', accept: 'application/pdf', multiple: false,
      opts: () => `
        <div class="opt-row"><label>${t('anType')}</label>
          <div class="seg" data-opt="type"><input type="hidden" value="highlight">
            <button type="button" data-val="highlight" class="on">${t('anHighlight')}</button>
            <button type="button" data-val="sticky">${t('anSticky')}</button></div></div>
        <div class="opt-row"><label>${t('anText')}</label><input class="field" data-opt="text" placeholder="${t('anText')}"></div>
        <div class="opt-row"><label>${t('anColor')}</label>
          <div class="swatches" data-opt="color"><input type="hidden" value="#fde047">
            <span class="swatch on" data-color="#fde047" style="background:#fde047"></span>
            <span class="swatch" data-color="#fca5a5" style="background:#fca5a5"></span>
            <span class="swatch" data-color="#93c5fd" style="background:#93c5fd"></span>
            <span class="swatch" data-color="#86efac" style="background:#86efac"></span></div></div>
        <div class="opt-row"><label>${t('anPages')}</label><input class="field" data-opt="range" placeholder="1,3,5-8"></div>
        <div class="opt-row"><label style="color:var(--muted);font-size:13px">${t('anNote')}</label></div>`,
      run: async (files, get, prog) => {
        const type = get('type') || 'highlight';
        const text = (get('text') || '').trim();
        if (type === 'sticky' && !text) return { downloads: [], info: t('anNeed') };
        const rgb = hexToRgb(get('color') || '#fde047');
        const range = parseRange(get('range') || '', 1e9);
        prog(6, t('progReading'));
        const doc = await PDFLib.PDFDocument.load(await readBytes(files[0]), { ignoreEncryption: true });
        const pages = doc.getPages();
        const total = pages.length;
        const targets = range.length ? range.filter((p) => p >= 1 && p <= total) : pages.map((_, i) => i + 1);
        if (!targets.length) return { downloads: [], info: t('anNeed') };
        const ctx = doc.context;
        const mkArr = (vals) => { const a = PDFLib.PDFArray.withContext(ctx); vals.forEach((v) => a.push(PDFLib.PDFNumber.of(v))); return a; };
        let count = 0;
        for (const pno of targets) {
          prog(8 + Math.round((count / targets.length) * 86), t('anProg', count + 1, targets.length));
          const p = pages[pno - 1];
          const W = p.getWidth(), H = p.getHeight();
          const dict = PDFLib.PDFDict.withContext(ctx);
          dict.set(PDFLib.PDFName.of('Type'), PDFLib.PDFName.of('Annot'));
          if (type === 'highlight') {
            const y1 = H * 0.30, y2 = H * 0.70;
            dict.set(PDFLib.PDFName.of('Subtype'), PDFLib.PDFName.of('Highlight'));
            dict.set(PDFLib.PDFName.of('Rect'), mkArr([0, y1, W, y2]));
            dict.set(PDFLib.PDFName.of('QuadPoints'), mkArr([0, y2, W, y2, 0, y1, W, y1]));
            dict.set(PDFLib.PDFName.of('C'), mkArr([rgb.r, rgb.g, rgb.b]));
          } else {
            const x = W - 26, y = H - 26;
            dict.set(PDFLib.PDFName.of('Subtype'), PDFLib.PDFName.of('Text'));
            dict.set(PDFLib.PDFName.of('Rect'), mkArr([x, y, x + 22, y + 22]));
            dict.set(PDFLib.PDFName.of('Contents'), PDFLib.PDFString.of(text));
            dict.set(PDFLib.PDFName.of('Name'), PDFLib.PDFName.of('Comment'));
            dict.set(PDFLib.PDFName.of('C'), mkArr([rgb.r, rgb.g, rgb.b]));
          }
          dict.set(PDFLib.PDFName.of('T'), PDFLib.PDFString.of('PDF Toolkit'));
          const ref = ctx.register(dict);
          let annots = p.node.lookupMaybe(PDFLib.PDFName.of('Annots'), PDFLib.PDFArray);
          if (!annots) { annots = PDFLib.PDFArray.withContext(ctx); p.node.set(PDFLib.PDFName.of('Annots'), annots); }
          annots.push(ref);
          count++;
        }
        const b = await doc.save();
        return { downloads: [{ name: 'annotated.pdf', bytes: b, mime: 'application/pdf' }], info: t('anDone', count) };
      }
    }
  ];

  /* ---------- 工具函数 ---------- */
  function readBytes(file) { return file.arrayBuffer().then((b) => new Uint8Array(b)); }
  function simdSupported() {
    try {
      return WebAssembly.validate(
        new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 3, 2, 1, 0, 10, 10, 1, 8, 0, 32, 0, 65, 0, 254, 15, 26, 11])
      );
    } catch (e) { return false; }
  }
  function fmt(n) { if (n < 1024) return n + " B"; if (n < 1048576) return (n / 1024).toFixed(1) + " KB"; return (n / 1048576).toFixed(2) + " MB"; }
  // HTML→PDF 依赖库（jsPDF + html2canvas）按需确保已加载
  function ensureExt() {
    const load = (src) => new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = src; s.onload = res; s.onerror = () => rej(new Error("load fail: " + src));
      document.head.appendChild(s);
    });
    const tasks = [];
    if (!window.html2canvas) tasks.push(load("vendor/html2canvas.min.js"));
    if (!window.jspdf) tasks.push(load("vendor/jspdf.umd.min.js"));
    return Promise.all(tasks);
  }
  function hexToRgb(hex) {
    const m = hex.replace("#", "");
    const r = parseInt(m.substring(0, 2), 16) / 255, g = parseInt(m.substring(2, 4), 16) / 255, b = parseInt(m.substring(4, 6), 16) / 255;
    return PDFLib.rgb(r, g, b);
  }
  function parseRange(str, total) {
    const set = new Set();
    (str || "").split(",").forEach((part) => {
      part = part.trim(); if (!part) return;
      if (part.includes("-")) {
        const [a, b] = part.split("-").map((x) => parseInt(x, 10));
        if (!isNaN(a) && !isNaN(b)) for (let i = Math.min(a, b); i <= Math.max(a, b); i++) set.add(i);
      } else { const n = parseInt(part, 10); if (!isNaN(n)) set.add(n); }
    });
    return [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  }
  function toast(msg, isErr) {
    const el = document.getElementById("toast");
    el.textContent = msg; el.className = "show" + (isErr ? " err" : "");
    clearTimeout(el._t); el._t = setTimeout(() => (el.className = ""), 3200);
  }
  function download(bytes, filename, mime) {
    const blob = new Blob([bytes], { type: mime || "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  function hasCJK(s) { return /[^\x00-\xff]/.test(s || ""); }
  async function cjkTextPngBytes(text, opts) {
    await ensureExt();
    const size = opts.size || 24;
    const color = opts.color || "#000000";
    const weight = opts.bold ? 700 : 400;
    const pad = opts.pad != null ? opts.pad : Math.round(size * 0.25);
    const wrap = document.createElement("div");
    wrap.style.cssText = "position:fixed;left:-99999px;top:0;background:transparent;overflow:hidden;display:inline-block;padding:" + pad + "px;";
    wrap.innerHTML = "<span style=\"color:" + color + ";font-size:" + size + "px;font-weight:" + weight + ";font-family:-apple-system,'Segoe UI','Microsoft YaHei',sans-serif;white-space:nowrap;line-height:1;\">" + escapeHtml(text) + "</span>";
    document.body.appendChild(wrap);
    try {
      const cv = await html2canvas(wrap.firstElementChild, { scale: 1, backgroundColor: null, logging: false });
      const url = cv.toDataURL("image/png");
      const bin = atob(url.split(",")[1]);
      const arr = new Uint8Array(bin.length);
      for (let j = 0; j < bin.length; j++) arr[j] = bin.charCodeAt(j);
      return { bytes: arr, w: cv.width, h: cv.height };
    } finally { document.body.removeChild(wrap); }
  }
  const FAV_KEY = "pdf_fav", REC_KEY = "pdf_recent";
  function lsGet(k, def) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch (e) { return def; } }
  function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function getFav() { const a = lsGet(FAV_KEY, []); return Array.isArray(a) ? a : []; }
  function toggleFav(id) { const a = getFav(); const i = a.indexOf(id); if (i >= 0) a.splice(i, 1); else a.unshift(id); lsSet(FAV_KEY, a); return a.includes(id); }
  function getRecent() { const a = lsGet(REC_KEY, []); return Array.isArray(a) ? a : []; }
  function pushRecent(id) { let a = getRecent().filter((x) => x !== id); a.unshift(id); if (a.length > 12) a = a.slice(0, 12); lsSet(REC_KEY, a); }
  function makeZip(entries) {
    function crc32(buf) {
      const table = crc32._t || (crc32._t = (() => {
        const t = [];
        for (let n = 0; n < 256; n++) {
          let c = n;
          for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
          t[n] = c >>> 0;
        }
        return t;
      })());
      let crc = 0xFFFFFFFF;
      for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
      return (crc ^ 0xFFFFFFFF) >>> 0;
    }
    const enc = new TextEncoder();
    const chunks = [];
    const central = [];
    let offset = 0;
    entries.forEach((e) => {
      const nameBytes = enc.encode(e.name);
      const data = e.bytes;
      const crc = crc32(data);
      const local = new Uint8Array(30 + nameBytes.length);
      const dv = new DataView(local.buffer);
      dv.setUint32(0, 0x04034b50, true); dv.setUint16(4, 20, true); dv.setUint16(6, 0, true);
      dv.setUint16(8, 0, true); dv.setUint16(10, 0, true); dv.setUint16(12, 0, true);
      dv.setUint32(14, crc, true); dv.setUint32(18, data.length, true); dv.setUint32(22, data.length, true);
      dv.setUint16(26, nameBytes.length, true); dv.setUint16(28, 0, true);
      local.set(nameBytes, 30);
      chunks.push(local, data);
      const cen = new Uint8Array(46 + nameBytes.length);
      const cdv = new DataView(cen.buffer);
      cdv.setUint32(0, 0x02014b50, true); cdv.setUint16(4, 20, true); cdv.setUint16(6, 20, true);
      cdv.setUint16(8, 0, true); cdv.setUint16(10, 0, true); cdv.setUint16(12, 0, true); cdv.setUint16(14, 0, true);
      cdv.setUint32(16, crc, true); cdv.setUint32(20, data.length, true); cdv.setUint32(24, data.length, true);
      cdv.setUint16(28, nameBytes.length, true); cdv.setUint16(30, 0, true); cdv.setUint16(32, 0, true);
      cdv.setUint16(34, 0, true); cdv.setUint16(36, 0, true); cdv.setUint32(38, 0, true); cdv.setUint32(42, offset, true);
      cen.set(nameBytes, 46);
      central.push(cen);
      offset += local.length + data.length;
    });
    const cenSize = central.reduce((s, c) => s + c.length, 0);
    const total = new Uint8Array(offset + cenSize + 22);
    let pos = 0;
    chunks.forEach((c) => { total.set(c, pos); pos += c.length; });
    central.forEach((c) => { total.set(c, pos); pos += c.length; });
    const edv = new DataView(total.buffer, pos);
    edv.setUint32(0, 0x06054b50, true); edv.setUint16(4, 0, true); edv.setUint16(6, 0, true);
    edv.setUint16(8, entries.length, true); edv.setUint16(10, entries.length, true);
    edv.setUint32(12, cenSize, true); edv.setUint32(16, offset, true); edv.setUint16(20, 0, true);
    return total;
  }
  // PDF→Word：把每页文字拼成最小可用的 .docx（OOXML zip），不保留版式
  function buildDocx(pages, doBreak) {
    const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&apos;");
    const body = pages.map((p, idx) => {
      const paras = String(p).split("\n").map((ln) => `<w:p><w:r><w:t xml:space="preserve">${esc(ln)}</w:t></w:r></w:p>`).join("");
      return doBreak && idx < pages.length - 1 ? paras + '<w:p><w:r><w:br w:type="page"/></w:r></w:p>' : paras;
    }).join("");
    const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${body}<w:sectPr/></w:body></w:document>`;
    const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`;
    const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`;
    const enc = new TextEncoder();
    return {
      files: [
        { name: "[Content_Types].xml", bytes: enc.encode(contentTypes) },
        { name: "_rels/.rels", bytes: enc.encode(rels) },
        { name: "word/document.xml", bytes: enc.encode(documentXml) }
      ]
    };
  }
  // 提取图片：兼容 pdf.js 的 objs.get（回调式旧版 / Promise 新版）
  function getObjSafe(page, id) {
    const r = page.objs.get(id);
    if (r && typeof r.then === "function") return r;
    return new Promise((res, rej) => { try { page.objs.get(id, res); } catch (e) { rej(e); } });
  }
  function imageDataToPng(data, w, h) {
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    const ctx = c.getContext("2d");
    const arr = data instanceof Uint8ClampedArray ? data : new Uint8ClampedArray(data.buffer || data, data.byteOffset || 0, data.byteLength);
    ctx.putImageData(new ImageData(arr, w, h), 0, 0);
    const bin = atob(c.toDataURL("image/png").split(",")[1]);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }
  function fnv1a(buf) {
    let h = 0x811c9dc5;
    for (let i = 0; i < buf.length; i += 7) { h ^= buf[i]; h = Math.imul(h, 0x01000193); }
    return h >>> 0;
  }
  // PDF→PPT：把每页图片塞进一个最小可用的 .pptx（每页一张整图幻灯片）
  function buildPptx(slides) {
    const enc = new TextEncoder();
    const files = [];
    const SLIDE_W = 12192000, SLIDE_H = 6858000; // 16:9 EMU
    let overrides = "";
    for (let i = 1; i <= slides.length; i++) overrides += `<Override PartName="/ppt/slides/slide${i}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>`;
    const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="png" ContentType="image/png"/><Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/><Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"/><Override PartName="/ppt/slideLayouts/slideLayout1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/><Override PartName="/ppt/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>${overrides}</Types>`;
    files.push({ name: "[Content_Types].xml", bytes: enc.encode(contentTypes) });
    files.push({ name: "_rels/.rels", bytes: enc.encode(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/></Relationships>`) });
    let sldIds = "";
    for (let i = 1; i <= slides.length; i++) sldIds += `<p:sldId id="${255 + i}" r:id="rId${i}"/>`;
    const presentation = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<p:presentation xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="rId${slides.length + 1}"/></p:sldMasterIdLst><p:sldIdLst>${sldIds}</p:sldIdLst><p:sldSz cx="${SLIDE_W}" cy="${SLIDE_H}"/><p:notesSz cx="6858000" cy="9144000"/></p:presentation>`;
    files.push({ name: "ppt/presentation.xml", bytes: enc.encode(presentation) });
    let presRels = "";
    for (let i = 1; i <= slides.length; i++) presRels += `<Relationship Id="rId${i}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide${i}.xml"/>`;
    presRels += `<Relationship Id="rId${slides.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="slideMasters/slideMaster1.xml"/>`;
    files.push({ name: "ppt/_rels/presentation.xml.rels", bytes: enc.encode(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${presRels}</Relationships>`) });
    const master = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<p:sldMaster xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr></p:spTree></p:cSld><p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/><p:sldLayoutIdLst><p:sldLayoutId id="2147483649" r:id="rId1"/></p:sldLayoutIdLst></p:sldMaster>`;
    files.push({ name: "ppt/slideMasters/slideMaster1.xml", bytes: enc.encode(master) });
    files.push({ name: "ppt/slideMasters/_rels/slideMaster1.xml.rels", bytes: enc.encode(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="../theme/theme1.xml"/></Relationships>`) });
    const layout = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<p:sldLayout xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" type="blank" preserve="1"><p:cSld name="Blank"><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr></p:spTree></p:cSld><p:clrMapOvr><a:overrideClrMapping masterClrMapping="official"/></p:clrMapOvr></p:sldLayout>`;
    files.push({ name: "ppt/slideLayouts/slideLayout1.xml", bytes: enc.encode(layout) });
    files.push({ name: "ppt/slideLayouts/_rels/slideLayout1.xml.rels", bytes: enc.encode(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="../slideMasters/slideMaster1.xml"/></Relationships>`) });
    files.push({ name: "ppt/theme/theme1.xml", bytes: enc.encode(THEME_XML) });
    for (let i = 0; i < slides.length; i++) {
      const s = slides[i];
      const scale = Math.min(SLIDE_W / s.w, SLIDE_H / s.h);
      const cx = Math.round(s.w * scale), cy = Math.round(s.h * scale);
      const ox = Math.round((SLIDE_W - cx) / 2), oy = Math.round((SLIDE_H - cy) / 2);
      const slide = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<p:sld xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr><p:pic><p:nvPicPr><p:cNvPr id="2" name="Picture ${i + 1}"/><p:cNvPicPr/><p:nvPr/></p:nvPicPr><p:blipFill><a:blip r:embed="rId1"/><a:stretch><a:fillRect/></a:stretch></p:blipFill><p:spPr><a:xfrm><a:off x="${ox}" y="${oy}"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr></p:pic></p:spTree></p:cSld><p:clrMapOvr><a:overrideClrMapping masterClrMapping="official"/></p:clrMapOvr></p:sld>`;
      files.push({ name: `ppt/slides/slide${i + 1}.xml`, bytes: enc.encode(slide) });
      files.push({ name: `ppt/slides/_rels/slide${i + 1}.xml.rels`, bytes: enc.encode(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/image${i + 1}.png"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/></Relationships>`) });
      files.push({ name: `ppt/media/image${i + 1}.png`, bytes: s.bytes });
    }
    return makeZip(files);
  }
  const THEME_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Office Theme"><a:themeElements><a:clrScheme name="Office"><a:dk1><a:sysClr val="windowText" lastClr="000000"/></a:dk1><a:lt1><a:sysClr val="window" lastClr="FFFFFF"/></a:lt1><a:dk2><a:srgbClr val="1F3864"/></a:dk2><a:lt2><a:srgbClr val="EEF1F7"/></a:lt2><a:accent1><a:srgbClr val="2E74B5"/></a:accent1><a:accent2><a:srgbClr val="C55A11"/></a:accent2><a:accent3><a:srgbClr val="548135"/></a:accent3><a:accent4><a:srgbClr val="BF9000"/></a:accent4><a:accent5><a:srgbClr val="7030A0"/></a:accent5><a:accent6><a:srgbClr val="C00000"/></a:accent6><a:hlink><a:srgbClr val="0563C1"/></a:hlink><a:folHlink><a:srgbClr val="954F72"/></a:folHlink></a:clrScheme><a:fontScheme name="Office"><a:majorFont><a:latin typeface="Calibri Light"/><a:ea typeface=""/><a:cs typeface=""/></a:majorFont><a:minorFont><a:latin typeface="Calibri"/><a:ea typeface=""/><a:cs typeface=""/></a:minorFont></a:fontScheme><a:fmtScheme name="Office"><a:fillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:fillStyleLst><a:lnStyleLst><a:ln w="6350" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/></a:ln></a:lnStyleLst><a:effectStyleLst><a:effectStyle><a:effectLst/></a:effectStyle></a:effectStyleLst><a:bgFillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:bgFillStyleLst></a:fmtScheme></a:themeElements></a:theme>`;

  // PDF→Excel：按文字坐标重建行列，导出最小可用的 .xlsx（内联字符串）
  function buildXlsx(grid) {
    const enc = new TextEncoder();
    const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
    const colLetter = (n) => { let s = ""; while (n > 0) { const m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); } return s; };
    let rowsXml = "";
    grid.forEach((row, ri) => {
      let cells = "";
      row.forEach((val, ci) => {
        if (val === "" || val == null) return;
        const ref = colLetter(ci + 1) + (ri + 1);
        const num = (typeof val === "number") ? val : (val.trim() !== "" && !isNaN(Number(String(val).replace(/,/g, ""))) ? Number(String(val).replace(/,/g, "")) : null);
        if (num !== null) cells += `<c r="${ref}" t="n"><v>${num}</v></c>`;
        else cells += `<c r="${ref}" t="inlineStr"><is><t xml:space="preserve">${esc(val)}</t></is></c>`;
      });
      rowsXml += `<row r="${ri + 1}">${cells}</row>`;
    });
    const sheet = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheetData>${rowsXml}</sheetData></worksheet>`;
    const workbook = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Sheet1" sheetId="1" r:id="rId1"/></sheets></workbook>`;
    const wbRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`;
    const styles = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="1"><font><sz val="11"/><name val="Calibri"/></font></fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills><borders count="1"><border/></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/></cellXfs></styleSheet>`;
    const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>`;
    const rootRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`;
    const files = [
      { name: "[Content_Types].xml", bytes: enc.encode(contentTypes) },
      { name: "_rels/.rels", bytes: enc.encode(rootRels) },
      { name: "xl/workbook.xml", bytes: enc.encode(workbook) },
      { name: "xl/_rels/workbook.xml.rels", bytes: enc.encode(wbRels) },
      { name: "xl/worksheets/sheet1.xml", bytes: enc.encode(sheet) },
      { name: "xl/styles.xml", bytes: enc.encode(styles) }
    ];
    return makeZip(files);
  }
  // 从 pdf.js getTextContent 结果按坐标重建二维网格（尽力而为）
  function extractGrid(content, pageHeight) {
    const items = (content.items || []).filter((it) => it.str && it.str.trim() !== "");
    if (!items.length) return [];
    const parsed = items.map((it) => {
      const x = it.transform ? it.transform[4] : 0;
      const baseY = it.transform ? it.transform[5] : 0;
      const top = pageHeight - baseY;
      const h = (it.height && it.height > 0) ? it.height : 10;
      return { x, top, w: it.width || 0, h, text: it.str };
    });
    parsed.sort((a, b) => a.top - b.top);
    const rowTol = Math.max(4, parsed[0].h * 0.85);
    const rows = [];
    let cur = null;
    parsed.forEach((it) => {
      if (!cur || (it.top - cur.top) > rowTol) { cur = { top: it.top, items: [] }; rows.push(cur); }
      else { cur.top = (cur.top * cur.items.length + it.top) / (cur.items.length + 1); }
      cur.items.push(it);
    });
    const xs = parsed.map((it) => it.x).sort((a, b) => a - b);
    const colTol = Math.max(12, parsed.reduce((m, it) => Math.max(m, it.w), 0) * 0.6);
    const centers = [];
    xs.forEach((x) => {
      const last = centers[centers.length - 1];
      if (last === undefined || (x - last) > colTol) centers.push(x);
    });
    const grid = rows.map((r) => {
      const cells = new Array(centers.length).fill("");
      r.items.sort((a, b) => a.x - b.x).forEach((it) => {
        let ci = 0, best = Infinity;
        centers.forEach((c, i) => { const d = Math.abs(c - it.x); if (d < best) { best = d; ci = i; } });
        cells[ci] = cells[ci] ? cells[ci] + " " + it.text : it.text;
      });
      while (cells.length && cells[cells.length - 1] === "") cells.pop();
      return cells;
    });
    const nonEmpty = centers.map((_, ci) => grid.some((r) => r[ci] !== ""));
    return grid.map((r) => r.filter((_, ci) => nonEmpty[ci]));
  }

  function genPassword(len, sets) {
    const C = {
      lower: "abcdefghijkmnpqrstuvwxyz", upper: "ABCDEFGHJKLMNPQRSTUVWXYZ",
      number: "23456789", symbol: "!@#$%^&*()-_=+[]{};:,.?"
    };
    let pool = "";
    const ensured = [];
    Object.keys(sets).forEach((k) => {
      if (sets[k] && C[k]) { pool += C[k]; ensured.push(C[k][Math.floor(Math.random() * C[k].length)]); }
    });
    if (!pool) pool = C.lower;
    const arr = [];
    for (let i = 0; i < len; i++) arr.push(pool[Math.floor(Math.random() * pool.length)]);
    for (let i = 0; i < ensured.length && i < len; i++) arr[i] = ensured[i];
    for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp; }
    return arr.join("");
  }

  /* ---------- 渲染：首页 ---------- */
  /* ---------- 工具分类（用于首页筛选） ---------- */
  const CATEGORIES = [
    { id: "all", key: "catAll", color: "#6366f1" },
    { id: "favorite", key: "catFav", color: "#f59e0b" },
    { id: "recent", key: "catRecent", color: "#10b981" },
    { id: "merge-split", key: "cat_merge", color: "#6366f1" },
    { id: "organize", key: "cat_organize", color: "#0ea5e9" },
    { id: "convert", key: "cat_convert", color: "#8b5cf6" },
    { id: "edit", key: "cat_edit", color: "#ec4899" },
    { id: "security", key: "cat_security", color: "#f59e0b" },
    { id: "text", key: "cat_text", color: "#10b981" },
    { id: "optimize", key: "cat_optimize", color: "#14b8a6" }
  ];
  const TOOL_CAT = {
    merge: "merge-split", split: "merge-split", splitn: "merge-split", insert: "merge-split", extractpages: "merge-split", blank: "merge-split",
    reorder: "organize", reverse: "organize", delete: "organize", duplicate: "organize", rotate: "organize",
    img2pdf: "convert", pdf2img: "convert", pdf2word: "convert", pdf2ppt: "convert", pdf2excel: "convert", html2pdf: "convert", extractimg: "convert",
    pagenum: "edit", crop: "edit", resize: "edit", watermark: "edit", headerfooter: "edit", sign: "edit", seal: "edit", grayscale: "edit",
    encrypt: "security", decrypt: "security", password: "security", metadata: "security",
    ocr: "text", extract: "text", info: "text", links: "text",
    compress: "optimize", optimize: "optimize", repair: "optimize",
    rmblank: "organize", pdf2long: "convert", booklet: "edit", cover: "edit",
    bg: "edit", margin: "edit", wmimg: "edit", outline: "text", formfields: "text", rmanno: "optimize",
    burst: "organize", oddeven: "organize", attach: "text", collate: "merge-split", splitbm: "organize", wordcount: "text",
    addlink: 'edit', bates: 'edit', overlay: 'edit', compare: 'text', annoextract: 'text', papersize: 'edit',
    border: 'edit', redact: 'optimize', fontlist: 'text', pagesizes: 'text', removemeta: 'optimize', datestamp: 'edit',
    flatten: 'optimize', embed: 'edit', mkbm: 'edit', ocrpdf: 'optimize', pdf2html: 'convert', unify: 'merge-split', wmcn: 'edit', bm2md: 'text', resize2: 'edit',
    formfill: 'edit', formexport: 'text', duplex: 'merge-split', splitsize: 'merge-split', autocrop: 'edit', autobm: 'organize',
    nup: 'merge-split', mdtext: 'text', recompress: 'optimize', annotate: 'edit'
  };
  const toolFilter = { cat: "all", q: "" };

  function cardHTML(tt, i, animate) {
    const col = TCOLORS[tt.icon] || TCOLORS._default;
    const anim = animate ? `animation-delay:${i * 40}ms;` : `animation:none;`;
    const fav = getFav().includes(tt.id);
    return `<div class="tool-card" data-id="${tt.id}" style="${anim}--tc:${col.c};--tc-bg:${col.bg};--tc-grad:${col.g}">
        <button class="tc-star ${fav ? "on" : ""}" data-id="${tt.id}" title="${t("favTip")}" aria-label="favorite">${fav ? "★" : "☆"}</button>
        <div class="tc-ico">${ICONS[tt.icon]}</div>
        <h3 class="tc-name">${t("t_" + tt.id + "_name")}</h3>
        <p class="tc-desc">${t("t_" + tt.id + "_desc")}</p>
        <span class="tc-arrow">${ICONS.arrowR}</span>
      </div>`;
  }
  function renderToolsGrid(animate) {
    const grid = document.getElementById("toolsGrid");
    const empty = document.getElementById("toolsEmpty");
    if (!grid) return;
    const q = toolFilter.q.trim().toLowerCase();
    let list;
    if (toolFilter.cat === "favorite") {
      list = getFav().map((id) => TOOLS.find((x) => x.id === id)).filter(Boolean);
    } else if (toolFilter.cat === "recent") {
      list = getRecent().map((id) => TOOLS.find((x) => x.id === id)).filter(Boolean);
    } else {
      list = TOOLS.filter((tt) => toolFilter.cat === "all" || TOOL_CAT[tt.id] === toolFilter.cat);
    }
    if (q) list = list.filter((tt) => (t("t_" + tt.id + "_name") + " " + t("t_" + tt.id + "_desc")).toLowerCase().includes(q));
    if (!list.length) { grid.innerHTML = ""; if (empty) empty.hidden = false; return; }
    if (empty) empty.hidden = true;
    grid.innerHTML = list.map((tt, i) => cardHTML(tt, i, animate)).join("");
    grid.querySelectorAll(".tool-card").forEach((c) =>
      c.addEventListener("click", () => openTool(c.dataset.id)));
    grid.querySelectorAll(".tc-star").forEach((s) =>
      s.addEventListener("click", (e) => {
        e.stopPropagation();
        const on = toggleFav(s.dataset.id);
        s.classList.toggle("on", on);
        s.textContent = on ? "★" : "☆";
        if (toolFilter.cat === "favorite") renderToolsGrid(false);
      }));
  }
  function renderChips() {
    const box = document.getElementById("catChips");
    if (!box) return;
    box.innerHTML = CATEGORIES.map((c) => `
      <button class="tf-chip ${toolFilter.cat === c.id ? "on" : ""}" data-cat="${c.id}" style="--cc:${c.color}">
        ${c.id === "all" ? "" : '<span class="dot"></span>'}${t(c.key)}
      </button>`).join("");
    box.querySelectorAll(".tf-chip").forEach((b) =>
      b.addEventListener("click", () => { toolFilter.cat = b.dataset.cat; renderChips(); renderToolsGrid(true); }));
  }
  function renderHome() {
    const search = document.getElementById("toolSearch");
    if (search) search.placeholder = t("searchPh");
    renderChips();
    renderToolsGrid(true);
  }

  /* ---------- 渲染：工具面板 ---------- */
  let panel = null;
  let sealFile = null;
  let currentToolId = null;
  function openTool(id, keepFiles) {
    const tt = TOOLS.find((x) => x.id === id);
    if (!tt) return;
    pushRecent(id);
    if (id !== currentToolId) sealFile = null;
    currentToolId = id;
    const home = document.getElementById("homeView");
    const tool = document.getElementById("toolView");
    let dropHtml = "";
    if (tt.noFile) {
      dropHtml = "";
    } else if (tt.sources) {
      dropHtml = `<div class="up-wrap sources-${tt.sources.length}">` + tt.sources.map((s) => `
          <div class="up-group">
            <div class="up-label">${s.label}</div>
            <div class="dropzone" id="dz_${s.role}">
              <div class="up-ico">${ICONS.upload}</div>
              <h4>${t("dropTitle")}</h4>
              <p>${s.multiple ? t("dropSubMulti") : t("dropSubSingle")}</p>
              <input type="file" id="fileInput_${s.role}" accept="${s.accept}" ${s.multiple ? "multiple" : ""} hidden>
            </div>
            <div class="filelist" id="fileList_${s.role}"></div>
          </div>`).join("") + `</div>`;
    } else {
      dropHtml = `
          <div class="dropzone" id="dz">
            <div class="up-ico">${ICONS.upload}</div>
            <h4>${t("dropTitle")}</h4>
            <p>${tt.multiple ? t("dropSubMulti") : t("dropSubSingle")}</p>
            <input type="file" id="fileInput" accept="${tt.accept}" ${tt.multiple ? "multiple" : ""} hidden>
          </div>
          <div class="filelist" id="fileList"></div>`;
    }
    tool.innerHTML = `
      <div class="wrap">
        <div class="panel" style="--tc:${(TCOLORS[tt.icon]||TCOLORS._default).c};--tc-bg:${(TCOLORS[tt.icon]||TCOLORS._default).bg};--tc-grad:${(TCOLORS[tt.icon]||TCOLORS._default).g}">
          <div class="panel-head">
            <button class="panel-back" id="backBtn">${ICONS.arrowL} ${t("back")}</button>
            <div class="panel-title">
              <div class="pic" style="--tc:${(TCOLORS[tt.icon]||TCOLORS._default).c};--tc-grad:${(TCOLORS[tt.icon]||TCOLORS._default).g}">${ICONS[tt.icon]}</div>
              <div><h2>${t("t_" + tt.id + "_name")}</h2><p>${t("t_" + tt.id + "_desc")}</p></div>
            </div>
          </div>
          ${dropHtml}
          <div class="opts">${tt.opts()}</div>
          <div class="actions">
            <button class="btn-run" id="runBtn">${ICONS.bolt} ${t("runBtn")}</button>
            <button class="btn-reset" id="resetBtn">${t("resetBtn")}</button>
          </div>
          <div class="progress-wrap" id="progWrap">
            <div class="progress"><i id="progBar"></i></div>
            <div class="progress-label"><span id="progText">${t("progDefault")}</span><span id="progPct">0%</span></div>
          </div>
          <div class="result" id="result"></div>
        </div>
      </div>`;
    home.style.display = "none";
    tool.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });

    panel = tool;
    panel.dataset.toolId = id;
    panel._files = keepFiles ? keepFiles.slice() : [];
    if (tt.sources) panel._src = {};
    wirePanel(tt);
  }

  function wirePanel(tt) {
    const dz = panel.querySelector("#dz");
    const input = panel.querySelector("#fileInput");
    const list = panel.querySelector("#fileList");
    const progWrap = panel.querySelector("#progWrap");
    const progBar = panel.querySelector("#progBar");
    const progText = panel.querySelector("#progText");
    const progPct = panel.querySelector("#progPct");
    const result = panel.querySelector("#result");
    const runBtn = panel.querySelector("#runBtn");
    const resetBtn = panel.querySelector("#resetBtn");

    panel.querySelector("#backBtn").addEventListener("click", closeTool);

    if (tt.sources) {
      panel._src = panel._src || {};
      tt.sources.forEach((s) => {
        panel._src[s.role] = panel._src[s.role] || [];
        const dz = panel.querySelector("#dz_" + s.role);
        const input = panel.querySelector("#fileInput_" + s.role);
        const list = panel.querySelector("#fileList_" + s.role);
        const refresh = () => {
          list.innerHTML = panel._src[s.role].map((f, i) => `
            <div class="filechip">
              <div class="fic">${ICONS.file}</div>
              <div class="fmeta"><div class="fname">${escapeHtml(f.name)}</div><div class="fsize">${fmt(f.size)}</div></div>
              <button class="fx" data-i="${i}" title="移除">${ICONS.x}</button>
            </div>`).join("");
          list.querySelectorAll(".fx").forEach((b) => b.addEventListener("click", () => {
            panel._src[s.role].splice(+b.dataset.i, 1); refresh();
          }));
        };
        const addFiles = (fileList) => {
          const arr = [...fileList];
          panel._src[s.role] = s.multiple ? panel._src[s.role].concat(arr) : arr.slice(0, 1);
          result.className = "result"; refresh();
        };
        dz.addEventListener("click", () => input.click());
        input.addEventListener("change", () => { addFiles(input.files); input.value = ""; });
        ["dragover", "dragenter"].forEach((e) => dz.addEventListener(e, (ev) => { ev.preventDefault(); dz.classList.add("drag"); }));
        ["dragleave", "drop"].forEach((e) => dz.addEventListener(e, (ev) => { ev.preventDefault(); dz.classList.remove("drag"); }));
        dz.addEventListener("drop", (ev) => { if (ev.dataTransfer.files.length) addFiles(ev.dataTransfer.files); });
        if (panel._src[s.role].length) refresh();
      });
    } else {
      const refresh = () => {
        list.innerHTML = panel._files.map((f, i) => `
          <div class="filechip">
            <div class="fic">${ICONS.file}</div>
            <div class="fmeta"><div class="fname">${escapeHtml(f.name)}</div><div class="fsize">${fmt(f.size)}</div></div>
            <button class="fx" data-i="${i}" title="移除">${ICONS.x}</button>
          </div>`).join("");
        list.querySelectorAll(".fx").forEach((b) => b.addEventListener("click", () => {
          panel._files.splice(+b.dataset.i, 1); refresh();
        }));
      };
      if (panel._files.length) refresh();

      const addFiles = (fileList) => {
        const arr = [...fileList];
        panel._files = tt.multiple ? panel._files.concat(arr) : arr.slice(0, 1);
        result.className = "result";
        refresh();
      };
      if (!tt.noFile) {
        dz.addEventListener("click", () => input.click());
        input.addEventListener("change", () => { addFiles(input.files); input.value = ""; });
        ["dragover", "dragenter"].forEach((e) => dz.addEventListener(e, (ev) => { ev.preventDefault(); dz.classList.add("drag"); }));
        ["dragleave", "drop"].forEach((e) => dz.addEventListener(e, (ev) => { ev.preventDefault(); dz.classList.remove("drag"); }));
        dz.addEventListener("drop", (ev) => { if (ev.dataTransfer.files.length) addFiles(ev.dataTransfer.files); });
      }
    }

    // 选项控件（分段 / 色板 / 滑块）
    panel.querySelectorAll(".seg, .pos-grid").forEach((seg) => {
      seg.querySelectorAll("button").forEach((b) => b.addEventListener("click", () => {
        seg.querySelectorAll("button").forEach((x) => x.classList.remove("on"));
        b.classList.add("on"); seg.querySelector("input[type=hidden]").value = b.dataset.val;
      }));
    });
    panel.querySelectorAll(".swatches").forEach((sw) => {
      sw.querySelectorAll(".swatch").forEach((s) => s.addEventListener("click", () => {
        sw.querySelectorAll(".swatch").forEach((x) => x.classList.remove("on"));
        s.classList.add("on"); sw.querySelector("input[type=hidden]").value = s.dataset.color;
      }));
    });
    panel.querySelectorAll("input[type=range][data-opt]").forEach((r) => {
      const out = panel.querySelector("#" + r.id + "_val");
      r.addEventListener("input", () => out && (out.textContent = r.value));
    });

    const sealInput = panel.querySelector("#sealInput");
    if (sealInput) {
      const sealPick = panel.querySelector("#sealPick");
      const sealName = panel.querySelector("#sealName");
      if (sealFile) sealName.textContent = sealFile.name;
      sealPick.addEventListener("click", () => sealInput.click());
      sealInput.addEventListener("change", () => {
        if (sealInput.files && sealInput.files.length) { sealFile = sealInput.files[0]; sealName.textContent = sealFile.name; }
      });
    }

    const getVal = (name) => { const el = panel.querySelector('[data-opt="' + name + '"]'); return el ? el.value : undefined; };
    const setProgress = (p, label) => {
      progBar.style.width = Math.max(0, Math.min(100, p)) + "%";
      progPct.textContent = Math.round(p) + "%";
      if (label) progText.textContent = label;
    };
    const showResult = (res) => {
      const multi = res.downloads.length > 1;
      const preview = res.preview
        ? `<div class="r-preview"><div class="r-preview-head">${ICONS.ocr} ${t("previewHead")} <span>(${res.preview.length}${t("previewCountUnit")})</span></div><pre class="r-preview-body">${escapeHtml(res.preview)}</pre></div>`
        : (res.previewHtml ? `<div class="r-preview">${res.previewHtml}</div>` : "");
      result.innerHTML = `
        <div class="r-top"><div class="r-ico">${ICONS.check}</div>
          <div><h4>${t("resultDone")}</h4><p>${escapeHtml(res.info || "")}</p></div></div>
        ${res.copyText ? `<div class="r-copy"><code id="copyText">${escapeHtml(res.copyText)}</code><button class="btn-dl" id="copyBtn">${ICONS.download} ${t("copyBtn")}</button></div>` : ""}
        ${preview}
        <div class="r-actions">
          ${res.downloads.length === 0 ? "" : (multi
            ? `<button class="btn-dl" id="dlAll">${ICONS.download} ${t("dlAll")} (${res.downloads.length})</button>
               <div style="margin-top:10px;display:flex;flex-direction:column;gap:6px">
                 ${res.downloads.map((d, i) => `<button class="btn-dl" data-i="${i}" style="background:#0f172a">${ICONS.download} ${escapeHtml(d.name)}</button>`).join("")}
               </div>`
            : `<button class="btn-dl" id="dlOne">${ICONS.download} ${t("dlOne")} ${escapeHtml(res.downloads[0].name)}</button>`)}
        </div>`;
      result.classList.add("show");
      const copyBtn = result.querySelector("#copyBtn");
      if (copyBtn) copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(res.copyText).then(() => toast(t("copyBtn") + " ✓")).catch(() => toast(t("toastFail") + " clipboard"));
      });
      const doDl = (i) => download(res.downloads[i].bytes, res.downloads[i].name, res.downloads[i].mime);
      if (res.downloads.length) {
        if (multi) {
          result.querySelector("#dlAll").addEventListener("click", () => res.downloads.forEach((_, i) => setTimeout(() => doDl(i), i * 350)));
          result.querySelectorAll("[data-i]").forEach((b) => b.addEventListener("click", () => doDl(+b.dataset.i)));
        } else {
          result.querySelector("#dlOne").addEventListener("click", () => doDl(0));
        }
      }
    };

    runBtn.addEventListener("click", async () => {
      if (tt.sources) {
        const miss = tt.sources.find((s) => !(panel._src[s.role] && panel._src[s.role].length));
        if (miss) { toast(t("toastChooseFile"), true); return; }
      } else if (!tt.noFile && !panel._files.length) {
        toast(t("toastChooseFile"), true); return;
      }
      runBtn.disabled = true; resetBtn.disabled = true; result.className = "result";
      progWrap.classList.add("show"); setProgress(4, t("progDefault"));
      try {
        const res = await tt.run(tt.sources ? panel._src : panel._files, getVal, setProgress);
        setProgress(100, t("resultDone"));
        showResult(res);
      } catch (e) {
        console.error(e);
        toast(t("toastFail") + (e && e.message ? e.message : e), true);
        setProgress(0, t("toastFail"));
      } finally {
        runBtn.disabled = false; resetBtn.disabled = false;
      }
    });

    resetBtn.addEventListener("click", () => {
      if (tt.sources) { openTool(tt.id); return; }
      panel._files = [];
      if (tt.id === "seal") { sealFile = null; const sname = panel.querySelector("#sealName"); if (sname) sname.textContent = t("sealNone"); }
      if (tt.id === "html2pdf") { const ta = panel.querySelector('[data-opt="html"]'); if (ta) ta.value = ""; }
      if (!tt.noFile) refresh();
      result.className = "result"; progWrap.classList.remove("show"); setProgress(0);
    });
  }

  function closeTool() {
    document.getElementById("toolView").classList.remove("active");
    document.getElementById("toolView").innerHTML = "";
    document.getElementById("homeView").style.display = "block";
    panel = null;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ---------- 语言切换 ---------- */
  function applyLang() {
    document.documentElement.lang = curLang === "zh" ? "zh-CN" : "en";
    document.title = t("docTitle");
    document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.getAttribute("data-i18n")); });
    document.querySelectorAll("[data-i18n-html]").forEach((el) => { el.innerHTML = t(el.getAttribute("data-i18n-html")); });
    renderHome();
    if (panel) { const id = panel.dataset.toolId; const files = panel._files; openTool(id, files); }
    updateLangBtn();
  }
  function updateLangBtn() {
    const lbl = document.getElementById("langLabel");
    if (lbl) lbl.textContent = curLang === "zh" ? "中文" : "EN";
  }

  /* ---------- 启动 ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    const langBtn = document.getElementById("langBtn");
    if (langBtn) langBtn.addEventListener("click", () => {
      curLang = curLang === "zh" ? "en" : "zh";
      try { localStorage.setItem("pdf_lang", curLang); } catch (e) {}
      applyLang();
    });
    applyLang();
    if (typeof PDFLib === "undefined") toast(t("errEngineLoad"), true);
    document.querySelectorAll("[data-scroll]").forEach((a) => a.addEventListener("click", (e) => {
      e.preventDefault(); const el = document.querySelector(a.getAttribute("data-scroll"));
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }));
    const navEl = document.querySelector(".nav");
    const onNavScroll = () => { if (navEl) navEl.classList.toggle("scrolled", window.scrollY > 8); };
    window.addEventListener("scroll", onNavScroll, { passive: true });
    onNavScroll();
    const searchEl = document.getElementById("toolSearch");
    const clearEl = document.getElementById("toolSearchClear");
    if (searchEl) {
      searchEl.addEventListener("input", () => {
        toolFilter.q = searchEl.value || "";
        if (clearEl) clearEl.hidden = !toolFilter.q;
        renderToolsGrid(false);
      });
    }
    if (clearEl) {
      clearEl.addEventListener("click", () => {
        if (searchEl) { searchEl.value = ""; searchEl.focus(); }
        toolFilter.q = ""; clearEl.hidden = true; renderToolsGrid(false);
      });
    }
  });
})();
