import { useState, useEffect, useCallback, useRef } from 'react'
import TitleBar from './components/TitleBar/TitleBar'
import TabBar from './components/TabBar/TabBar'
import Sidebar from './components/Sidebar/Sidebar'
import Editor from './components/Editor/Editor'
import Toolbar from './components/Toolbar/Toolbar'
import StatusBar from './components/StatusBar/StatusBar'
import ContextMenu from './components/ContextMenu/ContextMenu'
import FindReplace from './components/FindReplace/FindReplace'
import Settings, { DEFAULT_SETTINGS } from './components/Settings/Settings'
import type { SettingsData } from './components/Settings/Settings'
import { useTranslation } from './i18n'
import type { Editor as TiptapEditor } from '@tiptap/core'

type Theme = 'light' | 'dark'

const api = window.electronAPI

let tabIdCounter = 1
function nextTabId(): string {
  return `tab-${tabIdCounter++}`
}

function makeTab(filePath: string | null = null, markdown = ''): Tab {
  return { id: nextTabId(), filePath, markdown, isModified: false, scrollTop: 0 }
}

function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('inkdown-theme') as Theme | null
    if (saved) return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [focusMode, setFocusMode] = useState(false)
  const [sourceMode, setSourceMode] = useState(false)
  const [platform, setPlatform] = useState('win32')

  const [tabs, setTabs] = useState<Tab[]>(() => [makeTab()])
  const [activeTabId, setActiveTabId] = useState(() => tabs[0].id)
  const [content, setContent] = useState('')
  const [markdownContent, setMarkdownContent] = useState('')
  const [folderPath, setFolderPath] = useState<string | null>(null)
  const [folderTree, setFolderTree] = useState<FileTreeNode[]>([])
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [lineCount, setLineCount] = useState(0)

  const editorRef = useRef<TiptapEditor | null>(null)
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)
  const [showFind, setShowFind] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [fullWidth, setFullWidth] = useState(false)
  const [settings, setSettings] = useState<SettingsData>(() => {
    const saved = localStorage.getItem('inkdown-settings')
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS
  })

  const { t } = useTranslation(settings.language)

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0]

  const snapshotActiveTab = useCallback(() => {
    if (!editorRef.current) return
    const md = editorRef.current.storage.markdown.getMarkdown()
    const scrollEl = document.querySelector('.editor-scroll')
    const scrollTop = scrollEl ? scrollEl.scrollTop : 0
    setTabs((prev) =>
      prev.map((t) => (t.id === activeTabId ? { ...t, markdown: md, scrollTop } : t))
    )
  }, [activeTabId])

  const updateActiveTab = useCallback(
    (patch: Partial<Tab>) => {
      setTabs((prev) =>
        prev.map((t) => (t.id === activeTabId ? { ...t, ...patch } : t))
      )
    },
    [activeTabId]
  )

  useEffect(() => {
    api?.getPlatform().then((p) => {
      setPlatform(p)
      if (p === 'darwin') {
        document.documentElement.classList.add('platform-darwin')
      }
    })
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('inkdown-theme', theme)
  }, [theme])

  // Apply settings: theme, font size, spellcheck
  useEffect(() => {
    if (settings.theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(prefersDark ? 'dark' : 'light')
    } else {
      setTheme(settings.theme)
    }
    document.documentElement.style.setProperty('--editor-font-size', `${settings.fontSize}px`)
    localStorage.setItem('inkdown-settings', JSON.stringify(settings))
  }, [settings])

  const handleSaveSettings = useCallback((newSettings: SettingsData) => {
    setSettings(newSettings)
  }, [])

  // Auto-save by interval
  useEffect(() => {
    if (!settings.autoSave) return
    const interval = setInterval(() => {
      if (!editorRef.current || !activeTab.filePath) return
      const md = editorRef.current.storage.markdown.getMarkdown()
      if (activeTab.isModified) {
        api?.writeFile(activeTab.filePath, md).then((result) => {
          if (result.success) updateActiveTab({ isModified: false, markdown: md })
        })
      }
    }, settings.autoSaveInterval * 1000)
    return () => clearInterval(interval)
  }, [settings.autoSave, settings.autoSaveInterval, activeTab.filePath, activeTab.isModified, updateActiveTab])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }, [])

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev)
  }, [])

  const toggleFocusMode = useCallback(() => {
    setFocusMode((prev) => !prev)
  }, [])

  const toggleSourceMode = useCallback(() => {
    setSourceMode((prev) => !prev)
  }, [])

  const toggleFullWidth = useCallback(() => {
    setFullWidth((prev) => !prev)
  }, [])

  const switchTab = useCallback(
    (newTabId: string) => {
      if (newTabId === activeTabId) return
      snapshotActiveTab()
      setActiveTabId(newTabId)
      setSourceMode(false)
      const tab = tabs.find((t) => t.id === newTabId)
      if (tab) {
        setContent(tab.markdown)
        setMarkdownContent(tab.markdown)
      }
    },
    [activeTabId, tabs, snapshotActiveTab]
  )

  const handleNewFile = useCallback(() => {
    snapshotActiveTab()
    const tab = makeTab()
    setTabs((prev) => [...prev, tab])
    setActiveTabId(tab.id)
    setContent('')
    setMarkdownContent('')
    setSourceMode(false)
  }, [snapshotActiveTab])

  const closeTab = useCallback(
    (tabId: string) => {
      setTabs((prev) => {
        if (prev.length <= 1) {
          const fresh = makeTab()
          setActiveTabId(fresh.id)
          setContent('')
          setMarkdownContent('')
          return [fresh]
        }
        const idx = prev.findIndex((t) => t.id === tabId)
        const next = prev.filter((t) => t.id !== tabId)
        if (tabId === activeTabId) {
          const newIdx = Math.min(idx, next.length - 1)
          const newActive = next[newIdx]
          setActiveTabId(newActive.id)
          setContent(newActive.markdown)
          setMarkdownContent(newActive.markdown)
        }
        return next
      })
    },
    [activeTabId]
  )

  const handleSave = useCallback(async () => {
    if (!editorRef.current) return

    const md = editorRef.current.storage.markdown.getMarkdown()

    if (activeTab.filePath) {
      const result = await api.writeFile(activeTab.filePath, md)
      if (result.success) updateActiveTab({ isModified: false, markdown: md })
    } else {
      const filePath = await api.saveFileDialog({ defaultPath: 'untitled.md' })
      if (filePath) {
        const result = await api.writeFile(filePath, md)
        if (result.success) {
          updateActiveTab({ filePath, isModified: false, markdown: md })
        }
      }
    }
  }, [activeTab.filePath, updateActiveTab])

  const handleSaveAs = useCallback(async () => {
    if (!editorRef.current) return
    const md = editorRef.current.storage.markdown.getMarkdown()
    const filePath = await api.saveFileDialog({
      defaultPath: activeTab.filePath || 'untitled.md',
    })
    if (filePath) {
      const result = await api.writeFile(filePath, md)
      if (result.success) {
        updateActiveTab({ filePath, isModified: false, markdown: md })
      }
    }
  }, [activeTab.filePath, updateActiveTab])

  const handleExport = useCallback(
    async (format: string) => {
      if (!editorRef.current) return
      const htmlContent = editorRef.current.getHTML()
      if (format === 'html') {
        await api.exportHTML(htmlContent)
      } else if (format === 'pdf') {
        await api.exportPDF(htmlContent)
      }
    },
    []
  )

  const handleFileSelect = useCallback(
    async (filePath: string) => {
      const existing = tabs.find((t) => t.filePath === filePath)
      if (existing) {
        switchTab(existing.id)
        return
      }
      const result = await api.readFile(filePath)
      if (result.success && result.content !== undefined) {
        snapshotActiveTab()
        const tab = makeTab(filePath, result.content)
        setTabs((prev) => [...prev, tab])
        setActiveTabId(tab.id)
        setContent(result.content)
        setMarkdownContent(result.content)
        setSourceMode(false)
      }
    },
    [tabs, switchTab, snapshotActiveTab]
  )

  const handleContentChange = useCallback(
    (editor: TiptapEditor) => {
      updateActiveTab({ isModified: true })
      const text = editor.state.doc.textContent
      const words = text.trim() ? text.trim().split(/\s+/).length : 0
      setWordCount(words)
      setCharCount(text.length)
      const lines = editor.state.doc.content.content.length
      setLineCount(lines)
    },
    [updateActiveTab]
  )

  // Пересчитываем слова/символы/строки при смене файла или загрузке контента
  useEffect(() => {
    const trimmed = content.trim()
    const words = trimmed ? trimmed.split(/\s+/).length : 0
    setWordCount(words)
    setCharCount(trimmed.length)
    const lines = content.split('\n').length
    setLineCount(lines)
  }, [content])

  const handleEditorReady = useCallback((editor: TiptapEditor) => {
    editorRef.current = editor
  }, [])

  const handleFormat = useCallback(
    (_event: unknown, format: string) => {
      const editor = editorRef.current
      if (!editor) return
      switch (format) {
        case 'bold':
          editor.chain().focus().toggleBold().run()
          break
        case 'italic':
          editor.chain().focus().toggleItalic().run()
          break
        case 'underline':
          editor.chain().focus().toggleUnderline().run()
          break
        case 'strike':
          editor.chain().focus().toggleStrike().run()
          break
        case 'h1':
          editor.chain().focus().toggleHeading({ level: 1 }).run()
          break
        case 'h2':
          editor.chain().focus().toggleHeading({ level: 2 }).run()
          break
        case 'h3':
          editor.chain().focus().toggleHeading({ level: 3 }).run()
          break
        case 'h4':
          editor.chain().focus().toggleHeading({ level: 4 }).run()
          break
        case 'h5':
          editor.chain().focus().toggleHeading({ level: 5 }).run()
          break
        case 'h6':
          editor.chain().focus().toggleHeading({ level: 6 }).run()
          break
        case 'code':
          editor.chain().focus().toggleCode().run()
          break
        case 'codeBlock':
          editor.chain().focus().toggleCodeBlock().run()
          break
        case 'blockquote':
          editor.chain().focus().toggleBlockquote().run()
          break
        case 'bulletList':
          editor.chain().focus().toggleBulletList().run()
          break
        case 'orderedList':
          editor.chain().focus().toggleOrderedList().run()
          break
        case 'taskList':
          editor.chain().focus().toggleTaskList().run()
          break
        case 'highlight':
          editor.chain().focus().toggleHighlight().run()
          break
        case 'link': {
          const url = prompt('Enter URL:')
          if (url) editor.chain().focus().setLink({ href: url }).run()
          break
        }
        case 'image': {
          const src = prompt('Enter image URL:')
          if (src) editor.chain().focus().setImage({ src }).run()
          break
        }
        case 'horizontalRule':
          editor.chain().focus().setHorizontalRule().run()
          break
        case 'table':
          editor
            .chain()
            .focus()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run()
          break
      }
    },
    []
  )

  const handleMenuAction = useCallback(
    (action: string) => {
      if (action.startsWith('format:')) {
        handleFormat(null, action.slice(7))
        return
      }
      if (action.startsWith('open-recent-file:')) {
        const filePath = action.slice('open-recent-file:'.length)
        handleFileSelect(filePath)
        return
      }
      if (action.startsWith('open-recent-folder:')) {
        const folderPath = action.slice('open-recent-folder:'.length)
        api?.readFolder(folderPath).then((result) => {
          if (result.success && result.tree) {
            setFolderPath(folderPath)
            setFolderTree(result.tree)
            setSidebarOpen(true)
          }
        })
        return
      }
      switch (action) {
        case 'new-file':
          handleNewFile()
          break
        case 'open-file':
          api?.openFile()
          break
        case 'open-folder':
          api?.openFolder()
          break
        case 'save':
          handleSave()
          break
        case 'save-as':
          handleSaveAs()
          break
        case 'export-html':
          handleExport('html')
          break
        case 'export-pdf':
          handleExport('pdf')
          break
        case 'close-window':
          api?.closeWindow()
          break
        case 'close-tab':
          closeTab(activeTabId)
          break
        case 'toggle-sidebar':
          toggleSidebar()
          break
        case 'toggle-source':
          toggleSourceMode()
          break
        case 'focus-mode':
          toggleFocusMode()
          break
        case 'toggle-theme':
          toggleTheme()
          break
        case 'find':
          setShowFind(true)
          break
        case 'clear-format':
          editorRef.current?.chain().focus().clearNodes().unsetAllMarks().run()
          break
        case 'undo':
          editorRef.current?.chain().focus().undo().run()
          break
        case 'redo':
          editorRef.current?.chain().focus().redo().run()
          break
        case 'cut':
          if (api?.editCut) api.editCut()
          else document.execCommand('cut')
          break
        case 'copy':
          if (api?.editCopy) api.editCopy()
          else document.execCommand('copy')
          break
        case 'paste':
          if (api?.editPaste) api.editPaste()
          else navigator.clipboard.readText().then(text => {
            editorRef.current?.chain().focus().insertContent(text).run()
          }).catch(() => {})
          break
        case 'select-all':
          editorRef.current?.chain().focus().selectAll().run()
          break
        case 'about':
          api?.getVersion().then(v => {
            alert(`${t('about.title')} v${v}\n${t('about.description')}\n${t('about.builtWith')}\n\nhttps://github.com/BOSSincrypto/inkdown`)
          })
          break
        case 'check-updates':
          api?.checkForUpdates()
          break
        case 'github':
          api?.openExternal('https://github.com/BOSSincrypto/inkdown')
          break
        case 'preferences':
          setShowSettings(true)
          break
        case 'shortcuts':
          alert(
            `${t('shortcuts.title')}:\n\n` +
            `Ctrl+T — ${t('shortcuts.newTab')}\n` +
            `Ctrl+W — ${t('shortcuts.closeTab')}\n` +
            `Ctrl+S — ${t('shortcuts.save')}\n` +
            `Ctrl+Shift+S — ${t('shortcuts.saveAs')}\n` +
            `Ctrl+O — ${t('shortcuts.openFile')}\n` +
            `Ctrl+Shift+O — ${t('shortcuts.openFolder')}\n` +
            `Ctrl+Z — ${t('shortcuts.undo')}\n` +
            `Ctrl+Y — ${t('shortcuts.redo')}\n` +
            `Ctrl+F — ${t('shortcuts.find')}\n` +
            `Ctrl+\\ — ${t('shortcuts.toggleSidebar')}\n` +
            `Ctrl+/ — ${t('shortcuts.sourceMode')}\n` +
            `Ctrl+Shift+F — ${t('shortcuts.focusMode')}\n` +
            `Ctrl+Shift+D — ${t('shortcuts.toggleTheme')}\n` +
            `Ctrl+Tab — ${t('shortcuts.nextTab')}\n` +
            `Ctrl+Shift+Tab — ${t('shortcuts.prevTab')}\n` +
            `F11 — ${t('shortcuts.fullscreen')}\n` +
            `F12 — ${t('shortcuts.devtools')}`
          )
          break
        case 'devtools':
          api?.toggleDevTools?.()
          break
        case 'zoom-in':
          api?.zoomIn?.()
          break
        case 'zoom-out':
          api?.zoomOut?.()
          break
        case 'zoom-reset':
          api?.zoomReset?.()
          break
        case 'toggle-fullscreen':
          api?.toggleFullscreen?.()
          break
      }
    },
    [handleNewFile, handleSave, handleSaveAs, handleExport, handleFormat, closeTab, activeTabId, toggleSidebar, toggleSourceMode, toggleFocusMode, toggleTheme, t, handleFileSelect]
  )

  const handleSourceChange = useCallback((newMarkdown: string) => {
    setMarkdownContent(newMarkdown)
    setContent(newMarkdown)
    updateActiveTab({ isModified: true })
  }, [updateActiveTab])

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY })
  }, [])

  const handleContextFormat = useCallback(
    (format: string) => {
      handleFormat(null, format)
    },
    [handleFormat]
  )

  // Ctrl+Scroll zoom
  useEffect(() => {
    const editorEl = document.querySelector('.editor-scroll')
    if (!editorEl) return

    const handleWheel = (e: Event) => {
      const we = e as WheelEvent
      if (we.ctrlKey || we.metaKey) {
        we.preventDefault()
        const currentSize = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue('--editor-font-size') || '16',
          10
        )
        const delta = we.deltaY > 0 ? -1 : 1
        const newSize = Math.min(32, Math.max(10, currentSize + delta))
        document.documentElement.style.setProperty('--editor-font-size', `${newSize}px`)
        setSettings((prev) => ({ ...prev, fontSize: newSize }))
      }
    }

    editorEl.addEventListener('wheel', handleWheel, { passive: false })
    return () => editorEl.removeEventListener('wheel', handleWheel)
  }, [])

  // Warn before closing with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const hasUnsaved = tabs.some((t) => t.isModified)
      if (hasUnsaved) {
        e.preventDefault()
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [tabs])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const ctrlOrMeta = e.ctrlKey || e.metaKey
      if (ctrlOrMeta && e.key === 't') {
        e.preventDefault()
        handleNewFile()
      } else if (ctrlOrMeta && e.key === 'Tab') {
        e.preventDefault()
        const idx = tabs.findIndex((t) => t.id === activeTabId)
        if (e.shiftKey) {
          const prev = (idx - 1 + tabs.length) % tabs.length
          switchTab(tabs[prev].id)
        } else {
          const next = (idx + 1) % tabs.length
          switchTab(tabs[next].id)
        }
      } else if (ctrlOrMeta && e.key === 's') {
        e.preventDefault()
        if (e.shiftKey) {
          handleSaveAs()
        } else {
          handleSave()
        }
      } else if (ctrlOrMeta && e.key === 'w') {
        e.preventDefault()
        closeTab(activeTabId)
      } else if (ctrlOrMeta && e.key === 'o') {
        e.preventDefault()
        if (e.shiftKey) {
          api?.openFolder()
        } else {
          api?.openFile()
        }
      } else if (ctrlOrMeta && e.key === 'f') {
        e.preventDefault()
        setShowFind(true)
      } else if (ctrlOrMeta && e.key === '\\') {
        e.preventDefault()
        toggleSidebar()
      } else if (ctrlOrMeta && e.key === '/') {
        e.preventDefault()
        toggleSourceMode()
      } else if (ctrlOrMeta && e.shiftKey && e.key === 'F') {
        e.preventDefault()
        toggleFocusMode()
      } else if (ctrlOrMeta && e.shiftKey && e.key === 'D') {
        e.preventDefault()
        toggleTheme()
      } else if (e.key === 'F11') {
        e.preventDefault()
        api?.toggleFullscreen?.()
      } else if (e.key === 'F12') {
        e.preventDefault()
        api?.toggleDevTools?.()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleNewFile, handleSave, handleSaveAs, closeTab, activeTabId, tabs, switchTab, toggleSidebar, toggleSourceMode, toggleFocusMode, toggleTheme])

  // Register Electron menu listeners
  useEffect(() => {
    if (!api) return
    const cleanups = [
      api.onMenuNewFile(handleNewFile),
      api.onMenuSave(handleSave),
      api.onMenuSaveAs(handleSaveAs),
      api.onMenuExport((_event, format) => handleExport(format)),
      api.onMenuToggleSidebar(toggleSidebar),
      api.onMenuToggleSource(toggleSourceMode),
      api.onMenuFocusMode(toggleFocusMode),
      api.onMenuToggleTheme(toggleTheme),
      api.onMenuFormat(handleFormat),
      api.onMenuFind(() => setShowFind(true)),
      api.onMenuCloseTab(() => closeTab(activeTabId)),
      api.onFileOpened((_event, data) => {
        const existing = tabs.find((t) => t.filePath === data.filePath)
        if (existing) {
          switchTab(existing.id)
          return
        }
        snapshotActiveTab()
        const tab = makeTab(data.filePath, data.content)
        setTabs((prev) => [...prev, tab])
        setActiveTabId(tab.id)
        setContent(data.content)
        setMarkdownContent(data.content)
        setSourceMode(false)
      }),
      api.onFolderOpened((_event, data) => {
        setFolderPath(data.folderPath)
        setFolderTree(data.tree)
        setSidebarOpen(true)
      }),
    ]
    return () => cleanups.forEach((cleanup) => cleanup())
  }, [
    handleNewFile,
    handleSave,
    handleSaveAs,
    handleExport,
    toggleSidebar,
    toggleSourceMode,
    toggleFocusMode,
    toggleTheme,
    handleFormat,
    closeTab,
    activeTabId,
    tabs,
    switchTab,
    snapshotActiveTab,
  ])

  const fileName = activeTab.filePath
    ? activeTab.filePath.split(/[/\\]/).pop() || 'Untitled'
    : 'Untitled'

  return (
    <div className={`app ${focusMode ? 'focus-mode' : ''}`}>
      <TitleBar
        fileName={fileName}
        isModified={activeTab.isModified}
        theme={theme}
        platform={platform}
        onMenuAction={handleMenuAction}
        t={t}
      />

      <TabBar
        tabs={tabs}
        activeTabId={activeTabId}
        onSelectTab={switchTab}
        onCloseTab={closeTab}
        onNewTab={handleNewFile}
      />

      {!focusMode && (
        <Toolbar
          editor={editorRef.current}
          onFormat={handleFormat}
          sourceMode={sourceMode}
          onToggleSource={toggleSourceMode}
          fullWidth={fullWidth}
          onToggleFullWidth={toggleFullWidth}
        />
      )}

      <div className="app-body" onContextMenu={handleContextMenu}>
        {sidebarOpen && !focusMode && (
          <Sidebar
            folderPath={folderPath}
            folderTree={folderTree}
            currentFile={activeTab.filePath}
            onFileSelect={handleFileSelect}
            onOpenFolder={() => api?.openFolder()}
            editor={editorRef.current}
            t={t}
          />
        )}

        <div className={`editor-area ${fullWidth ? 'full-width' : ''}`}>
          {showFind && (
            <FindReplace
              editor={editorRef.current}
              tabId={activeTabId}
              onClose={() => setShowFind(false)}
              t={t}
            />
          )}
          <Editor
            content={content}
            markdownContent={markdownContent}
            sourceMode={sourceMode}
            spellcheck={settings.spellcheck}
            restoreScrollTop={activeTab.scrollTop}
            t={t}
            onContentChange={handleContentChange}
            onEditorReady={handleEditorReady}
            onSourceChange={handleSourceChange}
          />
        </div>
      </div>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onFormat={handleContextFormat}
          onToggleSidebar={toggleSidebar}
          onToggleSource={toggleSourceMode}
        />
      )}

      {!focusMode && (
        <StatusBar
          wordCount={wordCount}
          charCount={charCount}
          lineCount={lineCount}
          isModified={activeTab.isModified}
          sourceMode={sourceMode}
          theme={theme}
          onToggleTheme={toggleTheme}
          onToggleSidebar={toggleSidebar}
          sidebarOpen={sidebarOpen}
          currentFile={activeTab.filePath}
          t={t}
        />
      )}

      <Settings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSave={handleSaveSettings}
      />
    </div>
  )
}

export default App
