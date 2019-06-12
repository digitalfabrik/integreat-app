// @flow

import * as React from 'react'
import { LanguageModel } from '@integreat-app/integreat-api-client'
import LanguageNotAvailableContainer from '../../common/containers/LanguageNotAvailableContainer'
import Failure from '../components/Failure'

export type ErrorType = {|
  error: true,
  languageNotAvailable: false,
  city: string,
  languages: Array<LanguageModel>,
  changeUnavailableLanguage: (city: string, newLanguage: string) => void
|}

type PropsType<T> = ErrorType | T

function withLanguageNotAvailable<Props: PropsType<*>> (
  Component: React.ComponentType<Props>): React.ComponentType<*> {
  class LanguageNotAvailableComponent extends React.PureComponent<Props> {
    render () {
      const {error, languageNotAvailable, city, languages, changeUnavailableLanguage, ...props} = this.props

      if (languageNotAvailable) {
        return <LanguageNotAvailableContainer city={city}
                                              languages={languages}
                                              changeLanguage={changeUnavailableLanguage} />
      }

      if (error) {
        return <Failure />
      }

      return <Component {...props} />
    }
  }

  return LanguageNotAvailableComponent
}

export default withLanguageNotAvailable
