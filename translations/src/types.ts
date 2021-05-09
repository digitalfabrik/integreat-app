type KeyValueType = Record<string, string | KeyValueType>
type NamespaceType = Record<string, KeyValueType>
export type TranslationsType = Record<string, NamespaceType>
export type TransformedTranslationsType = Record<string, Record<string, Record<string, string>>>