---
name: testing-inkdown-ui
description: Test InkDown's UI features end-to-end in a browser. Use when verifying MenuBar, sidebar, formatting, or other UI changes.
---

# Testing InkDown UI

## Prerequisites

- Node 20+
- pnpm installed (`npm i -g pnpm`)
- Dependencies installed (`pnpm install`)

## Running the Frontend for Testing

InkDown uses `vite-plugin-electron` which launches Electron alongside Vite. On headless VMs or when Electron GUI is unavailable, use a **web-only Vite config** to test just the React frontend:

1. Create `vite.web.config.ts` at repo root (not committed):
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  server: { port: 5173 },
})
```

2. Run: `npx vite --config vite.web.config.ts --port 5173`
3. Open http://localhost:5173 in Chrome

**Note:** This file should NOT be committed. Add it to `.gitignore` if needed.

## Key Testing Patterns

### MenuBar Testing
- Click a menu trigger (File/Edit/Paragraph/Format/View/Help) to open its dropdown
- Dropdowns are absolutely positioned from `.menubar-group` elements
- Escape key closes the active dropdown
- Clicking outside the menu bar closes dropdowns
- Menu switching: click one menu, then click another (toggle behavior, not hover-to-switch)

### Sidebar Toggle
- View > Toggle Sidebar hides/shows the EXPLORER panel
- When hidden: no "EXPLORER" text, no "Open Folder" button in DOM
- When visible: full sidebar with file tree or empty state

### About Dialog
- Help > About InkDown triggers `window.alert()` with version string
- In automated testing, override `window.alert` to capture the message:
```js
window._lastAlert = null;
window.alert = (msg) => { window._lastAlert = msg; };
// Then trigger About, then read window._lastAlert
```

### Bold/Format Testing
- Type text in editor, select it (triple-click for whole line)
- Click Format > Bold
- Verify: `document.querySelector('.tiptap strong')?.textContent` contains the text

## Known Gotchas

1. **CSS overflow clipping**: If dropdowns are invisible but present in DOM, check parent elements for `overflow: hidden`. The `.titlebar-drag` element previously had this issue — fix is `min-width: 0` instead.

2. **Electron-only features**: Clipboard paste via IPC (`editCut`/`editCopy`/`editPaste`) only works in Electron. In web mode, it falls back to Clipboard API or `document.execCommand`.

3. **macOS-specific UI**: The custom MenuBar is hidden on darwin (CSS `.platform-darwin .menubar { display: none }`). Custom window controls are also hidden. These cannot be tested without macOS.

4. **Alert dialogs**: Chrome may auto-dismiss or block `window.alert()` in automated contexts. Use the console override pattern above.

## Devin Secrets Needed

None — testing runs entirely locally without external services.
