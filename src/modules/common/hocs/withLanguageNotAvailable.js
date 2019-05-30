// @flow

import * as React from 'react'
import { LanguageModel } from '@integreat-app/integreat-api-client'
import LanguageNotAvailableContainer from '../containers/LanguageNotAvailableContainer'

export type LanguageNotAvailableType = {|
  languageNotAvailable: boolean,
  city: string,
  languages: Array<LanguageModel>,
  changeUnavailableLanguage: (city: string, newLanguage: string) => void
|}

type PropsType<T> = LanguageNotAvailableType | T

function withLanguageNotAvailable<Props: PropsType<*>> (
  Component: React.ComponentType<Props>): React.ComponentType<*> {
  class LanguageNotAvailableComponent extends React.PureComponent<Props> {
    render () {
      const {languageNotAvailable, city, languages, changeUnavailableLanguage, ...props} = this.props

      if (languageNotAvailable) {
        return <LanguageNotAvailableContainer city={city}
                                              languages={languages}
                                              changeLanguage={changeUnavailableLanguage} />
      }

      return <Component {...props} />
    }
  }

  return LanguageNotAvailableComponent
}

export default withLanguageNotAvailable
