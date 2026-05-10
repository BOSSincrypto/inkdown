<div align="center">

# InkDown

**The open-source WYSIWYG markdown editor you deserve.**

InkDown is a beautiful, fast, and resource-efficient markdown editor — a free and open-source alternative to Typora. Write in markdown with a seamless live preview that renders your content as you type. Available for **Windows**, **macOS**, and **Linux**.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub release](https://img.shields.io/github/v/release/BOSSincrypto/inkdown)](https://github.com/BOSSincrypto/inkdown/releases)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey)](https://github.com/BOSSincrypto/inkdown/releases)
[![Stars](https://img.shields.io/github/stars/BOSSincrypto/inkdown?style=social)](https://github.com/BOSSincrypto/inkdown/stargazers)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Electron](https://img.shields.io/badge/Electron-desktop-47848f?logo=electron)](https://www.electronjs.org/)

[Download](https://github.com/BOSSincrypto/inkdown/releases) • [Documentation](#features) • [Contributing](CONTRIBUTING.md) • [Report a Bug](https://github.com/BOSSincrypto/inkdown/issues)

</div>

---

## What is InkDown?

InkDown is a **free, open-source WYSIWYG markdown editor** built with Electron, React, and Tiptap. It renders your markdown live as you type — no split panes, no distractions. If you're looking for a **free alternative to Typora**, InkDown gives you the same seamless editing experience without any cost or license restrictions.

> **WYSIWYG** (What You See Is What You Get) — format your text visually while writing pure markdown under the hood.

---

## Why InkDown?

| Feature | InkDown | Typora |
|---|---|---|
| Price | **Free forever** | $14.99 one-time |
| Open Source | **Yes** | No |
| WYSIWYG Editing | **Yes** | Yes |
| Live Preview | **Yes** | Yes |
| Cross-Platform | **Yes** | Yes |
| Privacy / No Telemetry | **Yes** | Unknown |
| File Explorer Sidebar | **Yes** | Yes |
| Source Mode | **Yes** | Yes |
| Export to HTML/PDF | **Yes** | Yes |
| Dark & Light Themes | **Yes** | Yes |

- **Free & Open Source** — No license fees, no subscriptions, no telemetry. Forever.
- **Typora Alternative** — WYSIWYG markdown editing with real-time rendering, just like Typora.
- **Cross-Platform** — Native desktop apps for Windows, macOS, and Linux.
- **Lightweight** — Optimized for minimal memory and CPU usage.
- **Privacy First** — Fully offline, no analytics, your data stays on your device.
- **Beautiful UI** — Catppuccin-inspired dark theme and a clean light theme.

---

## Features

### Core Editing
- **WYSIWYG Markdown Editing** — Type markdown and see it rendered instantly. No split panes, no context switching.
- **Source Mode** — Toggle to raw markdown source view with a single shortcut (`Ctrl+/`).
- **Rich Formatting** — Headings (1–6), bold, italic, underline, strikethrough, highlight, blockquotes, ordered/unordered/task lists, tables, images, links, horizontal rules, and more.
- **Syntax Highlighting** — Code blocks with syntax highlighting for 30+ programming languages.

### Navigation & UI
- **Menu Bar** — Full menu bar (File, Edit, Paragraph, Format, View, Help) with all editor actions and keyboard shortcuts.
- **File Explorer** — Built-in sidebar with folder tree navigation for managing your markdown files.
- **Dark & Light Themes** — Beautiful Catppuccin-inspired dark theme and a clean light theme.
- **Focus Mode** — Distraction-free writing with `Ctrl+Shift+F`.

### Productivity
- **Export** — Export your documents to HTML or PDF.
- **Keyboard Shortcuts** — Full set of keyboard shortcuts for power users.
- **Context Menu** — Right-click context menu with quick formatting actions.
- **File Association** — Double-click `.md` files to open them directly in InkDown.
- **Resource Efficient** — Optimized startup time and minimal resource consumption.

---

## Screenshots

<img width="1480" height="923" alt="InkDown - WYSIWYG Markdown Editor" src="https://github.com/user-attachments/assets/30814f13-8677-4de6-b7d7-60e8f5dad84e" />

---

## Installation

### Download (Recommended)

Download the latest release from the [Releases](https://github.com/BOSSincrypto/inkdown/releases) page:

| Platform | File |
|---|---|
| **Windows** | `.exe` installer or portable version |
| **macOS** | `.dmg` disk image |
| **Linux** | `.AppImage` or `.deb` package |

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

**Requirements:** Node.js 18+, pnpm 8+

---

## Keyboard Shortcuts

| Action | Shortcut |
|---|---|
| New File | `Ctrl+N` |
| Open File | `Ctrl+O` |
| Save | `Ctrl+S` |
| Toggle Source Mode | `Ctrl+/` |
| Focus Mode | `Ctrl+Shift+F` |
| Bold | `Ctrl+B` |
| Italic | `Ctrl+I` |
| Underline | `Ctrl+U` |
| Strikethrough | `Ctrl+Shift+S` |
| Heading 1–6 | `Ctrl+1` – `Ctrl+6` |
| Code Block | `` Ctrl+` `` |
| Export to HTML | `Ctrl+E` |

---

## Tech Stack

- **[Electron](https://electronjs.org)** — Cross-platform desktop shell
- **[React](https://reactjs.org)** — UI framework
- **[Tiptap](https://tiptap.dev)** — Headless rich-text editor framework
- **[TypeScript](https://typescriptlang.org)** — Type-safe development
- **[Vite](https://vitejs.dev)** — Fast build tooling

---

## FAQ

**Is InkDown really free?**
Yes. InkDown is MIT-licensed and free forever. No subscriptions, no trials, no paywalls.

**Is InkDown a Typora alternative?**
Absolutely. InkDown offers the same WYSIWYG markdown editing experience as Typora but is completely free and open-source.

**Does InkDown collect data?**
No. InkDown is fully offline and does not collect any analytics or telemetry.

**Which markdown features are supported?**
InkDown supports all standard CommonMark and GFM (GitHub Flavored Markdown) features: headings, bold, italic, strikethrough, tables, task lists, code blocks with syntax highlighting, blockquotes, images, links, and more.

**Can I use InkDown on Linux?**
Yes! InkDown is available as an `.AppImage` and `.deb` package for Linux.

---

---

## InkDown for AI Users & Prompt Engineers

InkDown is the ideal editor for anyone working with AI tools like **ChatGPT**, **Claude**, **Gemini**, and other LLMs. Markdown is the universal language of AI — use InkDown to write, structure, and manage your AI workflows.

### Why Markdown is Perfect for AI

- **Prompt Engineering** — Structure your prompts with headings, lists, bold text, and code blocks to get better results from LLMs.
- **LLM-Ready Documentation** — Write docs in markdown that AI agents can parse directly. Markdown is 80–90% more token-efficient than HTML for LLMs.
- **Knowledge Base** — Build and maintain a personal knowledge base in `.md` files that you can feed directly to ChatGPT, Claude, or any RAG pipeline.
- **Context Preparation** — Format and organize context windows for AI assistants before pasting into chat.
- **AI Prompt Templates** — Create reusable prompt templates with markdown structure: role definitions, instructions, output formats.
- **LLM Comments** — Use markdown comments (`<!-- LLM: instructions here -->`) to embed hidden guidance for AI agents without cluttering human-readable content.

### Common AI Use Cases

| Use Case | How InkDown Helps |
|---|---|
| Writing ChatGPT prompts | WYSIWYG formatting, clean export, no noise |
| Building Claude project docs | Folder tree + `.md` files as knowledge base |
| Prompt template library | File explorer to organize prompt collections |
| LLM-ready documentation | Clean markdown output, perfect for `llms.txt` |
| AI agent context files | Export to clean `.md` for RAG pipelines |
| Daily notes for AI journaling | Focus mode + offline privacy |

### InkDown + AI Workflow Example

```markdown
# System Prompt Template

<!-- LLM: You are a helpful assistant. Use the context below. -->

## Role
You are an expert **[role]** specializing in **[domain]**.

## Task
> Describe the task clearly here.

## Context
- Key fact 1
- Key fact 2

## Output Format
Respond with a structured markdown document including:
1. Summary
2. Details
3. Action items
```

> **InkDown renders this beautifully** while keeping the raw markdown perfect for LLMs.

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push and open a Pull Request

---

## License

InkDown is licensed under the [MIT License](LICENSE). Use it freely in personal and commercial projects.

---

<div align="center">

**InkDown** — The open-source WYSIWYG markdown editor you deserve.

A beautiful, fast, privacy-first alternative to Typora for Windows, macOS & Linux.

[GitHub](https://github.com/BOSSincrypto/inkdown) • [Releases](https://github.com/BOSSincrypto/inkdown/releases) • [Issues](https://github.com/BOSSincrypto/inkdown/issues)

</div>
