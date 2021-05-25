import * as React from 'react'
import i18next from 'i18next'
import wrapDisplayName from '../modules/common/utils/wrapDisplayName'

// this mock makes sure any components using the translate HoC receive the t function as a prop
const withTranslation = namespace => Component => {
  const i18n = i18next.createInstance()
  const Translated = props => <Component t={key => `${namespace}:${key}`} i18n={i18n} {...props} />
  Translated.displayName = wrapDisplayName(Component, 'Translate')
  return Translated
}

const I18nextProvider = ({ children }) => children
I18nextProvider.displayName = 'I18nextProvider'

export { I18nextProvider, withTranslation }
