import React, { ComponentType, ReactNode } from 'react'
import i18next, { i18n, TFunction } from 'i18next'
import wrapDisplayName from '../services/wrapDisplayName'

// this mock makes sure any components using the translate HoC receive the t function as a prop
const withTranslation = (namespace: string) => (Component: ComponentType): ComponentType => {
  const i18n = i18next.createInstance()

  const Translated = props => <Component t={key => `${namespace}:${key}`} i18n={i18n} {...props} />

  Translated.displayName = wrapDisplayName(Component, 'Translate')
  return Translated
}

const useTranslation = (
  namespace: string
): {
  t: TFunction
  i18n: i18n
  ready: boolean
} => {
  const i18n = i18next.createInstance()

  return { t: key => `${namespace}:${key}`, i18n, ready: true }
}

const I18nextProvider = ({ children }: { children: ReactNode }): ReactNode => children

I18nextProvider.displayName = 'I18nextProvider'
export { I18nextProvider, withTranslation, useTranslation }
