import { useState, useCallback, useEffect, useRef } from 'react'
import type { Editor as TiptapEditor } from '@tiptap/core'
import type { TranslationKey } from '../../i18n'
import {
  buildSearchTx,
  buildClearTx,
} from '../Editor/searchPlugin'
import './FindReplace.css'

interface FindReplaceProps {
  editor: TiptapEditor | null
  tabId: string
  onClose: () => void
  t: (key: TranslationKey) => string
}

interface SearchResult {
  from: number
  to: number
}

interface TabSearchState {
  findText: string
  replaceText: string
  caseSensitive: boolean
  showReplace: boolean
}

// Состояние поиска для каждой вкладки — переживает перемонтирование
const perTabState = new Map<string, TabSearchState>()

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

function FindReplace({ editor, tabId, onClose, t }: FindReplaceProps) {
  const saved = perTabState.get(tabId)
  const [findText, setFindText] = useState(saved?.findText ?? '')
  const [replaceText, setReplaceText] = useState(saved?.replaceText ?? '')
  const [caseSensitive, setCaseSensitive] = useState(saved?.caseSensitive ?? false)
  const [showReplace, setShowReplace] = useState(saved?.showReplace ?? false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [currentIndex, setCurrentIndex] = useState(-1)
  const findInputRef = useRef<HTMLInputElement>(null)
  const prevTabIdRef = useRef(tabId)

  useEffect(() => {
    findInputRef.current?.focus()
  }, [])

  useEffect(() => {
    perTabState.set(tabId, { findText, replaceText, caseSensitive, showReplace })
  }, [tabId, findText, replaceText, caseSensitive, showReplace])

  const updateHighlights = useCallback(
    (matches: SearchResult[], activeIdx: number) => {
      if (!editor) return
      editor.view.dispatch(buildSearchTx(editor.view.state, matches, activeIdx))
    },
    [editor]
  )

  const clearHighlights = useCallback(() => {
    if (!editor) return
    editor.view.dispatch(buildClearTx(editor.view.state))
  }, [editor])

  // Скролл к совпадению: setTextSelection + scrollIntoView на транзакции + fallback через DOM
  const scrollToMatch = useCallback(
    (match: SearchResult) => {
      if (!editor) return
      const { from, to } = match

      // Устанавливаем выделение и скроллим через ProseMirror (без .focus() — фокус остаётся в поле поиска)
      editor.chain().setTextSelection({ from, to }).scrollIntoView().run()

      // Дополнительный скролл через DOM — центрируем совпадение в верхней трети
      setTimeout(() => {
        try {
          const coords = editor.view.coordsAtPos(from)
          const scrollEl = document.querySelector('.editor-scroll')
          if (scrollEl && coords) {
            const rect = scrollEl.getBoundingClientRect()
            const target = scrollEl.scrollTop + coords.top - rect.top - rect.height / 3
            scrollEl.scrollTo({ top: target, behavior: 'smooth' })
          }
        } catch { /* позиция может быть недоступна */ }
      }, 30)
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
      updateHighlights(matches, idx)
      if (matches.length > 0 && idx >= 0) {
        scrollToMatch(matches[idx])
      }
    },
    [editor, clearHighlights, updateHighlights, scrollToMatch]
  )

  // При переключении вкладки: очищаем старую подсветку, восстанавливаем состояние, перезапускаем поиск
  useEffect(() => {
    if (prevTabIdRef.current === tabId) return
    prevTabIdRef.current = tabId

    clearHighlights()

    const restore = perTabState.get(tabId)
    if (restore) {
      setFindText(restore.findText)
      setReplaceText(restore.replaceText)
      setCaseSensitive(restore.caseSensitive)
      setShowReplace(restore.showReplace)

      if (restore.findText && editor) {
        // Ждём пока Editor обновит контент (useEffect в Editor запускается позже)
        setTimeout(() => {
          const matches = findAllMatches(editor, restore.findText, restore.caseSensitive)
          setResults(matches)
          const idx = matches.length > 0 ? 0 : -1
          setCurrentIndex(idx)
          if (matches.length > 0) {
            updateHighlights(matches, idx)
            scrollToMatch(matches[idx])
          }
        }, 50)
      } else {
        setResults([])
        setCurrentIndex(-1)
      }
    } else {
      setFindText('')
      setReplaceText('')
      setCaseSensitive(false)
      setShowReplace(false)
      setResults([])
      setCurrentIndex(-1)
    }
  }, [tabId, editor]) // eslint-disable-line react-hooks/exhaustive-deps

  // Очистка при закрытии панели
  useEffect(() => {
    return () => {
      if (editor) {
        editor.view.dispatch(buildClearTx(editor.view.state))
      }
    }
  }, [editor])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

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
      const newIdx = direction === 'next'
        ? (currentIndex + 1) % results.length
        : (currentIndex - 1 + results.length) % results.length
      setCurrentIndex(newIdx)
      updateHighlights(results, newIdx)
      scrollToMatch(results[newIdx])
    },
    [results, currentIndex, updateHighlights, scrollToMatch]
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
        e.shiftKey ? goToMatch('prev') : goToMatch('next')
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
          placeholder={t('find.placeholder')}
          value={findText}
          onChange={handleFindChange}
          onKeyDown={handleFindKeyDown}
        />
        <span className="find-count">
          {results.length > 0
            ? `${currentIndex + 1}/${results.length}`
            : findText
              ? t('find.noResults')
              : ''}
        </span>
        <button
          className={`find-btn find-case-btn ${caseSensitive ? 'active' : ''}`}
          onClick={handleCaseSensitiveToggle}
          title={t('find.caseSensitive')}
        >
          Aa
        </button>
        <button className="find-btn" onClick={() => goToMatch('prev')} title={t('find.previous')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
        <button className="find-btn" onClick={() => goToMatch('next')} title={t('find.next')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        <button
          className={`find-btn find-expand-btn ${showReplace ? 'active' : ''}`}
          onClick={() => setShowReplace(!showReplace)}
          title={t('find.toggleReplace')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 1l4 4-4 4" />
            <path d="M3 11V9a4 4 0 0 1 4-4h14" />
            <path d="M7 23l-4-4 4-4" />
            <path d="M21 13v2a4 4 0 0 1-4 4H3" />
          </svg>
        </button>
        <button className="find-btn find-close-btn" onClick={handleClose} title={t('find.close')}>
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
            placeholder={t('find.replacePlaceholder')}
            value={replaceText}
            onChange={(e) => setReplaceText(e.target.value)}
          />
          <button className="find-btn replace-btn" onClick={handleReplace} title={t('find.replace')}>
            {t('find.replace')}
          </button>
          <button className="find-btn replace-btn" onClick={handleReplaceAll} title={t('find.replaceAll')}>
            {t('find.replaceAll')}
          </button>
        </div>
      )}
    </div>
  )
}

export default FindReplace
