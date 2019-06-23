// @flow

import * as React from 'react'
import { LanguageModel } from '@integreat-app/integreat-api-client'
import LanguageNotAvailableContainer from '../../common/containers/LanguageNotAvailableContainer'
import Failure from '../components/Failure'
import type { StoreActionType } from '../../app/StoreActionType'

export type PropsType = {|
  error: boolean,
  languageNotAvailable: boolean,
  cityCode?: string,
  languages?: Array<LanguageModel>,
  changeUnavailableLanguage: (city: string, newLanguage: string) => StoreActionType
|}

const withError = <T: {}>(
  Component: React.AbstractComponent<T>
): React.AbstractComponent<{...T, ...PropsType}> => {
  return class extends React.Component<{...T, ...PropsType}> {
    render () {
      const { error, languageNotAvailable, cityCode, languages, changeUnavailableLanguage, ...props } = this.props
      if (languageNotAvailable) {
        return <LanguageNotAvailableContainer city={cityCode}
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

export default withError
