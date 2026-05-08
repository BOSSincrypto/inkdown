import type { Editor } from '@tiptap/core'
import './Toolbar.css'

interface ToolbarProps {
  editor: Editor | null
  onFormat: (_event: unknown, format: string) => void
  sourceMode: boolean
  onToggleSource: () => void
}

interface ToolbarButton {
  icon: string
  label: string
  action: string
  isActive?: (editor: Editor) => boolean
}

const formatButtons: ToolbarButton[][] = [
  [
    { icon: 'B', label: 'Bold (Ctrl+B)', action: 'bold', isActive: (e) => e.isActive('bold') },
    { icon: 'I', label: 'Italic (Ctrl+I)', action: 'italic', isActive: (e) => e.isActive('italic') },
    { icon: 'U', label: 'Underline (Ctrl+U)', action: 'underline', isActive: (e) => e.isActive('underline') },
    { icon: 'S', label: 'Strikethrough', action: 'strike', isActive: (e) => e.isActive('strike') },
    { icon: 'H', label: 'Highlight', action: 'highlight', isActive: (e) => e.isActive('highlight') },
  ],
  [
    { icon: 'H1', label: 'Heading 1', action: 'h1', isActive: (e) => e.isActive('heading', { level: 1 }) },
    { icon: 'H2', label: 'Heading 2', action: 'h2', isActive: (e) => e.isActive('heading', { level: 2 }) },
    { icon: 'H3', label: 'Heading 3', action: 'h3', isActive: (e) => e.isActive('heading', { level: 3 }) },
  ],
  [
    { icon: 'ul', label: 'Bullet List', action: 'bulletList', isActive: (e) => e.isActive('bulletList') },
    { icon: 'ol', label: 'Ordered List', action: 'orderedList', isActive: (e) => e.isActive('orderedList') },
    { icon: 'tl', label: 'Task List', action: 'taskList', isActive: (e) => e.isActive('taskList') },
  ],
  [
    { icon: 'bq', label: 'Blockquote', action: 'blockquote', isActive: (e) => e.isActive('blockquote') },
    { icon: '</>', label: 'Code', action: 'code', isActive: (e) => e.isActive('code') },
    { icon: 'cb', label: 'Code Block', action: 'codeBlock', isActive: (e) => e.isActive('codeBlock') },
  ],
  [
    { icon: 'lnk', label: 'Link', action: 'link' },
    { icon: 'img', label: 'Image', action: 'image' },
    { icon: 'tbl', label: 'Table', action: 'table' },
    { icon: '---', label: 'Horizontal Rule', action: 'horizontalRule' },
  ],
]

function ToolbarIcon({ icon }: { icon: string }) {
  switch (icon) {
    case 'B':
      return <strong style={{ fontSize: 14 }}>B</strong>
    case 'I':
      return <em style={{ fontSize: 14, fontFamily: 'serif' }}>I</em>
    case 'U':
      return <span style={{ fontSize: 14, textDecoration: 'underline' }}>U</span>
    case 'S':
      return <span style={{ fontSize: 14, textDecoration: 'line-through' }}>S</span>
    case 'H':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.243 4.515l-6.738 6.737-.707 2.121-1.414 1.414 2.121 2.121 1.414-1.414 2.121-.707 6.738-6.738-3.535-3.534zM4.384 17.06l2.556 2.556-3.889 1.333 1.333-3.889z" />
        </svg>
      )
    case 'H1':
      return <span style={{ fontSize: 13, fontWeight: 700 }}>H<sub>1</sub></span>
    case 'H2':
      return <span style={{ fontSize: 13, fontWeight: 700 }}>H<sub>2</sub></span>
    case 'H3':
      return <span style={{ fontSize: 13, fontWeight: 700 }}>H<sub>3</sub></span>
    case 'ul':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
          <circle cx="4" cy="6" r="1" fill="currentColor" /><circle cx="4" cy="12" r="1" fill="currentColor" /><circle cx="4" cy="18" r="1" fill="currentColor" />
        </svg>
      )
    case 'ol':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="10" y1="6" x2="21" y2="6" /><line x1="10" y1="12" x2="21" y2="12" /><line x1="10" y1="18" x2="21" y2="18" />
          <text x="2" y="8" fontSize="8" fill="currentColor" stroke="none" fontFamily="sans-serif">1</text>
          <text x="2" y="14" fontSize="8" fill="currentColor" stroke="none" fontFamily="sans-serif">2</text>
          <text x="2" y="20" fontSize="8" fill="currentColor" stroke="none" fontFamily="sans-serif">3</text>
        </svg>
      )
    case 'tl':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="5" width="4" height="4" rx="1" /><line x1="10" y1="7" x2="21" y2="7" />
          <rect x="3" y="14" width="4" height="4" rx="1" /><line x1="10" y1="16" x2="21" y2="16" />
          <path d="M4.5 6.5l1.5 1.5 2.5-2.5" strokeWidth="1.5" />
        </svg>
      )
    case 'bq':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
        </svg>
      )
    case '</>':
      return <span style={{ fontSize: 12, fontFamily: 'monospace' }}>&lt;/&gt;</span>
    case 'cb':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
        </svg>
      )
    case 'lnk':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
        </svg>
      )
    case 'img':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      )
    case 'tbl':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="3" y1="9" x2="21" y2="9" /><line x1="3" y1="15" x2="21" y2="15" />
          <line x1="9" y1="3" x2="9" y2="21" /><line x1="15" y1="3" x2="15" y2="21" />
        </svg>
      )
    case '---':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="2" y1="12" x2="22" y2="12" />
        </svg>
      )
    default:
      return <span>{icon}</span>
  }
}

function Toolbar({ editor, onFormat, sourceMode, onToggleSource }: ToolbarProps) {
  return (
    <div className="toolbar">
      <div className="toolbar-groups">
        {formatButtons.map((group, gi) => (
          <div key={gi} className="toolbar-group">
            {group.map((btn) => (
              <button
                key={btn.action}
                className={`toolbar-btn ${
                  editor && btn.isActive?.(editor) ? 'active' : ''
                }`}
                onClick={() => onFormat(null, btn.action)}
                title={btn.label}
                disabled={sourceMode}
              >
                <ToolbarIcon icon={btn.icon} />
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="toolbar-right">
        <button
          className={`toolbar-btn source-toggle ${sourceMode ? 'active' : ''}`}
          onClick={onToggleSource}
          title="Toggle Source Mode (Ctrl+/)"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 18l6-6-6-6" /><path d="M8 6l-6 6 6 6" />
          </svg>
          <span className="source-label">Source</span>
        </button>
      </div>
    </div>
  )
}

export default Toolbar
