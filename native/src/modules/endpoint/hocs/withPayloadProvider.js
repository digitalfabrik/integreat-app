// @flow

import * as React from 'react'
import { LanguageModel } from '@integreat-app/integreat-api-client'
import { RefreshControl, ScrollView, View } from 'react-native'
import LanguageNotAvailableContainer from '../../common/containers/LanguageNotAvailableContainer'
import type { StoreActionType } from '../../app/StoreActionType'
import { type Dispatch } from 'redux'
import { wrapDisplayName } from 'recompose'
import FailureContainer from '../../error/containers/FailureContainer'
import { LOADING_TIMEOUT } from '../../common/constants'
import type { ErrorCodeType } from '../../error/ErrorCodes'

export type RouteNotInitializedType = {| status: 'routeNotInitialized' |}
export type LoadingType = {| status: 'loading' |}
export type ErrorType<R: {}> = {|
  status: 'error',
  message: ?string,
  code: ErrorCodeType,
  refreshProps: R | null
|}

export type LanguageNotAvailableType = {|
  status: 'languageNotAvailable',
  availableLanguages: Array<LanguageModel>,
  cityCode: string,
  changeUnavailableLanguage: (dispatch: Dispatch<StoreActionType>, newLanguage: string) => void
|}

export type SuccessType<S: {}, R: {}> = {|
  status: 'success',
  innerProps: S,
  refreshProps: R
|}

export type StatusPropsType<S: {}, R: {}> =
  RouteNotInitializedType
  | LoadingType
  | ErrorType<R>
  | LanguageNotAvailableType
  | SuccessType<$Diff<S, { dispatch: Dispatch<StoreActionType> }>, R>

export type PropsType<S: { dispatch: Dispatch<StoreActionType> }, R: {}> = {|
  ...StatusPropsType<S, R>,
  dispatch: Dispatch<StoreActionType>
|}

const withPayloadProvider = <S: { dispatch: Dispatch<StoreActionType> }, R: {}> (
  refresh: (refreshProps: R, dispatch: Dispatch<StoreActionType>) => void,
  noScrollView?: boolean
): ((Component: React.ComponentType<S>) => React.ComponentType<PropsType<S, R>>) => {
  return (Component: React.ComponentType<S>): React.ComponentType<PropsType<S, R>> => {
    return class extends React.Component<PropsType<S, R>, {| timeoutExpired: boolean |}> {
      static displayName = wrapDisplayName(Component, 'withPayloadProvider')

      state = { timeoutExpired: false }

      componentDidMount () {
        setTimeout(() => this.setState({ timeoutExpired: true }), LOADING_TIMEOUT)
      }

      refresh = () => {
        const props = this.props
        if (props.status === 'routeNotInitialized' || props.status === 'loading' ||
          props.status === 'languageNotAvailable') {
          throw Error('Refreshing is not possible because the route is not yet initialized or already loading.')
        }
        if (props.refreshProps) {
          refresh(props.refreshProps, props.dispatch)
        }
      }

      changeUnavailableLanguage = (newLanguage: string) => {
        if (this.props.status !== 'languageNotAvailable') {
          throw Error('Call of changeUnavailableLanguage is only possible when language is not available.')
        }
        this.props.changeUnavailableLanguage(this.props.dispatch, newLanguage)
      }

      render () {
        const props = this.props
        if (props.status === 'routeNotInitialized') {
          return null
        } else if (props.status === 'error') {
          return <ScrollView refreshControl={<RefreshControl onRefresh={this.refresh} refreshing={false} />}
                             contentContainerStyle={{ flexGrow: 1 }}>
            <FailureContainer tryAgain={this.refresh} message={props.message} code={props.code} />
          </ScrollView>
        } else if (props.status === 'languageNotAvailable') {
          return <LanguageNotAvailableContainer languages={props.availableLanguages}
                                                changeLanguage={this.changeUnavailableLanguage} />
        } else if (props.status === 'loading') {
          return this.state.timeoutExpired
            ? <ScrollView refreshControl={<RefreshControl refreshing />} contentContainerStyle={{ flexGrow: 0 }} />
            : null
        } else { // props.status === 'success'
          if (noScrollView) {
            return <View style={{ flex: 1 }}>
              <Component {...props.innerProps} dispatch={props.dispatch} />
            </View>
          }
          return <ScrollView keyboardShouldPersistTaps='always'
                             refreshControl={<RefreshControl onRefresh={this.refresh} refreshing={false} />}
                             contentContainerStyle={{ flexGrow: 1 }}>
            <Component {...props.innerProps} dispatch={props.dispatch} />
          </ScrollView>
        }
      }
    }
  }
}

export default withPayloadProvider
