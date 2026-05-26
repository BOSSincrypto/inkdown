import { useState, useCallback, useEffect, useRef } from 'react'
import type { Editor as TiptapEditor } from '@tiptap/core'
import './FindReplace.css'

interface FindReplaceProps {
  editor: TiptapEditor | null
  onClose: () => void
}

interface SearchResult {
  from: number
  to: number
}

function findAllMatches(editor: TiptapEditor, query: string, caseSensitive: boolean): SearchResult[] {
  if (!query) return []
  const results: SearchResult[] = []
  const doc = editor.state.doc
  const searchText = caseSensitive ? query : query.toLowerCase()

  doc.descendants((node, pos) => {
    if (!node.isText || !node.text) return
    const text = caseSensitive ? node.text : node.text.toLowerCase()
    let idx = text.indexOf(searchText)
    while (idx !== -1) {
      results.push({ from: pos + idx, to: pos + idx + query.length })
      idx = text.indexOf(searchText, idx + 1)
    }
  })

  return results
}

function FindReplace({ editor, onClose }: FindReplaceProps) {
  const [findText, setFindText] = useState('')
  const [replaceText, setReplaceText] = useState('')
  const [caseSensitive, setCaseSensitive] = useState(false)
  const [showReplace, setShowReplace] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [currentIndex, setCurrentIndex] = useState(-1)
  const findInputRef = useRef<HTMLInputElement>(null)
  const decorationsApplied = useRef(false)

  useEffect(() => {
    findInputRef.current?.focus()
  }, [])

  const clearHighlights = useCallback(() => {
    if (!editor || !decorationsApplied.current) return
    const editorEl = editor.view.dom as HTMLElement
    editorEl.querySelectorAll('.find-highlight, .find-highlight-current').forEach((el) => {
      const parent = el.parentNode
      if (parent) {
        parent.replaceChild(document.createTextNode(el.textContent || ''), el)
        parent.normalize()
      }
    })
    decorationsApplied.current = false
  }, [editor])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        clearHighlights()
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, clearHighlights])

  const applyHighlights = useCallback(
    (matches: SearchResult[], activeIdx: number) => {
      if (!editor) return
      clearHighlights()
      if (matches.length === 0) return

      for (let i = matches.length - 1; i >= 0; i--) {
        const match = matches[i]
        try {
          editor.view.coordsAtPos(match.from)
        } catch {
          continue
        }

        const domAtPos = editor.view.domAtPos(match.from)
        const domEndAtPos = editor.view.domAtPos(match.to)
        if (!domAtPos || !domEndAtPos) continue

        const startNode = domAtPos.node
        const startOffset = domAtPos.offset

        if (startNode.nodeType === Node.TEXT_NODE) {
          const textNode = startNode as Text
          const text = textNode.textContent || ''
          const matchLen = match.to - match.from
          const endOffset = startOffset + matchLen

          if (endOffset <= text.length) {
            const before = text.slice(0, startOffset)
            const matched = text.slice(startOffset, endOffset)
            const after = text.slice(endOffset)

            const parent = textNode.parentNode
            if (!parent) continue

            const frag = document.createDocumentFragment()
            if (before) frag.appendChild(document.createTextNode(before))

            const span = document.createElement('span')
            span.className = i === activeIdx ? 'find-highlight-current' : 'find-highlight'
            span.textContent = matched
            frag.appendChild(span)

            if (after) frag.appendChild(document.createTextNode(after))
            parent.replaceChild(frag, textNode)
            decorationsApplied.current = true
          }
        }
      }
    },
    [editor, clearHighlights]
  )

  const scrollToMatch = useCallback(
    (match: SearchResult) => {
      if (!editor) return
      try {
        editor.commands.setTextSelection(match)
        const coords = editor.view.coordsAtPos(match.from)
        const editorEl = editor.view.dom.closest('.editor-scroll')
        if (editorEl && coords) {
          const rect = editorEl.getBoundingClientRect()
          const scrollTop = editorEl.scrollTop + coords.top - rect.top - rect.height / 3
          editorEl.scrollTo({ top: scrollTop, behavior: 'smooth' })
        }
      } catch { /* ignore scroll errors */ }
    },
    [editor]
  )

  const doSearch = useCallback(
    (query: string, cs: boolean) => {
      if (!editor || !query) {
        setResults([])
        setCurrentIndex(-1)
        clearHighlights()
        return
      }
      const matches = findAllMatches(editor, query, cs)
      setResults(matches)
      const idx = matches.length > 0 ? 0 : -1
      setCurrentIndex(idx)
      applyHighlights(matches, idx)
      if (matches.length > 0 && idx >= 0) {
        scrollToMatch(matches[idx])
      }
    },
    [editor, clearHighlights, applyHighlights, scrollToMatch]
  )

  const handleFindChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value
      setFindText(val)
      doSearch(val, caseSensitive)
    },
    [caseSensitive, doSearch]
  )

  const handleCaseSensitiveToggle = useCallback(() => {
    const newCs = !caseSensitive
    setCaseSensitive(newCs)
    doSearch(findText, newCs)
  }, [caseSensitive, findText, doSearch])

  const goToMatch = useCallback(
    (direction: 'next' | 'prev') => {
      if (results.length === 0) return
      let newIdx: number
      if (direction === 'next') {
        newIdx = (currentIndex + 1) % results.length
      } else {
        newIdx = (currentIndex - 1 + results.length) % results.length
      }
      setCurrentIndex(newIdx)
      applyHighlights(results, newIdx)
      scrollToMatch(results[newIdx])
    },
    [results, currentIndex, applyHighlights, scrollToMatch]
  )

  const handleReplace = useCallback(() => {
    if (!editor || currentIndex < 0 || results.length === 0) return
    const match = results[currentIndex]
    editor.chain().focus().setTextSelection(match).insertContent(replaceText).run()
    doSearch(findText, caseSensitive)
  }, [editor, currentIndex, results, replaceText, findText, caseSensitive, doSearch])

  const handleReplaceAll = useCallback(() => {
    if (!editor || results.length === 0) return
    const sorted = [...results].sort((a, b) => b.from - a.from)
    editor.chain().focus()
    for (const match of sorted) {
      editor.chain().setTextSelection(match).insertContent(replaceText).run()
    }
    doSearch(findText, caseSensitive)
  }, [editor, results, replaceText, findText, caseSensitive, doSearch])

  const handleFindKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        if (e.shiftKey) {
          goToMatch('prev')
        } else {
          goToMatch('next')
        }
      }
    },
    [goToMatch]
  )

  const handleClose = useCallback(() => {
    clearHighlights()
    onClose()
  }, [clearHighlights, onClose])

  return (
    <div className="find-replace-bar">
      <div className="find-row">
        <input
          ref={findInputRef}
          type="text"
          className="find-input"
          placeholder="Find..."
          value={findText}
          onChange={handleFindChange}
          onKeyDown={handleFindKeyDown}
        />
        <span className="find-count">
          {results.length > 0
            ? `${currentIndex + 1}/${results.length}`
            : findText
              ? 'No results'
              : ''}
        </span>
        <button
          className={`find-btn find-case-btn ${caseSensitive ? 'active' : ''}`}
          onClick={handleCaseSensitiveToggle}
          title="Case sensitive"
        >
          Aa
        </button>
        <button className="find-btn" onClick={() => goToMatch('prev')} title="Previous (Shift+Enter)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
        <button className="find-btn" onClick={() => goToMatch('next')} title="Next (Enter)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        <button
          className={`find-btn find-expand-btn ${showReplace ? 'active' : ''}`}
          onClick={() => setShowReplace(!showReplace)}
          title="Toggle Replace"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 1l4 4-4 4" />
            <path d="M3 11V9a4 4 0 0 1 4-4h14" />
            <path d="M7 23l-4-4 4-4" />
            <path d="M21 13v2a4 4 0 0 1-4 4H3" />
          </svg>
        </button>
        <button className="find-btn find-close-btn" onClick={handleClose} title="Close (Esc)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      {showReplace && (
        <div className="replace-row">
          <input
            type="text"
            className="find-input"
            placeholder="Replace..."
            value={replaceText}
            onChange={(e) => setReplaceText(e.target.value)}
          />
          <button className="find-btn replace-btn" onClick={handleReplace} title="Replace">
            Replace
          </button>
          <button className="find-btn replace-btn" onClick={handleReplaceAll} title="Replace All">
            All
          </button>
        </div>
      )}
    </div>
  )
}

export default FindReplace
