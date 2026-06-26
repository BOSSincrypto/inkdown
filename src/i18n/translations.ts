const translations = {
  en: {
    // Menu bar
    'menu.file': 'File',
    'menu.edit': 'Edit',
    'menu.paragraph': 'Paragraph',
    'menu.format': 'Format',
    'menu.view': 'View',
    'menu.help': 'Help',

    // File menu
    'file.newTab': 'New Tab',
    'file.closeTab': 'Close Tab',
    'file.openFile': 'Open File...',
    'file.openFolder': 'Open Folder...',
    'file.recent': 'Recent',
    'file.recentFiles': 'Recent Files',
    'file.recentFolders': 'Recent Folders',
    'file.noRecent': 'No recent items',
    'file.clearRecent': 'Clear History',
    'file.save': 'Save',
    'file.saveAs': 'Save As...',
    'file.export': 'Export',
    'file.exportHTML': 'HTML',
    'file.exportPDF': 'PDF',
    'file.preferences': 'Preferences',
    'file.closeWindow': 'Close Window',

    // Edit menu
    'edit.undo': 'Undo',
    'edit.redo': 'Redo',
    'edit.cut': 'Cut',
    'edit.copy': 'Copy',
    'edit.paste': 'Paste',
    'edit.selectAll': 'Select All',
    'edit.find': 'Find & Replace',

    // Paragraph menu
    'paragraph.heading1': 'Heading 1',
    'paragraph.heading2': 'Heading 2',
    'paragraph.heading3': 'Heading 3',
    'paragraph.heading4': 'Heading 4',
    'paragraph.heading5': 'Heading 5',
    'paragraph.heading6': 'Heading 6',
    'paragraph.table': 'Table',
    'paragraph.codeBlock': 'Code Block',
    'paragraph.quote': 'Quote',
    'paragraph.orderedList': 'Ordered List',
    'paragraph.unorderedList': 'Unordered List',
    'paragraph.taskList': 'Task List',
    'paragraph.horizontalLine': 'Horizontal Line',

    // Format menu
    'format.bold': 'Bold',
    'format.italic': 'Italic',
    'format.underline': 'Underline',
    'format.code': 'Code',
    'format.strikethrough': 'Strikethrough',
    'format.highlight': 'Highlight',
    'format.hyperlink': 'Hyperlink',
    'format.image': 'Image',
    'format.clearFormat': 'Clear Format',

    // View menu
    'view.toggleSidebar': 'Toggle Sidebar',
    'view.sourceMode': 'Source Code Mode',
    'view.focusMode': 'Focus Mode',
    'view.toggleDarkMode': 'Toggle Dark Mode',
    'view.zoomIn': 'Zoom In',
    'view.zoomOut': 'Zoom Out',
    'view.actualSize': 'Actual Size',
    'view.toggleFullscreen': 'Toggle Fullscreen',

    // Help menu
    'help.checkUpdates': 'Check for Updates...',
    'help.about': 'About InkDown',
    'help.github': 'GitHub Repository',
    'help.shortcuts': 'Keyboard Shortcuts',
    'help.devtools': 'Toggle DevTools',

    // Toolbar
    'toolbar.bold': 'Bold (Ctrl+B)',
    'toolbar.italic': 'Italic (Ctrl+I)',
    'toolbar.underline': 'Underline (Ctrl+U)',
    'toolbar.strike': 'Strikethrough',
    'toolbar.highlight': 'Highlight',
    'toolbar.heading1': 'Heading 1',
    'toolbar.heading2': 'Heading 2',
    'toolbar.heading3': 'Heading 3',
    'toolbar.bulletList': 'Bullet List',
    'toolbar.orderedList': 'Ordered List',
    'toolbar.taskList': 'Task List',
    'toolbar.blockquote': 'Blockquote',
    'toolbar.codeBlock': 'Code Block',
    'toolbar.link': 'Link',
    'toolbar.image': 'Image',
    'toolbar.table': 'Table',
    'toolbar.horizontalRule': 'Horizontal Rule',
    'toolbar.fullWidth': 'Width',
    'toolbar.source': 'Source',

    // Sidebar
    'sidebar.explorer': 'Explorer',
    'sidebar.toc': 'Contents',
    'sidebar.noFolder': 'No folder opened',
    'sidebar.openFolder': 'Open Folder',

    // Table of Contents
    'toc.title': 'Table of Contents',
    'toc.noHeadings': 'No headings found',

    // Status bar
    'statusbar.modified': 'Modified',
    'statusbar.words': '{count} {count, plural, one {word} other {words}}',
    'statusbar.chars': '{count} {count, plural, one {char} other {chars}}',
    'statusbar.lines': '{count} {count, plural, one {line} other {lines}}',
    'statusbar.source': 'Source',
    'statusbar.wysiwyg': 'WYSIWYG',

    // Find & Replace
    'find.placeholder': 'Find...',
    'find.noResults': 'No results',
    'find.caseSensitive': 'Case sensitive',
    'find.previous': 'Previous (Shift+Enter)',
    'find.next': 'Next (Enter)',
    'find.toggleReplace': 'Toggle Replace',
    'find.close': 'Close (Esc)',
    'find.replacePlaceholder': 'Replace...',
    'find.replace': 'Replace',
    'find.replaceAll': 'All',

    // Editor
    'editor.placeholder': 'Start writing with markdown...',

    // Settings
    'settings.title': 'Settings',
    'settings.language': 'Language',
    'settings.appearance': 'Appearance',
    'settings.theme': 'Theme',
    'settings.light': 'Light',
    'settings.dark': 'Dark',
    'settings.system': 'System',
    'settings.editor': 'Editor',
    'settings.fontSize': 'Font Size',
    'settings.spellcheck': 'Spellcheck',
    'settings.showLineNumbers': 'Show Line Numbers',
    'settings.autoSave': 'Auto Save',
    'settings.autoSaveInterval': 'Auto Save Interval (seconds)',
    'settings.save': 'Save',
    'settings.cancel': 'Cancel',
    'settings.reset': 'Reset to Defaults',

    // Shortcuts dialog
    'shortcuts.title': 'Keyboard Shortcuts',
    'shortcuts.newTab': 'New Tab',
    'shortcuts.closeTab': 'Close Tab',
    'shortcuts.save': 'Save',
    'shortcuts.saveAs': 'Save As',
    'shortcuts.openFile': 'Open File',
    'shortcuts.openFolder': 'Open Folder',
    'shortcuts.undo': 'Undo',
    'shortcuts.redo': 'Redo',
    'shortcuts.find': 'Find & Replace',
    'shortcuts.toggleSidebar': 'Toggle Sidebar',
    'shortcuts.sourceMode': 'Source Mode',
    'shortcuts.focusMode': 'Focus Mode',
    'shortcuts.toggleTheme': 'Toggle Theme',
    'shortcuts.nextTab': 'Next Tab',
    'shortcuts.prevTab': 'Previous Tab',
    'shortcuts.fullscreen': 'Fullscreen',
    'shortcuts.devtools': 'DevTools',

    // About
    'about.title': 'InkDown',
    'about.description': 'The open-source WYSIWYG markdown editor.',
    'about.builtWith': 'Built with Electron, React, and Tiptap.',

    // Context menu
    'context.toggleSidebar': 'Toggle Sidebar',
    'context.toggleSourceMode': 'Toggle Source Mode',
  },
  ru: {
    // Menu bar
    'menu.file': 'Файл',
    'menu.edit': 'Правка',
    'menu.paragraph': 'Параграф',
    'menu.format': 'Формат',
    'menu.view': 'Вид',
    'menu.help': 'Справка',

    // File menu
    'file.newTab': 'Новая вкладка',
    'file.closeTab': 'Закрыть вкладку',
    'file.openFile': 'Открыть файл...',
    'file.openFolder': 'Открыть папку...',
    'file.recent': 'Недавние',
    'file.recentFiles': 'Недавние файлы',
    'file.recentFolders': 'Недавние папки',
    'file.noRecent': 'Нет недавних элементов',
    'file.clearRecent': 'Очистить историю',
    'file.save': 'Сохранить',
    'file.saveAs': 'Сохранить как...',
    'file.export': 'Экспорт',
    'file.exportHTML': 'HTML',
    'file.exportPDF': 'PDF',
    'file.preferences': 'Настройки',
    'file.closeWindow': 'Закрыть окно',

    // Edit menu
    'edit.undo': 'Отменить',
    'edit.redo': 'Повторить',
    'edit.cut': 'Вырезать',
    'edit.copy': 'Копировать',
    'edit.paste': 'Вставить',
    'edit.selectAll': 'Выделить всё',
    'edit.find': 'Найти и заменить',

    // Paragraph menu
    'paragraph.heading1': 'Заголовок 1',
    'paragraph.heading2': 'Заголовок 2',
    'paragraph.heading3': 'Заголовок 3',
    'paragraph.heading4': 'Заголовок 4',
    'paragraph.heading5': 'Заголовок 5',
    'paragraph.heading6': 'Заголовок 6',
    'paragraph.table': 'Таблица',
    'paragraph.codeBlock': 'Блок кода',
    'paragraph.quote': 'Цитата',
    'paragraph.orderedList': 'Нумерованный список',
    'paragraph.unorderedList': 'Маркированный список',
    'paragraph.taskList': 'Список задач',
    'paragraph.horizontalLine': 'Горизонтальная линия',

    // Format menu
    'format.bold': 'Полужирный',
    'format.italic': 'Курсив',
    'format.underline': 'Подчёркнутый',
    'format.code': 'Код',
    'format.strikethrough': 'Зачёркнутый',
    'format.highlight': 'Выделение',
    'format.hyperlink': 'Гиперссылка',
    'format.image': 'Изображение',
    'format.clearFormat': 'Убрать форматирование',

    // View menu
    'view.toggleSidebar': 'Показать/скрыть боковую панель',
    'view.sourceMode': 'Режим исходного кода',
    'view.focusMode': 'Режим фокусировки',
    'view.toggleDarkMode': 'Переключить тёмную тему',
    'view.zoomIn': 'Приблизить',
    'view.zoomOut': 'Отдалить',
    'view.actualSize': 'Исходный размер',
    'view.toggleFullscreen': 'Полноэкранный режим',

    // Help menu
    'help.checkUpdates': 'Проверить обновления...',
    'help.about': 'О приложении',
    'help.github': 'Репозиторий на GitHub',
    'help.shortcuts': 'Горячие клавиши',
    'help.devtools': 'Инструменты разработчика',

    // Toolbar
    'toolbar.bold': 'Полужирный (Ctrl+B)',
    'toolbar.italic': 'Курсив (Ctrl+I)',
    'toolbar.underline': 'Подчёркнутый (Ctrl+U)',
    'toolbar.strike': 'Зачёркнутый',
    'toolbar.highlight': 'Выделение',
    'toolbar.heading1': 'Заголовок 1',
    'toolbar.heading2': 'Заголовок 2',
    'toolbar.heading3': 'Заголовок 3',
    'toolbar.bulletList': 'Маркированный список',
    'toolbar.orderedList': 'Нумерованный список',
    'toolbar.taskList': 'Список задач',
    'toolbar.blockquote': 'Цитата',
    'toolbar.codeBlock': 'Блок кода',
    'toolbar.link': 'Ссылка',
    'toolbar.image': 'Изображение',
    'toolbar.table': 'Таблица',
    'toolbar.horizontalRule': 'Горизонтальная линия',
    'toolbar.fullWidth': 'Ширина',
    'toolbar.source': 'Код',

    // Sidebar
    'sidebar.explorer': 'Проводник',
    'sidebar.toc': 'Оглавление',
    'sidebar.noFolder': 'Папка не открыта',
    'sidebar.openFolder': 'Открыть папку',

    // Table of Contents
    'toc.title': 'Оглавление',
    'toc.noHeadings': 'Заголовки не найдены',

    // Status bar
    'statusbar.modified': 'Изменён',
    'statusbar.words': '{count} {count, plural, one {слово} few {слова} many {слов} other {слов}}',
    'statusbar.chars': '{count} {count, plural, one {символ} few {символа} many {символов} other {символов}}',
    'statusbar.lines': '{count} {count, plural, one {строка} few {строки} many {строк} other {строк}}',
    'statusbar.source': 'Код',
    'statusbar.wysiwyg': 'Визуально',

    // Find & Replace
    'find.placeholder': 'Найти...',
    'find.noResults': 'Ничего не найдено',
    'find.caseSensitive': 'С учётом регистра',
    'find.previous': 'Предыдущий (Shift+Enter)',
    'find.next': 'Следующий (Enter)',
    'find.toggleReplace': 'Замена',
    'find.close': 'Закрыть (Esc)',
    'find.replacePlaceholder': 'Заменить...',
    'find.replace': 'Заменить',
    'find.replaceAll': 'Все',

    // Editor
    'editor.placeholder': 'Начните писать на markdown...',

    // Settings
    'settings.title': 'Настройки',
    'settings.language': 'Язык',
    'settings.appearance': 'Внешний вид',
    'settings.theme': 'Тема',
    'settings.light': 'Светлая',
    'settings.dark': 'Тёмная',
    'settings.system': 'Системная',
    'settings.editor': 'Редактор',
    'settings.fontSize': 'Размер шрифта',
    'settings.spellcheck': 'Проверка орфографии',
    'settings.showLineNumbers': 'Показывать номера строк',
    'settings.autoSave': 'Автосохранение',
    'settings.autoSaveInterval': 'Интервал автосохранения (сек)',
    'settings.save': 'Сохранить',
    'settings.cancel': 'Отмена',
    'settings.reset': 'Сбросить по умолчанию',

    // Shortcuts dialog
    'shortcuts.title': 'Горячие клавиши',
    'shortcuts.newTab': 'Новая вкладка',
    'shortcuts.closeTab': 'Закрыть вкладку',
    'shortcuts.save': 'Сохранить',
    'shortcuts.saveAs': 'Сохранить как',
    'shortcuts.openFile': 'Открыть файл',
    'shortcuts.openFolder': 'Открыть папку',
    'shortcuts.undo': 'Отменить',
    'shortcuts.redo': 'Повторить',
    'shortcuts.find': 'Найти и заменить',
    'shortcuts.toggleSidebar': 'Боковая панель',
    'shortcuts.sourceMode': 'Режим кода',
    'shortcuts.focusMode': 'Режим фокусировки',
    'shortcuts.toggleTheme': 'Переключить тему',
    'shortcuts.nextTab': 'Следующая вкладка',
    'shortcuts.prevTab': 'Предыдущая вкладка',
    'shortcuts.fullscreen': 'Полноэкранный',
    'shortcuts.devtools': 'Инструменты разработчика',

    // About
    'about.title': 'InkDown',
    'about.description': 'Открытый WYSIWYG-редактор markdown.',
    'about.builtWith': 'Создано на Electron, React и Tiptap.',

    // Context menu
    'context.toggleSidebar': 'Боковая панель',
    'context.toggleSourceMode': 'Режим исходного кода',
  },
} as const

type TranslationKey = keyof typeof translations.en

export { translations, type TranslationKey }
export default translations
