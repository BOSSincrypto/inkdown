import { useCallback, useMemo } from 'react'
import translations, { type TranslationKey } from './translations'

type Language = 'en' | 'ru'

function plural(count: number, forms: string[]): string {
  const abs = Math.abs(count)
  const mod10 = abs % 10
  const mod100 = abs % 100

  if (mod100 >= 11 && mod100 <= 19) return forms[2] || forms[0]
  if (mod10 === 1) return forms[0]
  if (mod10 >= 2 && mod10 <= 4) return forms[1] || forms[0]
  return forms[2] || forms[0]
}

function processPluralPatterns(text: string, param: string, value: number): string {
  const prefix = `{${param}, plural, `
  let result = text
  let searchStart = 0
  let idx = result.indexOf(prefix, searchStart)

  while (idx !== -1) {
    // Находим закрывающую скобку, учитывая вложенность
    let depth = 1
    let i = idx + prefix.length
    while (i < result.length && depth > 0) {
      if (result[i] === '{') depth++
      else if (result[i] === '}') depth--
      i++
    }

    if (depth !== 0) break

    // Извлекаем формы из содержимого: "one {слово} few {слова} many {слов} other {слов}"
    const formsContent = result.substring(idx + prefix.length, i - 1)
    const extractedForms: string[] = []
    const formRegex = /\{([^}]+)\}/g
    let m
    while ((m = formRegex.exec(formsContent)) !== null) {
      extractedForms.push(m[1])
    }

    const replacement = extractedForms.length > 0 ? plural(value, extractedForms) : String(value)
    result = result.substring(0, idx) + replacement + result.substring(i)
    searchStart = idx + replacement.length
    idx = result.indexOf(prefix, searchStart)
  }

  return result
}

function useTranslation(lang: Language) {
  const t = useCallback(
    (key: TranslationKey, params?: Record<string, number | string>): string => {
      let text = (translations[lang]?.[key] as string) || (translations.en[key] as string) || key

      if (params) {
        for (const [param, value] of Object.entries(params)) {
          const paramPattern = new RegExp(`\\{${param}\\}`, 'g')
          text = text.replace(paramPattern, String(value))

          if (typeof value === 'number') {
            text = processPluralPatterns(text, param, value)
          }
        }
      }

      return text
    },
    [lang]
  )

  return useMemo(() => ({ t, lang }), [t, lang])
}

export { useTranslation }
export type { Language }
