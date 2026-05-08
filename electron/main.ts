import { app, BrowserWindow, ipcMain, dialog, Menu, shell } from 'electron'
import path from 'path'
import fs from 'fs'

let mainWindow: BrowserWindow | null = null
const recentFiles: string[] = []
const MAX_RECENT = 10
let pendingFilePath: string | null = null

const gotLock = app.requestSingleInstanceLock()
if (!gotLock) {
  app.quit()
}

app.on('second-instance', (_event, argv) => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
    const filePath = extractFileArg(argv)
    if (filePath) openFileInWindow(filePath)
  }
})

app.on('open-file', (event, filePath) => {
  event.preventDefault()
  if (mainWindow) {
    openFileInWindow(filePath)
  } else {
    pendingFilePath = filePath
  }
})

function extractFileArg(argv: string[]): string | null {
  const args = argv.slice(process.defaultApp ? 2 : 1)
  for (const arg of args) {
    if (arg.startsWith('-')) continue
    const ext = path.extname(arg).toLowerCase()
    if (['.md', '.markdown', '.mdown', '.mkd', '.txt'].includes(ext)) {
      if (fs.existsSync(arg)) return path.resolve(arg)
    }
  }
  return null
}

function openFileInWindow(filePath: string): void {
  if (!mainWindow) return
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    addToRecent(filePath)
    mainWindow.webContents.send('file:opened', { filePath, content })
  } catch { /* ignore read errors */ }
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 600,
    minHeight: 400,
    frame: false,
    titleBarStyle: 'hidden',
    backgroundColor: '#ffffff',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      spellcheck: true,
    },
    icon: path.join(__dirname, '../resources/icon.png'),
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.webContents.on('did-finish-load', () => {
    const fileToOpen = pendingFilePath || extractFileArg(process.argv)
    if (fileToOpen) {
      openFileInWindow(fileToOpen)
      pendingFilePath = null
    }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  buildAppMenu()
}

function buildAppMenu(): void {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New File',
          accelerator: 'CmdOrCtrl+N',
          click: () => mainWindow?.webContents.send('menu:new-file'),
        },
        {
          label: 'Open File...',
          accelerator: 'CmdOrCtrl+O',
          click: () => handleOpenFile(),
        },
        {
          label: 'Open Folder...',
          accelerator: 'CmdOrCtrl+Shift+O',
          click: () => handleOpenFolder(),
        },
        { type: 'separator' },
        {
          label: 'Save',
          accelerator: 'CmdOrCtrl+S',
          click: () => mainWindow?.webContents.send('menu:save'),
        },
        {
          label: 'Save As...',
          accelerator: 'CmdOrCtrl+Shift+S',
          click: () => mainWindow?.webContents.send('menu:save-as'),
        },
        { type: 'separator' },
        {
          label: 'Export',
          submenu: [
            {
              label: 'HTML',
              click: () => mainWindow?.webContents.send('menu:export', 'html'),
            },
            {
              label: 'PDF',
              click: () => mainWindow?.webContents.send('menu:export', 'pdf'),
            },
          ],
        },
        { type: 'separator' },
        { role: 'quit' },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
        { type: 'separator' },
        {
          label: 'Find',
          accelerator: 'CmdOrCtrl+F',
          click: () => mainWindow?.webContents.send('menu:find'),
        },
      ],
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Toggle Sidebar',
          accelerator: 'CmdOrCtrl+\\',
          click: () => mainWindow?.webContents.send('menu:toggle-sidebar'),
        },
        {
          label: 'Toggle Source Mode',
          accelerator: 'CmdOrCtrl+/',
          click: () => mainWindow?.webContents.send('menu:toggle-source'),
        },
        {
          label: 'Focus Mode',
          accelerator: 'CmdOrCtrl+Shift+F',
          click: () => mainWindow?.webContents.send('menu:focus-mode'),
        },
        { type: 'separator' },
        {
          label: 'Toggle Dark Mode',
          accelerator: 'CmdOrCtrl+Shift+D',
          click: () => mainWindow?.webContents.send('menu:toggle-theme'),
        },
        { type: 'separator' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { role: 'resetZoom' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    {
      label: 'Format',
      submenu: [
        {
          label: 'Bold',
          accelerator: 'CmdOrCtrl+B',
          click: () => mainWindow?.webContents.send('menu:format', 'bold'),
        },
        {
          label: 'Italic',
          accelerator: 'CmdOrCtrl+I',
          click: () => mainWindow?.webContents.send('menu:format', 'italic'),
        },
        {
          label: 'Underline',
          accelerator: 'CmdOrCtrl+U',
          click: () => mainWindow?.webContents.send('menu:format', 'underline'),
        },
        {
          label: 'Strikethrough',
          accelerator: 'CmdOrCtrl+Shift+X',
          click: () => mainWindow?.webContents.send('menu:format', 'strike'),
        },
        { type: 'separator' },
        {
          label: 'Heading 1',
          accelerator: 'CmdOrCtrl+1',
          click: () => mainWindow?.webContents.send('menu:format', 'h1'),
        },
        {
          label: 'Heading 2',
          accelerator: 'CmdOrCtrl+2',
          click: () => mainWindow?.webContents.send('menu:format', 'h2'),
        },
        {
          label: 'Heading 3',
          accelerator: 'CmdOrCtrl+3',
          click: () => mainWindow?.webContents.send('menu:format', 'h3'),
        },
        { type: 'separator' },
        {
          label: 'Code',
          accelerator: 'CmdOrCtrl+E',
          click: () => mainWindow?.webContents.send('menu:format', 'code'),
        },
        {
          label: 'Code Block',
          accelerator: 'CmdOrCtrl+Shift+K',
          click: () => mainWindow?.webContents.send('menu:format', 'codeBlock'),
        },
        {
          label: 'Blockquote',
          accelerator: 'CmdOrCtrl+Shift+Q',
          click: () => mainWindow?.webContents.send('menu:format', 'blockquote'),
        },
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About InkDown',
          click: () => {
            dialog.showMessageBox({
              type: 'info',
              title: 'About InkDown',
              message: 'InkDown v1.1.0',
              detail:
                'The open-source WYSIWYG markdown editor.\nBuilt with Electron, React, and Tiptap.\n\nhttps://github.com/BOSSincrypto/inkdown',
            })
          },
        },
        {
          label: 'GitHub Repository',
          click: () => shell.openExternal('https://github.com/BOSSincrypto/inkdown'),
        },
        { type: 'separator' },
        { role: 'toggleDevTools' },
      ],
    },
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

async function handleOpenFile(): Promise<void> {
  if (!mainWindow) return
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Markdown', extensions: ['md', 'markdown', 'mdown', 'mkd', 'txt'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  })
  if (!result.canceled && result.filePaths.length > 0) {
    const filePath = result.filePaths[0]
    const content = fs.readFileSync(filePath, 'utf-8')
    addToRecent(filePath)
    mainWindow.webContents.send('file:opened', { filePath, content })
  }
}

async function handleOpenFolder(): Promise<void> {
  if (!mainWindow) return
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
  })
  if (!result.canceled && result.filePaths.length > 0) {
    const folderPath = result.filePaths[0]
    const tree = readDirectoryTree(folderPath)
    mainWindow.webContents.send('folder:opened', { folderPath, tree })
  }
}

