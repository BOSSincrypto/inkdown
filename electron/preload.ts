import { contextBridge, ipcRenderer } from 'electron'

const electronAPI = {
  openFile: () => ipcRenderer.invoke('dialog:open-file'),
  openFolder: () => ipcRenderer.invoke('dialog:open-folder'),
  saveFileDialog: (options: { defaultPath?: string }) =>
    ipcRenderer.invoke('dialog:save-file', options),

  readFile: (filePath: string) => ipcRenderer.invoke('file:read', filePath),
  writeFile: (filePath: string, content: string) =>
    ipcRenderer.invoke('file:write', filePath, content),
  fileExists: (filePath: string) => ipcRenderer.invoke('file:exists', filePath),
  readFolder: (folderPath: string) => ipcRenderer.invoke('folder:read', folderPath),

  getRecentFiles: () => ipcRenderer.invoke('app:get-recent-files'),
  getPlatform: () => ipcRenderer.invoke('app:get-platform'),
  getVersion: () => ipcRenderer.invoke('app:get-version'),
  checkForUpdates: () => ipcRenderer.invoke('app:check-updates'),
  openExternal: (url: string) => ipcRenderer.invoke('app:open-external', url),

  exportPDF: (htmlContent: string) => ipcRenderer.invoke('export:pdf', htmlContent),
  exportHTML: (htmlContent: string) => ipcRenderer.invoke('export:html', htmlContent),

  editCut: () => ipcRenderer.send('edit:cut'),
  editCopy: () => ipcRenderer.send('edit:copy'),
  editPaste: () => ipcRenderer.send('edit:paste'),

  minimizeWindow: () => ipcRenderer.send('window:minimize'),
  maximizeWindow: () => ipcRenderer.send('window:maximize'),
  closeWindow: () => ipcRenderer.send('window:close'),
  isMaximized: () => ipcRenderer.invoke('window:is-maximized'),

  onMenuNewFile: (callback: () => void) => {
    ipcRenderer.on('menu:new-file', callback)
    return () => ipcRenderer.removeListener('menu:new-file', callback)
  },
  onMenuSave: (callback: () => void) => {
    ipcRenderer.on('menu:save', callback)
    return () => ipcRenderer.removeListener('menu:save', callback)
  },
  onMenuSaveAs: (callback: () => void) => {
    ipcRenderer.on('menu:save-as', callback)
    return () => ipcRenderer.removeListener('menu:save-as', callback)
  },
  onMenuExport: (callback: (_event: unknown, format: string) => void) => {
    ipcRenderer.on('menu:export', callback)
    return () => ipcRenderer.removeListener('menu:export', callback)
  },
  onMenuToggleSidebar: (callback: () => void) => {
    ipcRenderer.on('menu:toggle-sidebar', callback)
    return () => ipcRenderer.removeListener('menu:toggle-sidebar', callback)
  },
  onMenuToggleSource: (callback: () => void) => {
    ipcRenderer.on('menu:toggle-source', callback)
    return () => ipcRenderer.removeListener('menu:toggle-source', callback)
  },
  onMenuFocusMode: (callback: () => void) => {
    ipcRenderer.on('menu:focus-mode', callback)
    return () => ipcRenderer.removeListener('menu:focus-mode', callback)
  },
  onMenuToggleTheme: (callback: () => void) => {
    ipcRenderer.on('menu:toggle-theme', callback)
    return () => ipcRenderer.removeListener('menu:toggle-theme', callback)
  },
  onMenuFormat: (callback: (_event: unknown, format: string) => void) => {
    ipcRenderer.on('menu:format', callback)
    return () => ipcRenderer.removeListener('menu:format', callback)
  },
  onMenuFind: (callback: () => void) => {
    ipcRenderer.on('menu:find', callback)
    return () => ipcRenderer.removeListener('menu:find', callback)
  },
  onMenuCloseTab: (callback: () => void) => {
    ipcRenderer.on('menu:close-tab', callback)
    return () => ipcRenderer.removeListener('menu:close-tab', callback)
  },
  onFileOpened: (
    callback: (_event: unknown, data: { filePath: string; content: string }) => void
  ) => {
    ipcRenderer.on('file:opened', callback)
    return () => ipcRenderer.removeListener('file:opened', callback)
  },
  onFolderOpened: (
    callback: (_event: unknown, data: { folderPath: string; tree: unknown[] }) => void
  ) => {
    ipcRenderer.on('folder:opened', callback)
    return () => ipcRenderer.removeListener('folder:opened', callback)
  },
}

contextBridge.exposeInMainWorld('electronAPI', electronAPI)

export type ElectronAPI = typeof electronAPI
