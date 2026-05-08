# InkDown

**The open-source WYSIWYG markdown editor you deserve.**

InkDown is a beautiful, fast, and resource-efficient markdown editor — a free and open-source alternative to Typora. Write in markdown with a seamless live preview that renders your content as you type.

---

## Features

- **WYSIWYG Markdown Editing** — Type markdown and see it rendered instantly. No split panes, no context switching.
- **Source Mode** — Toggle to raw markdown source view with a single shortcut (`Ctrl+/`).
- **File Explorer** — Built-in sidebar with folder tree navigation for managing your markdown files.
- **Dark & Light Themes** — Beautiful Catppuccin-inspired dark theme and a clean light theme.
- **Focus Mode** — Distraction-free writing with `Ctrl+Shift+F`.
- **Syntax Highlighting** — Code blocks with syntax highlighting for 30+ languages.
- **Rich Formatting** — Headings, bold, italic, underline, strikethrough, highlight, blockquotes, lists, task lists, tables, images, links, horizontal rules, and more.
- **Export** — Export your documents to HTML or PDF.
- **Keyboard Shortcuts** — Full set of keyboard shortcuts for power users.
- **Cross-Platform** — Built with Electron for Windows (Linux and macOS coming soon).
- **Resource Efficient** — Optimized for minimal memory and CPU usage.
- **Privacy First** — No telemetry, no analytics, fully offline.

## Screenshots

*Coming soon*

## Installation

### Download

Download the latest release from the [Releases](https://github.com/BOSSincrypto/inkdown/releases) page.

### Build from Source

```bash
# Clone the repository
git clone https://github.com/BOSSincrypto/inkdown.git
cd inkdown

# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run electron:build
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
| Heading 1 | `Ctrl+1` |
| Heading 2 | `Ctrl+2` |
| Heading 3 | `Ctrl+3` |
| Code | `Ctrl+E` |
| Code Block | `Ctrl+Shift+K` |
| Blockquote | `Ctrl+Shift+Q` |
| Toggle Sidebar | `Ctrl+\` |
| Toggle Source Mode | `Ctrl+/` |
| Focus Mode | `Ctrl+Shift+F` |
| Toggle Dark Mode | `Ctrl+Shift+D` |
| Find | `Ctrl+F` |
| Zoom In | `Ctrl++` |
| Zoom Out | `Ctrl+-` |
| Reset Zoom | `Ctrl+0` |
| Fullscreen | `F11` |

## Tech Stack

- **[Electron](https://www.electronjs.org/)** — Cross-platform desktop framework
- **[React](https://react.dev/)** — UI library
- **[Tiptap](https://tiptap.dev/)** — Headless WYSIWYG editor framework (ProseMirror-based)
- **[TypeScript](https://www.typescriptlang.org/)** — Type-safe JavaScript
- **[Vite](https://vitejs.dev/)** — Lightning-fast build tool

## Roadmap

- [ ] Linux support
- [ ] macOS support
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

**InkDown** — Write beautifully. Open source.
