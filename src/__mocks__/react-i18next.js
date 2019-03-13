// @flow

import * as React from 'react'
import i18next from 'i18next'

// this mock makes sure any components using the translate HoC receive the t function as a prop
export const withTranslation = <Props> (namespace: string) => (Component: React.ComponentType<Props>) => {
  const Translated = (props: Props) => <Component t={key => `${namespace}:${key}`} {...props} />
  Translated.displayName = `Translate(${Component.displayName || Component.name})`
  return Translated
}

export const I18nextProvider = ({ children }: { children: React.Node }) => children

export const withI18n = <P>() => {
  const i18n = i18next.createInstance()
  return (Component: React.ComponentType<P>) => (props: P) => <Component i18n={i18n} {...props} />
}
