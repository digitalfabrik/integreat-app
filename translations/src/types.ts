export type KeyValueType = { [key: string]: string | KeyValueType }
type NamespaceType = { [namespace: string]: KeyValueType }
export type TranslationsType = { [language: string]: string | NamespaceType }
