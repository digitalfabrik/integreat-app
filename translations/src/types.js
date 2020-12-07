// @flow

export type TranslationsType = { [namespace: string]: { [language: string]: { [key: string]: string } } }

export type TransformedTranslationsType = { [language: string]: { [namespace: string]: { [key: string]: string } } }
