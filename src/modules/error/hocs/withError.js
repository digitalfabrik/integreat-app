// @flow

import * as React from 'react'
import { LanguageModel } from '@integreat-app/integreat-api-client'
import LanguageNotAvailableContainer from '../../common/containers/LanguageNotAvailableContainer'
import Failure from '../components/Failure'

export type PropsType = {|
  error: boolean,
  languageNotAvailable: boolean,
  changeUnavailableLanguage: (city: string, newLanguage: string) => void
|}

const withError = <T: {cityCode?: string, languages?: Array<LanguageModel>}>(
  Component: React.AbstractComponent<T>
): React.AbstractComponent<T & PropsType> => {
  return class extends React.Component<T & PropsType> {
    render () {
      const {
        error, languageNotAvailable, cityCode, languages, changeUnavailableLanguage, ...props
      } = this.props

      if (languageNotAvailable && cityCode && languages) {
        return <LanguageNotAvailableContainer city={cityCode}
                                              languages={languages}
                                              changeLanguage={changeUnavailableLanguage} />
      }

      if (error) {
        return <Failure />
      }

      return <Component cityCode={cityCode} languages={languages} {...props} />
    }
  }
}

export default withError
