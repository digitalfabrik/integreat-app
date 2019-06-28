// @flow

import * as React from 'react'
import { LanguageModel } from '@integreat-app/integreat-api-client'
import LanguageNotAvailableContainer from '../../common/containers/LanguageNotAvailableContainer'
import Failure from '../components/Failure'

export type PropsType = {|
  error: boolean,
  languageNotAvailable: boolean,
  availableLanguages?: Array<LanguageModel>,
  currentCityCode?: string,
  changeUnavailableLanguage?: (city: string, newLanguage: string) => void
|}

const withError = <T: {}>(
  Component: React.AbstractComponent<T>
): React.AbstractComponent<T & PropsType> => {
  return class extends React.Component<T & PropsType> {
    render () {
      const {
        error, languageNotAvailable, currentCityCode, availableLanguages, changeUnavailableLanguage, ...props
      } = this.props

      if (languageNotAvailable && currentCityCode && availableLanguages && changeUnavailableLanguage) {
        return <LanguageNotAvailableContainer city={currentCityCode}
                                              languages={availableLanguages}
                                              changeLanguage={changeUnavailableLanguage} />
      }

      if (error) {
        return <Failure />
      }

      return <Component {...props} />
    }
  }
}

export default withError
