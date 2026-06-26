import { useState, useCallback } from 'react'
import type { Editor as TiptapEditor } from '@tiptap/core'
import type { TranslationKey } from '../../i18n'
import TableOfContents from '../TableOfContents/TableOfContents'
import './Sidebar.css'

type SidebarTab = 'files' | 'toc'

interface SidebarProps {
  folderPath: string | null
  folderTree: FileTreeNode[]
  currentFile: string | null
  onFileSelect: (filePath: string) => void
  onOpenFolder: () => void
  editor: TiptapEditor | null
  t: (key: TranslationKey) => string
}

function Sidebar({
  folderPath,
  folderTree,
  currentFile,
  onFileSelect,
  onOpenFolder,
  editor,
  t,
}: SidebarProps) {
  const [activeTab, setActiveTab] = useState<SidebarTab>('files')
  const folderName = folderPath ? folderPath.split(/[/\\]/).pop() : null

  return (
    <div className="sidebar">
      <div className="sidebar-tabs">
        <button
          className={`sidebar-tab ${activeTab === 'files' ? 'active' : ''}`}
          onClick={() => setActiveTab('files')}
          title={t('sidebar.explorer')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
          </svg>
        </button>
        <button
          className={`sidebar-tab ${activeTab === 'toc' ? 'active' : ''}`}
          onClick={() => setActiveTab('toc')}
          title={t('sidebar.toc')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
        </button>
      </div>

      {activeTab === 'files' ? (
        <>
          <div className="sidebar-header">
            <span className="sidebar-title">{folderName || t('sidebar.explorer')}</span>
            <button className="sidebar-action" onClick={onOpenFolder} title={t('sidebar.openFolder')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
              </svg>
            </button>
          </div>

          <div className="sidebar-content">
            {folderTree.length === 0 ? (
              <div className="sidebar-empty">
                <p>{t('sidebar.noFolder')}</p>
                <button className="sidebar-open-btn" onClick={onOpenFolder}>
                  {t('sidebar.openFolder')}
                </button>
              </div>
            ) : (
          <div className="file-tree">
            {folderTree.map((node) => (
              <FileTreeItem
                key={node.path}
                node={node}
                currentFile={currentFile}
                onFileSelect={onFileSelect}
                depth={0}
              />
            ))}
          </div>
        )}
      </div>
        </>
      ) : (
        <TableOfContents editor={editor} t={t} />
      )}
    </div>
  )
}

interface FileTreeItemProps {
  node: FileTreeNode
  currentFile: string | null
  onFileSelect: (filePath: string) => void
  depth: number
}

function FileTreeItem({ node, currentFile, onFileSelect, depth }: FileTreeItemProps) {
  const [expanded, setExpanded] = useState(depth < 1)

  const handleClick = useCallback(() => {
    if (node.isDirectory) {
      setExpanded((prev) => !prev)
    } else {
      onFileSelect(node.path)
    }
  }, [node, onFileSelect])

  const isActive = currentFile === node.path
  const isMarkdown = /\.(md|markdown|mdown|mkd|txt)$/i.test(node.name)

  return (
    <div className="tree-item">
      <div
        className={`tree-item-row ${isActive ? 'active' : ''}`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={handleClick}
        title={node.path}
      >
        {node.isDirectory ? (
          <span className={`tree-arrow ${expanded ? 'expanded' : ''}`}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <path d="M4 2l4 4-4 4z" />
            </svg>
          </span>
        ) : (
          <span className="tree-spacer" />
        )}

        <span className="tree-icon">
          {node.isDirectory ? (
            expanded ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--folder-color)" stroke="none">
                <path d="M2 7.5V19a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2h-8l-2-3H4a2 2 0 00-2 2v1.5z" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--folder-color)" stroke="none">
                <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
              </svg>
            )
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isMarkdown ? 'var(--accent-color)' : 'var(--text-secondary)'} strokeWidth="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <path d="M14 2v6h6" />
            </svg>
          )}
        </span>

        <span className={`tree-name ${isMarkdown ? 'markdown-file' : ''}`}>
          {node.name}
        </span>
      </div>

      {node.isDirectory && expanded && node.children && (
        <div className="tree-children">
          {node.children.map((child) => (
            <FileTreeItem
              key={child.path}
              node={child}
              currentFile={currentFile}
              onFileSelect={onFileSelect}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Sidebar
