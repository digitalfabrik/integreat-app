import React from 'react'

// this mock makes sure any components using the translate HoC receive the t function as a prop
export const translate = namespace => Component => {
  const Translated = props => <Component t={key => `${namespace}:${key}`} {...props} />
  Translated.displayName = `Translate(${Component.displayName || Component.name})`
  return Translated
}

export const I18nextProvider = ({children}) => children
