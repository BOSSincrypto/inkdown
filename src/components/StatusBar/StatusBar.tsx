import type { TranslationKey } from '../../i18n'
import './StatusBar.css'

interface StatusBarProps {
  wordCount: number
  charCount: number
  lineCount: number
  isModified: boolean
  sourceMode: boolean
  theme: 'light' | 'dark'
  onToggleTheme: () => void
  onToggleSidebar: () => void
  sidebarOpen: boolean
  currentFile: string | null
  t: (key: TranslationKey, params?: Record<string, number | string>) => string
}

function StatusBar({
  wordCount,
  charCount,
  lineCount,
  isModified,
  sourceMode,
  theme,
  onToggleTheme,
  onToggleSidebar,
  sidebarOpen,
  currentFile,
  t,
}: StatusBarProps) {
  return (
    <div className="statusbar">
      <div className="statusbar-left">
        <button
          className={`statusbar-btn ${sidebarOpen ? 'active' : ''}`}
          onClick={onToggleSidebar}
          title="Toggle Sidebar (Ctrl+\\)"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="9" y1="3" x2="9" y2="21" />
          </svg>
        </button>

        {currentFile && (
          <span className="statusbar-path" title={currentFile}>
            {currentFile}
          </span>
        )}
      </div>

      <div className="statusbar-right">
        {isModified && <span className="statusbar-modified">{t('statusbar.modified')}</span>}

        <span className="statusbar-info">
          {t('statusbar.words', { count: wordCount })}
        </span>

        <span className="statusbar-info">
          {t('statusbar.chars', { count: charCount })}
        </span>

        <span className="statusbar-info">
          {t('statusbar.lines', { count: lineCount })}
        </span>

        <span className="statusbar-info statusbar-mode">
          {sourceMode ? t('statusbar.source') : t('statusbar.wysiwyg')}
        </span>

        <button
          className="statusbar-btn"
          onClick={onToggleTheme}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}

export default StatusBar
