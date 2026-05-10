# Contributing to InkDown

Thank you for your interest in contributing to InkDown! This guide will help you get started.

## Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18.x
- [pnpm](https://pnpm.io/) >= 10.x
- [Git](https://git-scm.com/)

### Getting Started

```bash
# Clone the repository
git clone https://github.com/BOSSincrypto/inkdown.git
cd inkdown

# Install dependencies
pnpm install

# Start the development server
pnpm run dev
```

### Project Structure

```
inkdown/
├── electron/           # Electron main process
│   ├── main.ts         # App entry, window management, menus, IPC
│   └── preload.ts      # Context bridge (renderer <-> main IPC)
├── src/                # React renderer
│   ├── main.tsx        # React entry point
│   ├── App.tsx         # Root component & state management
│   ├── components/     # UI components
│   │   ├── Editor/     # Tiptap WYSIWYG editor
│   │   ├── Sidebar/    # File tree explorer
│   │   ├── Toolbar/    # Formatting toolbar
│   │   ├── TitleBar/   # Custom window title bar
│   │   ├── MenuBar/   # In-app menu bar (File, Edit, etc.)
│   │   ├── ContextMenu/ # Right-click context menu
│   │   └── StatusBar/  # Bottom status bar
│   ├── styles/         # Global CSS & themes
│   └── types.d.ts      # TypeScript declarations
├── resources/          # App icons & assets
├── index.html          # HTML entry
├── vite.config.ts      # Vite + Electron config
└── package.json
```

### Available Scripts

- `pnpm run dev` — Start development server with hot reload
- `pnpm run build` — Build the renderer
- `pnpm run electron:build` — Build the full Electron app
- `pnpm run lint` — Run ESLint
- `pnpm run typecheck` — Run TypeScript type checking

## Guidelines

### Code Style

- Use TypeScript for all new code
- Follow the existing code patterns and conventions
- Use functional React components with hooks
- Keep components small and focused
- Use CSS variables for theming (no CSS-in-JS)

### Commits

- Write clear, descriptive commit messages
- Use conventional commit format: `feat:`, `fix:`, `docs:`, `refactor:`, etc.
- Keep commits focused on a single change

### Pull Requests

- Create a feature branch from `main`
- Write a clear PR description explaining what and why
- Ensure all lint checks pass
- Add screenshots for UI changes
- Keep PRs focused and reasonably sized

## Architecture Decisions

- **Electron** for cross-platform desktop support
- **Tiptap/ProseMirror** for WYSIWYG editing (extensible, well-maintained)
- **CSS Custom Properties** for theming (performant, no runtime overhead)
- **No external state management** — React useState/useCallback suffices for current complexity
- **Minimal dependencies** — Every dependency must justify its bundle size

## Need Help?

Open an issue or start a discussion on GitHub.
