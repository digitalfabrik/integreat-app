// @flow

import * as React from 'react'

import { LanguageModel } from '@integreat-app/integreat-api-client'
import { RefreshControl, ScrollView } from 'react-native'
import Failure from '../components/Failure'
import LanguageNotAvailableContainer from '../../common/containers/LanguageNotAvailableContainer'

export type PropsType<T> = {| routeInitialized: false |} |
  {| routeInitialized: true, error: true |} |
  {|
    routeInitialized: true, error: false, languageNotAvailable: true, availableLanguages: Array<LanguageModel>,
    changeUnavailableLanguage: (city: string, newLanguage: string) => void, cityCode: string
  |} |
  {| routeInitialized: true, error: false, languageNotAvailable: false, loading: true |} |
  {| routeInitialized: true, error: false, languageNotAvailable: false, loading: false, innerProps: T |}

const withError = <T: {}> (
  Component: React.AbstractComponent<T>,
  refresh: () => Promise<void>
): React.AbstractComponent<PropsType<T>> => {
  return class extends React.Component<PropsType<T>> {
    render () {
      const props = this.props
      if (!props.routeInitialized) {
        return null
      }
      if (props.error) {
        return <ScrollView refreshControl={<RefreshControl onRefresh={refresh} refreshing={false} />}
                           contentContainerStyle={{ flexGrow: 1 }}>
          <Failure />
        </ScrollView>
      } else if (props.languageNotAvailable) {
        return <LanguageNotAvailableContainer city={props.cityCode} languages={props.availableLanguages}
                                              changeLanguage={props.changeUnavailableLanguage} />
      } else if (props.loading) {
        return <ScrollView refreshControl={<RefreshControl onRefresh={refresh} refreshing />}
                           contentContainerStyle={{ flexGrow: 1 }} />
      } else {
        return <ScrollView refreshControl={<RefreshControl onRefresh={refresh} refreshing={false} />}
                           contentContainerStyle={{ flexGrow: 1 }}>
          <Component {...props.innerProps} />
        </ScrollView>
      }
    }
  }
}

export default withError
