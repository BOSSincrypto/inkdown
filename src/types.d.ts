declare global {
  interface FileTreeNode {
    name: string
    path: string
    isDirectory: boolean
    children?: FileTreeNode[]
  }

  interface FileData {
    filePath: string | null
    content: string
    isModified: boolean
  }

  interface Tab {
    id: string
    filePath: string | null
    markdown: string
    isModified: boolean
    scrollTop: number
  }

  interface ElectronAPI {
    openFile: () => Promise<void>
    openFolder: () => Promise<void>
    saveFileDialog: (options: { defaultPath?: string }) => Promise<string | null>
    readFile: (filePath: string) => Promise<{ success: boolean; content?: string; error?: string }>
    writeFile: (
      filePath: string,
      content: string
    ) => Promise<{ success: boolean; error?: string }>
    fileExists: (filePath: string) => Promise<boolean>
    readFolder: (
      folderPath: string
    ) => Promise<{ success: boolean; tree?: FileTreeNode[]; error?: string }>
    getRecentFiles: () => Promise<string[]>
    getPlatform: () => Promise<string>
    getVersion: () => Promise<string>
    checkForUpdates: () => Promise<void>
    openExternal: (url: string) => Promise<void>
    exportPDF: (
      htmlContent: string
    ) => Promise<{ success: boolean; filePath?: string; error?: string }>
    exportHTML: (
      htmlContent: string
    ) => Promise<{ success: boolean; filePath?: string; error?: string }>
    editCut: () => void
    editCopy: () => void
    editPaste: () => void
    minimizeWindow: () => void
    maximizeWindow: () => void
    closeWindow: () => void
    isMaximized: () => Promise<boolean>
    onMenuNewFile: (callback: () => void) => () => void
    onMenuSave: (callback: () => void) => () => void
    onMenuSaveAs: (callback: () => void) => () => void
    onMenuExport: (callback: (_event: unknown, format: string) => void) => () => void
    onMenuToggleSidebar: (callback: () => void) => () => void
    onMenuToggleSource: (callback: () => void) => () => void
    onMenuFocusMode: (callback: () => void) => () => void
    onMenuToggleTheme: (callback: () => void) => () => void
    onMenuFormat: (callback: (_event: unknown, format: string) => void) => () => void
    onMenuFind: (callback: () => void) => () => void
    onMenuCloseTab: (callback: () => void) => () => void
    onFileOpened: (
      callback: (_event: unknown, data: { filePath: string; content: string }) => void
    ) => () => void
    onFolderOpened: (
      callback: (_event: unknown, data: { folderPath: string; tree: FileTreeNode[] }) => void
    ) => () => void
  }

  interface Window {
    electronAPI: ElectronAPI
  }
}

export {}
