import { useRef, useEffect, useCallback } from 'react'
import './TabBar.css'

interface Tab {
  id: string
  filePath: string | null
  isModified: boolean
}

interface TabBarProps {
  tabs: Tab[]
  activeTabId: string
  onSelectTab: (id: string) => void
  onCloseTab: (id: string) => void
  onNewTab: () => void
}

function tabLabel(tab: Tab): string {
  if (!tab.filePath) return 'Untitled'
  const parts = tab.filePath.split(/[/\\]/)
  return parts[parts.length - 1] || 'Untitled'
}

function TabBar({ tabs, activeTabId, onSelectTab, onCloseTab, onNewTab }: TabBarProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }, [activeTabId])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += e.deltaY
    }
  }, [])

  const handleAuxClick = useCallback(
    (e: React.MouseEvent, id: string) => {
      if (e.button === 1) {
        e.preventDefault()
        onCloseTab(id)
      }
    },
    [onCloseTab]
  )

  return (
    <div className="tabbar" onWheel={handleWheel}>
      <div className="tabbar-scroll" ref={scrollRef}>
        {tabs.map((tab) => {
          const active = tab.id === activeTabId
          return (
            <button
              key={tab.id}
              ref={active ? activeRef : undefined}
              className={`tabbar-tab${active ? ' tabbar-tab-active' : ''}`}
              onClick={() => onSelectTab(tab.id)}
              onAuxClick={(e) => handleAuxClick(e, tab.id)}
              title={tab.filePath || 'Untitled'}
            >
              <span className="tabbar-tab-label">
                {tabLabel(tab)}
                {tab.isModified && <span className="tabbar-tab-dot" />}
              </span>
              <span
                className="tabbar-tab-close"
                onClick={(e) => {
                  e.stopPropagation()
                  onCloseTab(tab.id)
                }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10">
                  <path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </span>
            </button>
          )
        })}
      </div>
      <button className="tabbar-new" onClick={onNewTab} title="New Tab (Ctrl+T)">
        <svg width="12" height="12" viewBox="0 0 12 12">
          <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </button>
    </div>
  )
}

export default TabBar
