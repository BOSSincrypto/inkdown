import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'
import type { EditorState, Transaction } from '@tiptap/pm/state'

export const SEARCH_PLUGIN_KEY = new PluginKey<DecorationSet>('searchHighlight')

// Плагин поддерживает DecorationSet — ProseMirror сам управляет DOM-декорациями,
// не ломая внутреннее состояние редактора
export const SearchHighlight = Extension.create({
  name: 'searchHighlight',
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: SEARCH_PLUGIN_KEY,
        state: {
          init(): DecorationSet {
            return DecorationSet.empty
          },
          apply(tr, old: DecorationSet): DecorationSet {
            const meta = tr.getMeta(SEARCH_PLUGIN_KEY)
            if (meta !== undefined) return meta
            return old
          },
        },
        props: {
          decorations(state: EditorState): DecorationSet | undefined {
            const val = (this as unknown as { getState: (s: EditorState) => DecorationSet | undefined }).getState(state)
            return val
          },
        },
      }),
    ]
  },
})

// Обновить подсветку поиска: вернуть Transaction с новыми декорациями
export function buildSearchTx(
  state: EditorState,
  matches: Array<{ from: number; to: number }>,
  activeIdx: number
): Transaction {
  if (matches.length === 0) {
    return state.tr.setMeta(SEARCH_PLUGIN_KEY, DecorationSet.empty)
  }

  const decorations = matches.map((match, i) =>
    Decoration.inline(match.from, match.to, {
      class: i === activeIdx ? 'find-highlight-current' : 'find-highlight',
    })
  )

  const decSet = DecorationSet.create(state.doc, decorations)
  return state.tr.setMeta(SEARCH_PLUGIN_KEY, decSet)
}

// Очистить все подсветки, вернуть Transaction
export function buildClearTx(state: EditorState): Transaction {
  return state.tr.setMeta(SEARCH_PLUGIN_KEY, DecorationSet.empty)
}
