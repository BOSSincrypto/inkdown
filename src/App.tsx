import { useState, useEffect, useCallback, useRef } from 'react'
import TitleBar from './components/TitleBar/TitleBar'
import Sidebar from './components/Sidebar/Sidebar'
import Editor from './components/Editor/Editor'
import Toolbar from './components/Toolbar/Toolbar'
import StatusBar from './components/StatusBar/StatusBar'
import ContextMenu from './components/ContextMenu/ContextMenu'
import type { Editor as TiptapEditor } from '@tiptap/core'

type Theme = 'light' | 'dark'

const api = window.electronAPI

function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('inkdown-theme') as Theme) || 'light'
  })
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [focusMode, setFocusMode] = useState(false)
  const [sourceMode, setSourceMode] = useState(false)
  const [platform, setPlatform] = useState('win32')

  const [currentFile, setCurrentFile] = useState<string | null>(null)
  const [content, setContent] = useState('')
  const [markdownContent, setMarkdownContent] = useState('')
  const [isModified, setIsModified] = useState(false)
  const [folderPath, setFolderPath] = useState<string | null>(null)
  const [folderTree, setFolderTree] = useState<FileTreeNode[]>([])
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)

  const editorRef = useRef<TiptapEditor | null>(null)
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)

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

  const handleNewFile = useCallback(() => {
    setCurrentFile(null)
    setContent('')
    setMarkdownContent('')
    setIsModified(false)
  }, [])

  const handleSave = useCallback(async () => {
    if (!editorRef.current) return

    const md = editorRef.current.storage.markdown.getMarkdown()

    if (currentFile) {
      const result = await api.writeFile(currentFile, md)
      if (result.success) setIsModified(false)
    } else {
      const filePath = await api.saveFileDialog({ defaultPath: 'untitled.md' })
      if (filePath) {
        const result = await api.writeFile(filePath, md)
        if (result.success) {
          setCurrentFile(filePath)
          setIsModified(false)
        }
      }
    }
  }, [currentFile])

  const handleSaveAs = useCallback(async () => {
    if (!editorRef.current) return
    const md = editorRef.current.storage.markdown.getMarkdown()
    const filePath = await api.saveFileDialog({
      defaultPath: currentFile || 'untitled.md',
    })
    if (filePath) {
      const result = await api.writeFile(filePath, md)
      if (result.success) {
        setCurrentFile(filePath)
        setIsModified(false)
      }
    }
  }, [currentFile])

  const handleExport = useCallback(
    async (_event: unknown, format: string) => {
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

  const handleFileSelect = useCallback(async (filePath: string) => {
    const result = await api.readFile(filePath)
    if (result.success && result.content !== undefined) {
      setCurrentFile(filePath)
      setContent(result.content)
      setMarkdownContent(result.content)
      setIsModified(false)
    }
  }, [])

  const handleContentChange = useCallback(
    (editor: TiptapEditor) => {
      setIsModified(true)
      const text = editor.state.doc.textContent
      const words = text.trim() ? text.trim().split(/\s+/).length : 0
      setWordCount(words)
      setCharCount(text.length)
    },
    []
  )

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
          handleExport(null, 'html')
          break
        case 'export-pdf':
          handleExport(null, 'pdf')
          break
        case 'close-window':
          api?.closeWindow()
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
        case 'about':
          alert('InkDown v1.1.1\nThe open-source WYSIWYG markdown editor.\n\nhttps://github.com/BOSSincrypto/inkdown')
          break
        case 'github':
          window.open('https://github.com/BOSSincrypto/inkdown', '_blank')
          break
      }
    },
    [handleNewFile, handleSave, handleSaveAs, handleExport, handleFormat, toggleSidebar, toggleSourceMode, toggleFocusMode, toggleTheme]
  )

  const handleSourceChange = useCallback((newMarkdown: string) => {
    setMarkdownContent(newMarkdown)
    setContent(newMarkdown)
    setIsModified(true)
  }, [])

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

  // Register Electron menu listeners
  useEffect(() => {
    if (!api) return
    const cleanups = [
      api.onMenuNewFile(handleNewFile),
      api.onMenuSave(handleSave),
      api.onMenuSaveAs(handleSaveAs),
      api.onMenuExport(handleExport),
      api.onMenuToggleSidebar(toggleSidebar),
      api.onMenuToggleSource(toggleSourceMode),
      api.onMenuFocusMode(toggleFocusMode),
      api.onMenuToggleTheme(toggleTheme),
      api.onMenuFormat(handleFormat),
      api.onFileOpened((_event, data) => {
        setCurrentFile(data.filePath)
        setContent(data.content)
        setMarkdownContent(data.content)
        setIsModified(false)
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
  ])

  const fileName = currentFile
    ? currentFile.split(/[/\\]/).pop() || 'Untitled'
    : 'Untitled'

  return (
    <div className={`app ${focusMode ? 'focus-mode' : ''}`}>
      <TitleBar
        fileName={fileName}
        isModified={isModified}
        theme={theme}
        platform={platform}
        onMenuAction={handleMenuAction}
      />

      {!focusMode && (
        <Toolbar
          editor={editorRef.current}
          onFormat={handleFormat}
          sourceMode={sourceMode}
          onToggleSource={toggleSourceMode}
        />
      )}

      <div className="app-body" onContextMenu={handleContextMenu}>
        {sidebarOpen && !focusMode && (
          <Sidebar
            folderPath={folderPath}
            folderTree={folderTree}
            currentFile={currentFile}
            onFileSelect={handleFileSelect}
            onOpenFolder={() => api?.openFolder()}
          />
        )}

        <Editor
          content={content}
          markdownContent={markdownContent}
          sourceMode={sourceMode}
          onContentChange={handleContentChange}
          onEditorReady={handleEditorReady}
          onSourceChange={handleSourceChange}
        />
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
          isModified={isModified}
          sourceMode={sourceMode}
          theme={theme}
          onToggleTheme={toggleTheme}
          onToggleSidebar={toggleSidebar}
          sidebarOpen={sidebarOpen}
          currentFile={currentFile}
        />
      )}
    </div>
  )
}

export default App