interface FileTreeNode {
  name: string
  path: string
  isDirectory: boolean
  children?: FileTreeNode[]
}

function readDirectoryTree(dirPath: string, depth = 0): FileTreeNode[] {
  if (depth > 4) return []
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true })
    return entries
      .filter((entry) => !entry.name.startsWith('.') && entry.name !== 'node_modules')
      .sort((a, b) => {
        if (a.isDirectory() && !b.isDirectory()) return -1
        if (!a.isDirectory() && b.isDirectory()) return 1
        return a.name.localeCompare(b.name)
      })
      .map((entry) => {
        const fullPath = path.join(dirPath, entry.name)
        const node: FileTreeNode = {
          name: entry.name,
          path: fullPath,
          isDirectory: entry.isDirectory(),
        }
        if (entry.isDirectory()) {
          node.children = readDirectoryTree(fullPath, depth + 1)
        }
        return node
      })
  } catch {
    return []
  }
}

function addToRecent(filePath: string): void {
  const index = recentFiles.indexOf(filePath)
  if (index > -1) recentFiles.splice(index, 1)
  recentFiles.unshift(filePath)
  if (recentFiles.length > MAX_RECENT) recentFiles.pop()
}

// IPC Handlers
ipcMain.handle('dialog:open-file', async () => {
  await handleOpenFile()
})

