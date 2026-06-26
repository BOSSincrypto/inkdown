import { useState, useEffect, useRef, useCallback } from 'react'
import type { TranslationKey } from '../../i18n'
import './MenuBar.css'

const api = window.electronAPI

interface MenuItem {
  label?: TranslationKey
  shortcut?: string
  action?: string
  type?: 'separator'
  submenu?: MenuItem[]
}

interface MenuGroup {
  label: TranslationKey
  items: MenuItem[]
}

interface MenuBarProps {
  onAction: (action: string) => void
  t: (key: TranslationKey) => string
}

const MENUS: MenuGroup[] = [
  {
    label: 'menu.file',
    items: [
      { label: 'file.newTab', shortcut: 'Ctrl+T', action: 'new-file' },
      { label: 'file.closeTab', shortcut: 'Ctrl+W', action: 'close-tab' },
      { type: 'separator' },
      { label: 'file.openFile', shortcut: 'Ctrl+O', action: 'open-file' },
      { label: 'file.openFolder', shortcut: 'Ctrl+Shift+O', action: 'open-folder' },
      { type: 'separator' },
      { label: 'file.recent', submenu: [] },
      { type: 'separator' },
      { label: 'file.save', shortcut: 'Ctrl+S', action: 'save' },
      { label: 'file.saveAs', shortcut: 'Ctrl+Shift+S', action: 'save-as' },
      { type: 'separator' },
      {
        label: 'file.export',
        submenu: [
          { label: 'file.exportHTML', action: 'export-html' },
          { label: 'file.exportPDF', action: 'export-pdf' },
        ],
      },
      { type: 'separator' },
      { label: 'file.preferences', shortcut: 'Ctrl+,', action: 'preferences' },
      { type: 'separator' },
      { label: 'file.closeWindow', action: 'close-window' },
    ],
  },
  {
    label: 'menu.edit',
    items: [
      { label: 'edit.undo', shortcut: 'Ctrl+Z', action: 'undo' },
      { label: 'edit.redo', shortcut: 'Ctrl+Y', action: 'redo' },
      { type: 'separator' },
      { label: 'edit.cut', shortcut: 'Ctrl+X', action: 'cut' },
      { label: 'edit.copy', shortcut: 'Ctrl+C', action: 'copy' },
      { label: 'edit.paste', shortcut: 'Ctrl+V', action: 'paste' },
      { type: 'separator' },
      { label: 'edit.selectAll', shortcut: 'Ctrl+A', action: 'select-all' },
      { type: 'separator' },
      { label: 'edit.find', shortcut: 'Ctrl+F', action: 'find' },
    ],
  },
  {
    label: 'menu.paragraph',
    items: [
      { label: 'paragraph.heading1', shortcut: 'Ctrl+1', action: 'format:h1' },
      { label: 'paragraph.heading2', shortcut: 'Ctrl+2', action: 'format:h2' },
      { label: 'paragraph.heading3', shortcut: 'Ctrl+3', action: 'format:h3' },
      { label: 'paragraph.heading4', shortcut: 'Ctrl+4', action: 'format:h4' },
      { label: 'paragraph.heading5', shortcut: 'Ctrl+5', action: 'format:h5' },
      { label: 'paragraph.heading6', shortcut: 'Ctrl+6', action: 'format:h6' },
      { type: 'separator' },
      { label: 'paragraph.table', action: 'format:table' },
      { label: 'paragraph.codeBlock', shortcut: 'Ctrl+Shift+K', action: 'format:codeBlock' },
      { type: 'separator' },
      { label: 'paragraph.quote', shortcut: 'Ctrl+Shift+Q', action: 'format:blockquote' },
      { type: 'separator' },
      { label: 'paragraph.orderedList', action: 'format:orderedList' },
      { label: 'paragraph.unorderedList', action: 'format:bulletList' },
      { label: 'paragraph.taskList', action: 'format:taskList' },
      { type: 'separator' },
      { label: 'paragraph.horizontalLine', action: 'format:horizontalRule' },
    ],
  },
  {
    label: 'menu.format',
    items: [
      { label: 'format.bold', shortcut: 'Ctrl+B', action: 'format:bold' },
      { label: 'format.italic', shortcut: 'Ctrl+I', action: 'format:italic' },
      { label: 'format.underline', shortcut: 'Ctrl+U', action: 'format:underline' },
      { label: 'format.code', shortcut: 'Ctrl+E', action: 'format:code' },
      { type: 'separator' },
      { label: 'format.strikethrough', shortcut: 'Ctrl+Shift+X', action: 'format:strike' },
      { label: 'format.highlight', action: 'format:highlight' },
      { type: 'separator' },
      { label: 'format.hyperlink', shortcut: 'Ctrl+K', action: 'format:link' },
      { label: 'format.image', action: 'format:image' },
      { type: 'separator' },
      { label: 'format.clearFormat', action: 'clear-format' },
    ],
  },
  {
    label: 'menu.view',
    items: [
      { label: 'view.toggleSidebar', shortcut: 'Ctrl+\\', action: 'toggle-sidebar' },
      { label: 'view.sourceMode', shortcut: 'Ctrl+/', action: 'toggle-source' },
      { label: 'view.focusMode', shortcut: 'Ctrl+Shift+F', action: 'focus-mode' },
      { type: 'separator' },
      { label: 'view.toggleDarkMode', shortcut: 'Ctrl+Shift+D', action: 'toggle-theme' },
      { type: 'separator' },
      { label: 'view.zoomIn', shortcut: 'Ctrl+Shift+=', action: 'zoom-in' },
      { label: 'view.zoomOut', shortcut: 'Ctrl+Shift+-', action: 'zoom-out' },
      { label: 'view.actualSize', shortcut: 'Ctrl+Shift+9', action: 'zoom-reset' },
      { type: 'separator' },
      { label: 'view.toggleFullscreen', shortcut: 'F11', action: 'toggle-fullscreen' },
    ],
  },
  {
    label: 'menu.help',
    items: [
      { label: 'help.checkUpdates', action: 'check-updates' },
      { type: 'separator' },
      { label: 'help.about', action: 'about' },
      { label: 'help.github', action: 'github' },
      { type: 'separator' },
      { label: 'help.shortcuts', action: 'shortcuts' },
      { type: 'separator' },
      { label: 'help.devtools', shortcut: 'F12', action: 'devtools' },
    ],
  },
]

