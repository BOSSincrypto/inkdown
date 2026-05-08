import { useState, useEffect } from 'react'
import './TitleBar.css'

interface TitleBarProps {
  fileName: string
  isModified: boolean
  theme: 'light' | 'dark'
}

const api = window.electronAPI

function TitleBar({ fileName, isModified }: TitleBarProps) {
  const [isMaximized, setIsMaximized] = useState(false)

  useEffect(() => {
    api?.isMaximized().then(setIsMaximized)
  }, [])

  const handleMaximize = () => {
    api?.maximizeWindow()
    setIsMaximized((prev) => !prev)
  }

  return (
    <div className="titlebar">
      <div className="titlebar-drag">
        <div className="titlebar-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 19l7-7 3 3-7 7-3-3z" />
            <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
            <path d="M2 2l7.586 7.586" />
            <circle cx="11" cy="11" r="2" />
          </svg>
        </div>
        <span className="titlebar-title">
          {fileName}
          {isModified && <span className="titlebar-modified">*</span>}
          <span className="titlebar-app"> — InkDown</span>
        </span>
      </div>
      <div className="titlebar-controls">
        <button
          className="titlebar-btn titlebar-btn-minimize"
          onClick={() => api?.minimizeWindow()}
          aria-label="Minimize"
        >
          <svg width="12" height="12" viewBox="0 0 12 12">
            <rect x="2" y="5.5" width="8" height="1" fill="currentColor" />
          </svg>
        </button>
        <button
          className="titlebar-btn titlebar-btn-maximize"
          onClick={handleMaximize}
          aria-label="Maximize"
        >
          {isMaximized ? (
            <svg width="12" height="12" viewBox="0 0 12 12">
              <rect x="2.5" y="3.5" width="6" height="6" fill="none" stroke="currentColor" strokeWidth="1" />
              <path d="M3.5 3.5V2h7v7h-1.5" fill="none" stroke="currentColor" strokeWidth="1" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12">
              <rect x="2" y="2" width="8" height="8" fill="none" stroke="currentColor" strokeWidth="1" />
            </svg>
          )}
        </button>
        <button
          className="titlebar-btn titlebar-btn-close"
          onClick={() => api?.closeWindow()}
          aria-label="Close"
        >
          <svg width="12" height="12" viewBox="0 0 12 12">
            <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default TitleBar