ipcMain.handle('dialog:open-folder', async () => {
  await handleOpenFolder()
})

ipcMain.handle('dialog:save-file', async (_event, options: { defaultPath?: string }) => {
  if (!mainWindow) return null
  const result = await dialog.showSaveDialog(mainWindow, {
    defaultPath: options.defaultPath,
    filters: [
      { name: 'Markdown', extensions: ['md'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  })
  if (!result.canceled && result.filePath) {
    return result.filePath
  }
  return null
})

ipcMain.handle('file:read', async (_event, filePath: string) => {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    addToRecent(filePath)
    return { success: true, content }
  } catch (error) {
    return { success: false, error: String(error) }
  }
})

ipcMain.handle('file:write', async (_event, filePath: string, content: string) => {
  try {
    const dir = path.dirname(filePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(filePath, content, 'utf-8')
    addToRecent(filePath)
    return { success: true }
  } catch (error) {
    return { success: false, error: String(error) }
  }
})

ipcMain.handle('file:exists', async (_event, filePath: string) => {
  return fs.existsSync(filePath)
})

ipcMain.handle('folder:read', async (_event, folderPath: string) => {
  try {
    const tree = readDirectoryTree(folderPath)
    return { success: true, tree }
  } catch (error) {
    return { success: false, error: String(error) }
  }
})

ipcMain.handle('app:get-recent-files', async () => {
  return recentFiles
})

ipcMain.handle('export:pdf', async (_event, htmlContent: string) => {
  if (!mainWindow) return { success: false, error: 'No window' }
  const result = await dialog.showSaveDialog(mainWindow, {
    filters: [{ name: 'PDF', extensions: ['pdf'] }],
  })
  if (result.canceled || !result.filePath) return { success: false, error: 'Cancelled' }

  try {
    const win = new BrowserWindow({ show: false, webPreferences: { offscreen: true } })
    await win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`)
    const pdfData = await win.webContents.printToPDF({
      printBackground: true,
      margins: { marginType: 'default' },
    })
    fs.writeFileSync(result.filePath, pdfData)
    win.close()
    return { success: true, filePath: result.filePath }
  } catch (error) {
    return { success: false, error: String(error) }
  }
})

ipcMain.handle('export:html', async (_event, htmlContent: string) => {
  if (!mainWindow) return { success: false, error: 'No window' }
  const result = await dialog.showSaveDialog(mainWindow, {
    filters: [{ name: 'HTML', extensions: ['html'] }],
  })
  if (result.canceled || !result.filePath) return { success: false, error: 'Cancelled' }

  try {
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>InkDown Export</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.6; color: #333; }
    pre { background: #f5f5f5; padding: 16px; border-radius: 6px; overflow-x: auto; }
    code { background: #f0f0f0; padding: 2px 6px; border-radius: 3px; font-size: 0.9em; }
    pre code { background: none; padding: 0; }
    blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 16px; color: #666; }
    img { max-width: 100%; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; }
    th { background: #f5f5f5; }
  </style>
</head>
<body>${htmlContent}</body>
</html>`
    fs.writeFileSync(result.filePath, fullHtml, 'utf-8')
    return { success: true, filePath: result.filePath }
  } catch (error) {
    return { success: false, error: String(error) }
  }
})

ipcMain.on('window:minimize', () => mainWindow?.minimize())
ipcMain.on('window:maximize', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize()
  } else {
    mainWindow?.maximize()
  }
})
ipcMain.on('window:close', () => mainWindow?.close())
ipcMain.handle('window:is-maximized', () => mainWindow?.isMaximized() ?? false)

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
