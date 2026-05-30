import { useEffect, useRef, useCallback } from 'react'
import { useEditor, EditorContent, ReactNodeViewRenderer } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Highlight from '@tiptap/extension-highlight'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import Placeholder from '@tiptap/extension-placeholder'
import Typography from '@tiptap/extension-typography'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { Markdown } from 'tiptap-markdown'
import { common, createLowlight } from 'lowlight'
import type { Editor as TiptapEditor } from '@tiptap/core'
import CodeBlock from '../CodeBlock/CodeBlock'
import './Editor.css'

const lowlight = createLowlight(common)

interface EditorProps {
  content: string
  markdownContent: string
  sourceMode: boolean
  onContentChange: (editor: TiptapEditor) => void
  onEditorReady: (editor: TiptapEditor) => void
  onSourceChange: (markdown: string) => void
}

function Editor({
  content,
  sourceMode,
  onContentChange,
  onEditorReady,
  onSourceChange,
}: EditorProps) {
  const sourceRef = useRef<HTMLTextAreaElement>(null)
  const isExternalUpdate = useRef(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        heading: { levels: [1, 2, 3, 4, 5, 6] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'editor-link' },
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      Placeholder.configure({
        placeholder: 'Start writing with markdown...',
      }),
      Typography,
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlock)
        },
      }).configure({ lowlight }),
      Markdown.configure({
        html: true,
        tightLists: true,
        bulletListMarker: '-',
        transformPastedText: true,
        transformCopiedText: false,
      }),
    ],
    content: '',
    onUpdate: ({ editor: ed }) => {
      if (!isExternalUpdate.current) {
        onContentChange(ed)
      }
    },
    editorProps: {
      attributes: {
        class: 'inkdown-editor-content',
        spellcheck: 'true',
      },
    },
  })

  useEffect(() => {
    if (editor) {
      onEditorReady(editor)
    }
  }, [editor, onEditorReady])

  useEffect(() => {
    if (editor && content !== undefined) {
      isExternalUpdate.current = true
      editor.commands.setContent(content)
      isExternalUpdate.current = false
    }
  }, [editor, content])

  const handleSourceInput = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onSourceChange(e.target.value)
    },
    [onSourceChange]
  )

  useEffect(() => {
    if (sourceMode && sourceRef.current && editor) {
      sourceRef.current.value = editor.storage.markdown.getMarkdown()
    }
  }, [sourceMode, editor])

  if (sourceMode) {
    return (
      <div className="editor-container source-mode">
        <textarea
          ref={sourceRef}
          className="source-editor"
          defaultValue={editor?.storage.markdown.getMarkdown() || ''}
          onChange={handleSourceInput}
          spellCheck
          placeholder="Write markdown here..."
        />
      </div>
    )
  }

  return (
    <div className="editor-container">
      <div className="editor-scroll">
        <EditorContent editor={editor} className="editor-wrapper" />
      </div>
    </div>
  )
}

export default Editor
