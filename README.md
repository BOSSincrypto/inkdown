# InkDown

**The open-source WYSIWYG markdown editor you deserve.**

InkDown is a beautiful, fast, and resource-efficient markdown editor — a free and open-source alternative to Typora. Write in markdown with a seamless live preview that renders your content as you type. Available for **Windows**, **macOS**, and **Linux**.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub release](https://img.shields.io/github/v/release/BOSSincrypto/inkdown)](https://github.com/BOSSincrypto/inkdown/releases)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey)](https://github.com/BOSSincrypto/inkdown/releases)

---

## Why InkDown?

- **Free & Open Source** — No license fees, no subscriptions, no telemetry
- **Typora-like Experience** — WYSIWYG markdown editing with real-time rendering
- **Cross-Platform** — Native apps for Windows, macOS, and Linux
- **Lightweight** — Optimized for minimal memory and CPU usage
- **Privacy First** — Fully offline, no analytics, your data stays on your device

## Features

- **WYSIWYG Markdown Editing** — Type markdown and see it rendered instantly. No split panes, no context switching.
- **Menu Bar** — Full menu bar (File, Edit, Paragraph, Format, View, Help) with all editor actions and keyboard shortcuts, like Typora.
- **Source Mode** — Toggle to raw markdown source view with a single shortcut (`Ctrl+/`).
- **File Explorer** — Built-in sidebar with folder tree navigation for managing your markdown files.
- **Dark & Light Themes** — Beautiful Catppuccin-inspired dark theme and a clean light theme.
- **Focus Mode** — Distraction-free writing with `Ctrl+Shift+F`.
- **Syntax Highlighting** — Code blocks with syntax highlighting for 30+ programming languages.
- **Rich Formatting** — Headings (1–6), bold, italic, underline, strikethrough, highlight, blockquotes, ordered/unordered/task lists, tables, images, links, horizontal rules, and more.
- **Export** — Export your documents to HTML or PDF.
- **Keyboard Shortcuts** — Full set of keyboard shortcuts for power users.
- **Context Menu** — Right-click context menu with quick formatting actions.
- **File Association** — Double-click `.md` files to open them directly in InkDown.
- **Resource Efficient** — Optimized startup time and minimal resource consumption.
- **Privacy First** — No telemetry, no analytics, fully offline.

## Screenshots

<img width="1400" height="923" alt="export4995E69E-1E1B-45DD-A522-A027F61987DA" src="https://github.com/user-attachments/assets/54ad1aef-726e-49d8-a399-e48b4c4f4027" />

## Installation

### Download

Download the latest release from the [Releases](https://github.com/BOSSincrypto/inkdown/releases) page:

- **Windows**: `.exe` installer or portable version
- **macOS**: `.dmg` disk image
- **Linux**: `.AppImage` or `.deb` package

### Build from Source

```bash
# Clone the repository
git clone https://github.com/BOSSincrypto/inkdown.git
cd inkdown

# Install dependencies (requires pnpm)
pnpm install

# Run in development mode
pnpm run dev

# Build for production
pnpm run electron:build
```

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| New File | `Ctrl+N` |
| Open File | `Ctrl+O` |
| Open Folder | `Ctrl+Shift+O` |
| Save | `Ctrl+S` |
| Save As | `Ctrl+Shift+S` |
| Bold | `Ctrl+B` |
| Italic | `Ctrl+I` |
| Underline | `Ctrl+U` |
| Strikethrough | `Ctrl+Shift+X` |
| Heading 1–6 | `Ctrl+1` to `Ctrl+6` |
| Code | `Ctrl+E` |
| Code Block | `Ctrl+Shift+K` |
| Blockquote | `Ctrl+Shift+Q` |
| Hyperlink | `Ctrl+K` |
| Toggle Sidebar | `Ctrl+\` |
| Toggle Source Mode | `Ctrl+/` |
| Focus Mode | `Ctrl+Shift+F` |
| Toggle Dark Mode | `Ctrl+Shift+D` |
| Find | `Ctrl+F` |
| Zoom In | `Ctrl+Shift+=` |
| Zoom Out | `Ctrl+Shift+-` |
| Reset Zoom | `Ctrl+Shift+9` |
| Fullscreen | `F11` |

> On macOS, use `Cmd` instead of `Ctrl`.

## Tech Stack

- **[Electron](https://www.electronjs.org/)** — Cross-platform desktop framework
- **[React](https://react.dev/)** — UI library
- **[Tiptap](https://tiptap.dev/)** — Headless WYSIWYG editor framework (ProseMirror-based)
- **[TypeScript](https://www.typescriptlang.org/)** — Type-safe JavaScript
- **[Vite](https://vitejs.dev/)** — Lightning-fast build tool
- **[pnpm](https://pnpm.io/)** — Fast, disk-efficient package manager

## Roadmap

- [ ] Android support (via React Native or similar)
- [ ] Plugin/extension system
- [ ] Custom themes
- [ ] Mermaid diagram support
- [ ] LaTeX/KaTeX math support
- [ ] Find and replace
- [ ] Outline/Table of Contents view
- [ ] Word count goal
- [ ] Auto-save
- [ ] Recent files
- [ ] Drag and drop images
- [ ] Spell checking with custom dictionaries
- [ ] Zen/typewriter mode
- [ ] i18n / localization
- [ ] Collaboration (WebRTC)

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) before submitting a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

**InkDown** — Write beautifully. Open source. Free forever.
