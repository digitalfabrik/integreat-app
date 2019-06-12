// @flow

import * as React from 'react'
import { LanguageModel } from '@integreat-app/integreat-api-client'
import LanguageNotAvailableContainer from '../../common/containers/LanguageNotAvailableContainer'
import Failure from '../components/Failure'

export type ErrorType = {|
  error: boolean,
  languageNotAvailable: boolean,
  city: string,
  languages: Array<LanguageModel>,
  changeUnavailableLanguage: (city: string, newLanguage: string) => void
|}

const withLanguageNotAvailable = <T: {}>(
  Component: React.AbstractComponent<T>
): React.AbstractComponent<T & ErrorType> => {
  return class extends React.PureComponent<T & ErrorType> {
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
}

export default withLanguageNotAvailable
