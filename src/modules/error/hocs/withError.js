// @flow

import * as React from 'react'
import { LanguageModel } from '@integreat-app/integreat-api-client'
import LanguageNotAvailableContainer from '../../common/containers/LanguageNotAvailableContainer'
import Failure from '../components/Failure'

export type PropsType = {|
  error: boolean,
  languageNotAvailable: boolean,
  availableLanguages?: Array<LanguageModel>,
  currentLanguage?: string,
  currentCityCode?: string,
  changeUnavailableLanguage?: (params: {| city: string, newLanguage: string, oldLanguage: string |}) => void
|}

const withError = <T: {}>(
  Component: React.AbstractComponent<T>
): React.AbstractComponent<T & PropsType> => {
  return class extends React.Component<T & PropsType> {
    render () {
      const { error, languageNotAvailable, currentLanguage, currentCityCode,
        availableLanguages, changeUnavailableLanguage, ...props } = this.props

      if (languageNotAvailable && currentCityCode && availableLanguages && changeUnavailableLanguage) {
        return <LanguageNotAvailableContainer city={currentCityCode}
                                              languages={availableLanguages}
                                              changeLanguage={changeUnavailableLanguage}
                                              currentLanguage={currentLanguage} />
      }

      if (error) {
        return <Failure />
      }

      return <Component {...props} />
    }
  }
}

export default withError
