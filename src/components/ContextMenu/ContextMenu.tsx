import { useEffect, useRef } from 'react'
import './ContextMenu.css'

interface ContextMenuProps {
  x: number
  y: number
  onClose: () => void
  onFormat: (format: string) => void
  onToggleSidebar: () => void
  onToggleSource: () => void
}

const MENU_ITEMS = [
  { label: 'Bold', format: 'bold', shortcut: 'Ctrl+B' },
  { label: 'Italic', format: 'italic', shortcut: 'Ctrl+I' },
  { label: 'Underline', format: 'underline', shortcut: 'Ctrl+U' },
  { label: 'Strikethrough', format: 'strike', shortcut: 'Ctrl+Shift+X' },
  { type: 'separator' as const },
  { label: 'Heading 1', format: 'h1', shortcut: 'Ctrl+1' },
  { label: 'Heading 2', format: 'h2', shortcut: 'Ctrl+2' },
  { label: 'Heading 3', format: 'h3', shortcut: 'Ctrl+3' },
  { type: 'separator' as const },
  { label: 'Code', format: 'code', shortcut: 'Ctrl+E' },
  { label: 'Code Block', format: 'codeBlock', shortcut: 'Ctrl+Shift+K' },
  { label: 'Blockquote', format: 'blockquote', shortcut: 'Ctrl+Shift+Q' },
  { type: 'separator' as const },
  { label: 'Toggle Sidebar', action: 'sidebar', shortcut: 'Ctrl+\\' },
  { label: 'Toggle Source Mode', action: 'source', shortcut: 'Ctrl+/' },
]

function ContextMenu({ x, y, onClose, onFormat, onToggleSidebar, onToggleSource }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [onClose])

  useEffect(() => {
    if (!menuRef.current) return
    const rect = menuRef.current.getBoundingClientRect()
    const vw = window.innerWidth
    const vh = window.innerHeight
    if (rect.right > vw) {
      menuRef.current.style.left = `${x - rect.width}px`
    }
    if (rect.bottom > vh) {
      menuRef.current.style.top = `${y - rect.height}px`
    }
  }, [x, y])

  const handleClick = (item: typeof MENU_ITEMS[number]) => {
    if ('format' in item && item.format) {
      onFormat(item.format)
    } else if ('action' in item) {
      if (item.action === 'sidebar') onToggleSidebar()
      else if (item.action === 'source') onToggleSource()
    }
    onClose()
  }

  return (
    <div className="context-menu" ref={menuRef} style={{ left: x, top: y }}>
      {MENU_ITEMS.map((item, i) =>
        'type' in item && item.type === 'separator' ? (
          <div key={i} className="context-menu-separator" />
        ) : (
          <button
            key={i}
            className="context-menu-item"
            onClick={() => handleClick(item)}
          >
            <span className="context-menu-label">{'label' in item ? item.label : ''}</span>
            <span className="context-menu-shortcut">{'shortcut' in item ? item.shortcut : ''}</span>
          </button>
        )
      )}
    </div>
  )
}

export default ContextMenu
