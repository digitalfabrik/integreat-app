import i18next, { i18n, TFunction } from 'i18next'
import { ReactNode } from 'react'

const useTranslation = (
  namespace: string
): {
  t: TFunction
  i18n: i18n
  ready: boolean
} => {
  const i18n = i18next.createInstance()

  return { t: (key: string) => `${namespace}:${key}`, i18n, ready: true }
}

const I18nextProvider = ({ children }: { children: ReactNode }): ReactNode => children

I18nextProvider.displayName = 'I18nextProvider'
export { I18nextProvider, useTranslation }
