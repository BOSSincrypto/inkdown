import { useState, useCallback, useRef, useEffect } from 'react'
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react'
import type { NodeViewProps } from '@tiptap/react'
import './CodeBlock.css'

function CodeBlock({ node, updateAttributes, extension }: NodeViewProps) {
  const [copied, setCopied] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const language = node.attrs.language || ''
  const languages: string[] = extension.options.lowlight
    ?.listLanguages?.() ?? []

  const handleCopy = useCallback(() => {
    const text = node.textContent
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }, [node])

  const handleLanguageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      updateAttributes({ language: e.target.value })
    },
    [updateAttributes]
  )

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault()
        e.stopPropagation()
        const codeEl = wrapper.querySelector('code')
        if (!codeEl) return
        const range = document.createRange()
        range.selectNodeContents(codeEl)
        const sel = window.getSelection()
        sel?.removeAllRanges()
        sel?.addRange(range)
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        const sel = window.getSelection()
        if (sel && sel.toString()) {
          e.preventDefault()
          e.stopPropagation()
          navigator.clipboard.writeText(sel.toString())
        }
      }
    }

    wrapper.addEventListener('keydown', handleKeyDown, true)
    return () => wrapper.removeEventListener('keydown', handleKeyDown, true)
  }, [])

  return (
    <NodeViewWrapper className="code-block-wrapper" ref={wrapperRef}>
      <div className="code-block-header">
        <select
          className="code-block-lang"
          value={language}
          onChange={handleLanguageChange}
          contentEditable={false}
        >
          <option value="">plain</option>
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
        <button
          className="code-block-copy"
          onClick={handleCopy}
          contentEditable={false}
          title="Copy code"
        >
          {copied ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          )}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <pre>
        <NodeViewContent as="code" />
      </pre>
    </NodeViewWrapper>
  )
}

export default CodeBlock
