// @flow

type KeyValueType = { [key: string]: string | KeyValueType }

type NamespaceType = {
  [language: string]: KeyValueType
}

export type TranslationsType = { [namespace: string]: NamespaceType }

export type TransformedTranslationsType = { [language: string]: { [namespace: string]: { [key: string]: string } } }
