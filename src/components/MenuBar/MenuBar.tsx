import { useState, useEffect, useRef, useCallback } from 'react'
import './MenuBar.css'

interface MenuItem {
  label?: string
  shortcut?: string
  action?: string
  type?: 'separator'
  submenu?: MenuItem[]
}

interface MenuGroup {
  label: string
  items: MenuItem[]
}

interface MenuBarProps {
  onAction: (action: string) => void
}

const MENUS: MenuGroup[] = [
  {
    label: 'File',
    items: [
      { label: 'New Tab', shortcut: 'Ctrl+T', action: 'new-file' },
      { label: 'Close Tab', shortcut: 'Ctrl+W', action: 'close-tab' },
      { type: 'separator' },
      { label: 'Open File...', shortcut: 'Ctrl+O', action: 'open-file' },
      { label: 'Open Folder...', shortcut: 'Ctrl+Shift+O', action: 'open-folder' },
      { type: 'separator' },
      { label: 'Save', shortcut: 'Ctrl+S', action: 'save' },
      { label: 'Save As...', shortcut: 'Ctrl+Shift+S', action: 'save-as' },
      { type: 'separator' },
      {
        label: 'Export',
        submenu: [
          { label: 'HTML', action: 'export-html' },
          { label: 'PDF', action: 'export-pdf' },
        ],
      },
      { type: 'separator' },
      { label: 'Preferences', shortcut: 'Ctrl+,', action: 'preferences' },
      { type: 'separator' },
      { label: 'Close Window', action: 'close-window' },
    ],
  },
  {
    label: 'Edit',
    items: [
      { label: 'Undo', shortcut: 'Ctrl+Z', action: 'undo' },
      { label: 'Redo', shortcut: 'Ctrl+Y', action: 'redo' },
      { type: 'separator' },
      { label: 'Cut', shortcut: 'Ctrl+X', action: 'cut' },
      { label: 'Copy', shortcut: 'Ctrl+C', action: 'copy' },
      { label: 'Paste', shortcut: 'Ctrl+V', action: 'paste' },
      { type: 'separator' },
      { label: 'Select All', shortcut: 'Ctrl+A', action: 'select-all' },
      { type: 'separator' },
      { label: 'Find & Replace', shortcut: 'Ctrl+F', action: 'find' },
    ],
  },
  {
    label: 'Paragraph',
    items: [
      { label: 'Heading 1', shortcut: 'Ctrl+1', action: 'format:h1' },
      { label: 'Heading 2', shortcut: 'Ctrl+2', action: 'format:h2' },
      { label: 'Heading 3', shortcut: 'Ctrl+3', action: 'format:h3' },
      { label: 'Heading 4', shortcut: 'Ctrl+4', action: 'format:h4' },
      { label: 'Heading 5', shortcut: 'Ctrl+5', action: 'format:h5' },
      { label: 'Heading 6', shortcut: 'Ctrl+6', action: 'format:h6' },
      { type: 'separator' },
      { label: 'Table', action: 'format:table' },
      { label: 'Code Block', shortcut: 'Ctrl+Shift+K', action: 'format:codeBlock' },
      { type: 'separator' },
      { label: 'Quote', shortcut: 'Ctrl+Shift+Q', action: 'format:blockquote' },
      { type: 'separator' },
      { label: 'Ordered List', action: 'format:orderedList' },
      { label: 'Unordered List', action: 'format:bulletList' },
      { label: 'Task List', action: 'format:taskList' },
      { type: 'separator' },
      { label: 'Horizontal Line', action: 'format:horizontalRule' },
    ],
  },
  {
    label: 'Format',
    items: [
      { label: 'Bold', shortcut: 'Ctrl+B', action: 'format:bold' },
      { label: 'Italic', shortcut: 'Ctrl+I', action: 'format:italic' },
      { label: 'Underline', shortcut: 'Ctrl+U', action: 'format:underline' },
      { label: 'Code', shortcut: 'Ctrl+E', action: 'format:code' },
      { type: 'separator' },
      { label: 'Strikethrough', shortcut: 'Ctrl+Shift+X', action: 'format:strike' },
      { label: 'Highlight', action: 'format:highlight' },
      { type: 'separator' },
      { label: 'Hyperlink', shortcut: 'Ctrl+K', action: 'format:link' },
      { label: 'Image', action: 'format:image' },
      { type: 'separator' },
      { label: 'Clear Format', action: 'clear-format' },
    ],
  },
  {
    label: 'View',
    items: [
      { label: 'Toggle Sidebar', shortcut: 'Ctrl+\\', action: 'toggle-sidebar' },
      { label: 'Source Code Mode', shortcut: 'Ctrl+/', action: 'toggle-source' },
      { label: 'Focus Mode', shortcut: 'Ctrl+Shift+F', action: 'focus-mode' },
      { type: 'separator' },
      { label: 'Toggle Dark Mode', shortcut: 'Ctrl+Shift+D', action: 'toggle-theme' },
      { type: 'separator' },
      { label: 'Zoom In', shortcut: 'Ctrl+Shift+=', action: 'zoom-in' },
      { label: 'Zoom Out', shortcut: 'Ctrl+Shift+-', action: 'zoom-out' },
      { label: 'Actual Size', shortcut: 'Ctrl+Shift+9', action: 'zoom-reset' },
      { type: 'separator' },
      { label: 'Toggle Fullscreen', shortcut: 'F11', action: 'toggle-fullscreen' },
    ],
  },
  {
    label: 'Help',
    items: [
      { label: 'Check for Updates...', action: 'check-updates' },
      { type: 'separator' },
      { label: 'About InkDown', action: 'about' },
      { label: 'GitHub Repository', action: 'github' },
      { type: 'separator' },
      { label: 'Keyboard Shortcuts', action: 'shortcuts' },
      { type: 'separator' },
      { label: 'Toggle DevTools', shortcut: 'F12', action: 'devtools' },
    ],
  },
]

