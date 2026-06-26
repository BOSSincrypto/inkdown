import { useState, useEffect, useCallback, useRef } from 'react'
import type { Editor as TiptapEditor } from '@tiptap/core'
import type { TranslationKey } from '../../i18n'
import './TableOfContents.css'

interface TocItem {
  level: number
  text: string
  pos: number
  top: number
}

interface TableOfContentsProps {
  editor: TiptapEditor | null
  t: (key: TranslationKey) => string
}

function TableOfContents({ editor, t }: TableOfContentsProps) {
  const [items, setItems] = useState<TocItem[]>([])
  const [activeIdx, setActiveIdx] = useState(-1)
  const listRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<TocItem[]>([])

  const extractHeadings = useCallback(() => {
    if (!editor) {
      setItems([])
      return
    }

    const toc: TocItem[] = []
    editor.state.doc.descendants((node, pos) => {
      if (node.type.name === 'heading') {
        const text = node.textContent
        if (text) {
          try {
            const coords = editor.view.coordsAtPos(pos)
            toc.push({
              level: node.attrs.level as number,
              text,
              pos,
              top: coords.top,
            })
          } catch {
            toc.push({
              level: node.attrs.level as number,
              text,
              pos,
              top: 0,
            })
          }
        }
      }
    })
    itemsRef.current = toc
    setItems(toc)
  }, [editor])

  useEffect(() => {
    extractHeadings()
  }, [extractHeadings])

  useEffect(() => {
    if (!editor) return
    const handler = () => extractHeadings()
    editor.on('update', handler)
    return () => {
      editor.off('update', handler)
    }
  }, [editor, extractHeadings])

  const scrollToHeading = useCallback(
    (pos: number) => {
      if (!editor) return
      try {
        editor.commands.focus()
        editor.chain().setTextSelection(pos).run()

        const editorEl = document.querySelector('.editor-scroll')
        const { view } = editor
        const coords = view.coordsAtPos(pos)
        if (editorEl && coords) {
          const rect = editorEl.getBoundingClientRect()
          const scrollTop = editorEl.scrollTop + coords.top - rect.top - 60
          editorEl.scrollTo({ top: scrollTop, behavior: 'smooth' })
        }
      } catch { /* ignore */ }
    },
    [editor]
  )

  useEffect(() => {
    if (!editor || items.length === 0) return

    const editorEl = document.querySelector('.editor-scroll')
    if (!editorEl) return

    const findActive = () => {
      const viewMid = editorEl.getBoundingClientRect().top + editorEl.clientHeight * 0.3

      let closest = -1
      for (let i = itemsRef.current.length - 1; i >= 0; i--) {
        const item = itemsRef.current[i]
        try {
          const coords = editor.view.coordsAtPos(item.pos)
          if (coords.top <= viewMid + 60) {
            closest = i
            break
          }
        } catch { /* skip */ }
      }

      if (closest === -1 && itemsRef.current.length > 0) {
        closest = 0
      }

      setActiveIdx(closest)
    }

    editorEl.addEventListener('scroll', findActive, { passive: true })
    editor.on('selectionUpdate', findActive)
    findActive()

    return () => {
      editorEl.removeEventListener('scroll', findActive)
      editor.off('selectionUpdate', findActive)
    }
  }, [editor, items])

  useEffect(() => {
    if (activeIdx < 0 || !listRef.current) return
    const activeEl = listRef.current.children[activeIdx] as HTMLElement
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' })
    }
  }, [activeIdx])

  if (items.length === 0) {
    return (
      <div className="toc">
        <div className="toc-header">{t('toc.title')}</div>
        <div className="toc-empty">{t('toc.noHeadings')}</div>
      </div>
    )
  }

  return (
    <div className="toc">
      <div className="toc-header">{t('toc.title')}</div>
      <div className="toc-list" ref={listRef}>
        {items.map((item, i) => (
          <button
            key={`${item.pos}-${i}`}
            className={`toc-item toc-level-${item.level} ${i === activeIdx ? 'active' : ''}`}
            onClick={() => scrollToHeading(item.pos)}
          >
            <span className="toc-text">{item.text}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default TableOfContents
