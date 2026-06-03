import i18next, { i18n, TFunction } from 'i18next'
import React, { ReactElement, ReactNode } from 'react'

const useTranslation = (
  namespace: string,
): {
  t: TFunction
  i18n: i18n
  ready: boolean
} => {
  const i18n = i18next.createInstance()

  return { t: ((key: string) => `${namespace}:${key}`) as TFunction, i18n, ready: true }
}

const I18nextProvider = ({ children }: { children: ReactNode }): ReactNode => children

I18nextProvider.displayName = 'I18nextProvider'

const Trans = ({ children, i18nKey }: { children?: ReactNode; i18nKey?: string }): ReactElement =>
  React.createElement(React.Fragment, null, children ?? i18nKey)

export { I18nextProvider, Trans, useTranslation }