function MenuBar({ onAction, t }: MenuBarProps) {
  const [openMenu, setOpenMenu] = useState<number | null>(null)
  const [submenuOpen, setSubmenuOpen] = useState<number | null>(null)
  const [recentFiles, setRecentFiles] = useState<string[]>([])
  const [recentFolders, setRecentFolders] = useState<string[]>([])
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

  const loadRecent = useCallback(async () => {
    const [files, folders] = await Promise.all([
      api?.getRecentFiles() || Promise.resolve([]),
      api?.getRecentFolders() || Promise.resolve([]),
    ])
    setRecentFiles(files)
    setRecentFolders(folders)
  }, [])

  const handleRecentHover = useCallback(async () => {
    await loadRecent()
  }, [loadRecent])

  const handleRecentFile = useCallback((filePath: string) => {
    handleClose()
    onAction('open-recent-file:' + filePath)
  }, [handleClose, onAction])

  const handleRecentFolder = useCallback((folderPath: string) => {
    handleClose()
    onAction('open-recent-folder:' + folderPath)
  }, [handleClose, onAction])

  const handleClearRecent = useCallback(async () => {
    await api?.clearRecent()
    setRecentFiles([])
    setRecentFolders([])
    handleClose()
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
            {t(menu.label)}
          </button>
          {openMenu === mi && (
            <div className="menubar-dropdown">
              {menu.items.map((item, ii) =>
                item.type === 'separator' ? (
                  <div key={ii} className="menubar-separator" />
                ) : item.label === 'file.recent' ? (
                  <div
                    key={ii}
                    className="menubar-item menubar-submenu-trigger"
                    onMouseEnter={() => { setSubmenuOpen(ii); handleRecentHover() }}
                    onMouseLeave={() => setSubmenuOpen(null)}
                  >
                    <span className="menubar-label">{t(item.label)}</span>
                    <span className="menubar-arrow">&#9654;</span>
                    {submenuOpen === ii && (
                      <div className="menubar-submenu recent-dropdown">
                        {recentFiles.length === 0 && recentFolders.length === 0 ? (
                          <div className="menubar-item disabled">
                            <span className="menubar-label">{t('file.noRecent')}</span>
                          </div>
                        ) : (
                          <>
                            {recentFolders.length > 0 && (
                              <>
                                <div className="menubar-recent-header">{t('file.recentFolders')}</div>
                                {recentFolders.map((folder, fi) => {
                                  const name = folder.split(/[/\\]/).pop() || folder
                                  return (
                                    <button
                                      key={`f-${fi}`}
                                      className="menubar-item"
                                      onClick={() => handleRecentFolder(folder)}
                                    >
                                      <span className="menubar-label recent-name">{name}</span>
                                      <span className="menubar-recent-path">{folder}</span>
                                    </button>
                                  )
                                })}
                              </>
                            )}
                            {recentFiles.length > 0 && (
                              <>
                                {recentFolders.length > 0 && <div className="menubar-separator" />}
                                <div className="menubar-recent-header">{t('file.recentFiles')}</div>
                                {recentFiles.map((file, fi) => {
                                  const name = file.split(/[/\\]/).pop() || file
                                  return (
                                    <button
                                      key={`d-${fi}`}
                                      className="menubar-item"
                                      onClick={() => handleRecentFile(file)}
                                    >
                                      <span className="menubar-label recent-name">{name}</span>
                                      <span className="menubar-recent-path">{file}</span>
                                    </button>
                                  )
                                })}
                              </>
                            )}
                            <div className="menubar-separator" />
                            <button className="menubar-item" onClick={handleClearRecent}>
                              <span className="menubar-label">{t('file.clearRecent')}</span>
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ) : item.submenu ? (
                  <div
                    key={ii}
                    className="menubar-item menubar-submenu-trigger"
                    onMouseEnter={() => setSubmenuOpen(ii)}
                    onMouseLeave={() => setSubmenuOpen(null)}
                  >
                    <span className="menubar-label">{item.label ? t(item.label) : ''}</span>
                    <span className="menubar-arrow">&#9654;</span>
                    {submenuOpen === ii && (
                      <div className="menubar-submenu">
                        {item.submenu.map((sub, si) => (
                          <button
                            key={si}
                            className="menubar-item"
                            onClick={() => handleItemClick(sub.action)}
                          >
                            <span className="menubar-label">{sub.label ? t(sub.label) : ''}</span>
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
                    <span className="menubar-label">{item.label ? t(item.label) : ''}</span>
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