function MenuBar({ onAction }: MenuBarProps) {
  const [openMenu, setOpenMenu] = useState<number | null>(null)
  const [submenuOpen, setSubmenuOpen] = useState<number | null>(null)
  const menuBarRef = useRef<HTMLDivElement>(null)

  const handleClose = useCallback(() => {
    setOpenMenu(null)
    setSubmenuOpen(null)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuBarRef.current && !menuBarRef.current.contains(e.target as Node)) {
        handleClose()
      }
    }
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [handleClose])

  const handleMenuClick = (index: number) => {
    setOpenMenu((prev) => (prev === index ? null : index))
    setSubmenuOpen(null)
  }

  const handleMenuEnter = (index: number) => {
    if (openMenu !== null) {
      setOpenMenu(index)
      setSubmenuOpen(null)
    }
  }

  const handleItemClick = (action: string | undefined) => {
    if (!action) return
    handleClose()
    onAction(action)
  }

  return (
    <div className="menubar" ref={menuBarRef}>
      {MENUS.map((menu, mi) => (
        <div key={menu.label} className="menubar-menu">
          <button
            className={`menubar-trigger ${openMenu === mi ? 'active' : ''}`}
            onClick={() => handleMenuClick(mi)}
            onMouseEnter={() => handleMenuEnter(mi)}
          >
            {menu.label}
          </button>
          {openMenu === mi && (
            <div className="menubar-dropdown">
              {menu.items.map((item, ii) =>
                item.type === 'separator' ? (
                  <div key={ii} className="menubar-separator" />
                ) : item.submenu ? (
                  <div
                    key={ii}
                    className="menubar-item menubar-submenu-trigger"
                    onMouseEnter={() => setSubmenuOpen(ii)}
                    onMouseLeave={() => setSubmenuOpen(null)}
                  >
                    <span className="menubar-label">{item.label}</span>
                    <span className="menubar-arrow">&#9654;</span>
                    {submenuOpen === ii && (
                      <div className="menubar-submenu">
                        {item.submenu.map((sub, si) => (
                          <button
                            key={si}
                            className="menubar-item"
                            onClick={() => handleItemClick(sub.action)}
                          >
                            <span className="menubar-label">{sub.label}</span>
                            {sub.shortcut && (
                              <span className="menubar-shortcut">{sub.shortcut}</span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    key={ii}
                    className="menubar-item"
                    onClick={() => handleItemClick(item.action)}
                  >
                    <span className="menubar-label">{item.label}</span>
                    {item.shortcut && (
                      <span className="menubar-shortcut">{item.shortcut}</span>
                    )}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default MenuBar
