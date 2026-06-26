import { useState, useEffect, useCallback, useRef } from 'react'
import './Settings.css'

type Language = 'en' | 'ru'

interface SettingsData {
  language: Language
  theme: 'light' | 'dark' | 'system'
  fontSize: number
  spellcheck: boolean
  showLineNumbers: boolean
  autoSave: boolean
  autoSaveInterval: number
}

function getSystemLanguage(): Language {
  const lang = navigator.language || navigator.languages?.[0] || 'en'
  return lang.startsWith('ru') ? 'ru' : 'en'
}

interface SettingsProps {
  isOpen: boolean
  onClose: () => void
  settings: SettingsData
  onSave: (settings: SettingsData) => void
}

const DEFAULT_SETTINGS: SettingsData = {
  language: getSystemLanguage(),
  theme: 'system',
  fontSize: 16,
  spellcheck: true,
  showLineNumbers: false,
  autoSave: true,
  autoSaveInterval: 30,
}

const LABELS: Record<Language, Record<string, string>> = {
  en: {
    settings: 'Settings',
    language: 'Language',
    appearance: 'Appearance',
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
    editor: 'Editor',
    fontSize: 'Font Size',
    spellcheck: 'Spellcheck',
    showLineNumbers: 'Show Line Numbers',
    autoSave: 'Auto Save',
    autoSaveInterval: 'Auto Save Interval (seconds)',
    save: 'Save',
    cancel: 'Cancel',
    reset: 'Reset to Defaults',
  },
  ru: {
    settings: 'Настройки',
    language: 'Язык',
    appearance: 'Внешний вид',
    theme: 'Тема',
    light: 'Светлая',
    dark: 'Тёмная',
    system: 'Системная',
    editor: 'Редактор',
    fontSize: 'Размер шрифта',
    spellcheck: 'Проверка орфографии',
    showLineNumbers: 'Показывать номера строк',
    autoSave: 'Автосохранение',
    autoSaveInterval: 'Интервал автосохранения (сек)',
    save: 'Сохранить',
    cancel: 'Отмена',
    reset: 'Сбросить по умолчанию',
  },
}

function Settings({ isOpen, onClose, settings: initialSettings, onSave }: SettingsProps) {
  const [settings, setSettings] = useState<SettingsData>(initialSettings)
  const [activeTab, setActiveTab] = useState<'general' | 'editor'>('general')
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      setSettings(initialSettings)
    }
  }, [isOpen, initialSettings])

  const t = useCallback(
    (key: string) => LABELS[settings.language]?.[key] ?? LABELS.en[key] ?? key,
    [settings.language]
  )

  const update = useCallback(<K extends keyof SettingsData>(key: K, value: SettingsData[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }, [])

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === overlayRef.current) onClose()
    },
    [onClose]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  const handleSave = useCallback(() => {
    onSave(settings)
    onClose()
  }, [settings, onSave, onClose])

  const handleReset = useCallback(() => {
    setSettings(DEFAULT_SETTINGS)
  }, [])

  if (!isOpen) return null

  return (
    <div className="settings-overlay" ref={overlayRef} onClick={handleOverlayClick} onKeyDown={handleKeyDown}>
      <div className="settings-dialog">
        <div className="settings-header">
          <h2 className="settings-title">{t('settings')}</h2>
          <button className="settings-close" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="settings-tabs">
          <button
            className={`settings-tab ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            {t('appearance')}
          </button>
          <button
            className={`settings-tab ${activeTab === 'editor' ? 'active' : ''}`}
            onClick={() => setActiveTab('editor')}
          >
            {t('editor')}
          </button>
        </div>

        <div className="settings-body">
          {activeTab === 'general' && (
            <div className="settings-section">
              <div className="settings-group">
                <label className="settings-label">{t('language')}</label>
                <select
                  className="settings-select"
                  value={settings.language}
                  onChange={(e) => update('language', e.target.value as Language)}
                >
                  <option value="en">English</option>
                  <option value="ru">Русский</option>
                </select>
              </div>

              <div className="settings-group">
                <label className="settings-label">{t('theme')}</label>
                <div className="settings-radio-group">
                  <label className="settings-radio">
                    <input
                      type="radio"
                      name="theme"
                      value="light"
                      checked={settings.theme === 'light'}
                      onChange={() => update('theme', 'light')}
                    />
                    <span>{t('light')}</span>
                  </label>
                  <label className="settings-radio">
                    <input
                      type="radio"
                      name="theme"
                      value="dark"
                      checked={settings.theme === 'dark'}
                      onChange={() => update('theme', 'dark')}
                    />
                    <span>{t('dark')}</span>
                  </label>
                  <label className="settings-radio">
                    <input
                      type="radio"
                      name="theme"
                      value="system"
                      checked={settings.theme === 'system'}
                      onChange={() => update('theme', 'system')}
                    />
                    <span>{t('system')}</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'editor' && (
            <div className="settings-section">
              <div className="settings-group">
                <label className="settings-label">{t('fontSize')}</label>
                <div className="settings-range">
                  <input
                    type="range"
                    min="12"
                    max="24"
                    value={settings.fontSize}
                    onChange={(e) => update('fontSize', Number(e.target.value))}
                  />
                  <span className="settings-range-value">{settings.fontSize}px</span>
                </div>
              </div>

              <div className="settings-group">
                <label className="settings-toggle">
                  <input
                    type="checkbox"
                    checked={settings.spellcheck}
                    onChange={(e) => update('spellcheck', e.target.checked)}
                  />
                  <span className="settings-toggle-slider" />
                  <span>{t('spellcheck')}</span>
                </label>
              </div>

              <div className="settings-group">
                <label className="settings-toggle">
                  <input
                    type="checkbox"
                    checked={settings.showLineNumbers}
                    onChange={(e) => update('showLineNumbers', e.target.checked)}
                  />
                  <span className="settings-toggle-slider" />
                  <span>{t('showLineNumbers')}</span>
                </label>
              </div>

              <div className="settings-group">
                <label className="settings-toggle">
                  <input
                    type="checkbox"
                    checked={settings.autoSave}
                    onChange={(e) => update('autoSave', e.target.checked)}
                  />
                  <span className="settings-toggle-slider" />
                  <span>{t('autoSave')}</span>
                </label>
              </div>

              {settings.autoSave && (
                <div className="settings-group">
                  <label className="settings-label">{t('autoSaveInterval')}</label>
                  <input
                    type="number"
                    className="settings-input"
                    min="5"
                    max="300"
                    value={settings.autoSaveInterval}
                    onChange={(e) => update('autoSaveInterval', Number(e.target.value))}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="settings-footer">
          <button className="settings-btn settings-btn-reset" onClick={handleReset}>
            {t('reset')}
          </button>
          <div className="settings-footer-right">
            <button className="settings-btn settings-btn-cancel" onClick={onClose}>
              {t('cancel')}
            </button>
            <button className="settings-btn settings-btn-save" onClick={handleSave}>
              {t('save')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
export { DEFAULT_SETTINGS }
export type { SettingsData }
