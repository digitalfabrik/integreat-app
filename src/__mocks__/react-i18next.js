// @flow

import * as React from 'react'

// this mock makes sure any components using the translate HoC receive the t function as a prop
export const translate = <Props> (namespace: string) => (Component: React.ComponentType<Props>) => {
  const Translated = (props: Props) => <Component t={key => `${namespace}:${key}`} {...props} />
  Translated.displayName = `Translate(${Component.displayName || Component.name})`
  return Translated
}

export const I18nextProvider = ({children}: { children: React.Node }) => children
