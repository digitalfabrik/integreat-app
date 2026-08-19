type KeyValueType = { [key: string]: string | KeyValueType }
type LanguageTranslationsType = { [namespace: string]: KeyValueType }
export type TranslationsType = { [language: string]: LanguageTranslationsType }
