// @flow

import * as React from 'react'

import { LanguageModel } from '@integreat-app/integreat-api-client'
import { RefreshControl, ScrollView } from 'react-native'
import Failure from '../components/Failure'
import LanguageNotAvailableContainer from '../../common/containers/LanguageNotAvailableContainer'
import type { StoreActionType } from '../../app/StoreActionType'
import { type Dispatch } from 'redux'
import type { NavigationScreenProp } from 'react-navigation'

export type RouteNotInitializedType = {| status: 'routeNotInitialized' |}
export type LoadingType = {| status: 'loading' |}
export type ErrorType<R> = {|
  status: 'error',
  refreshProps: R
|}
export type LanguageNotAvailableType<R> = {|
  status: 'languageNotAvailable',
  availableLanguages: Array<LanguageModel>,
  cityCode: string,
  refreshProps: R,
  changeUnavailableLanguage: (dispatch: Dispatch<StoreActionType>, navigation: NavigationScreenProp<*>, city: string, newLanguage: string) => void
|}

export type SuccessType<S, R> = {|
  status: 'success',
  innerProps: S,
  refreshProps: R
|}

export type StatusPropsType<S, R> =
  RouteNotInitializedType
  | LoadingType
  | ErrorType<R>
  | LanguageNotAvailableType<R>
  | SuccessType<$Diff<S, { dispatch: Dispatch<StoreActionType> }>, R>

export type PropsType<S: { dispatch: Dispatch<StoreActionType> }, R> = {|
  ...StatusPropsType<S, R>,
  dispatch: Dispatch<StoreActionType>
|}

const withError = <S: { dispatch: Dispatch<StoreActionType> }, R> (
  refresh: (refreshProps: R, dispatch: Dispatch<StoreActionType>) => void
): ((Component: React.AbstractComponent<S>) => React.AbstractComponent<PropsType<S, R>>) => {
  return (Component: React.AbstractComponent<S>): React.AbstractComponent<PropsType<S, R>> => {
    return class extends React.Component<PropsType<S, R>> {
      refresh = () => {
        const props = this.props
        if (props.status === 'routeNotInitialized' || props.status === 'loading') {
          throw Error('Refreshing is not possible because the route is not yet initialized or already loading.')
        }
        refresh(props.refreshProps, props.dispatch)
      }

      render () {
        const props = this.props
        console.warn(props)
        if (props.status === 'routeNotInitialized') {
          return null
        } else if (props.status === 'error') {
          return <ScrollView refreshControl={<RefreshControl onRefresh={this.refresh} refreshing={false} />}
                             contentContainerStyle={{ flexGrow: 1 }}>
            <Failure />
          </ScrollView>
        } else if (props.status === 'languageNotAvailable') {
          return <LanguageNotAvailableContainer city={props.cityCode} languages={props.availableLanguages}
                                                changeLanguage={props.changeUnavailableLanguage} />
        } else if (props.status === 'loading') {
          return <ScrollView refreshControl={<RefreshControl refreshing />} contentContainerStyle={{ flexGrow: 1 }} />
        } else { // props.status === 'success'
          return <ScrollView refreshControl={<RefreshControl onRefresh={this.refresh} refreshing={false} />}
                             contentContainerStyle={{ flexGrow: 1 }}>
            <Component {...props.innerProps} dispatch={props.dispatch} />
          </ScrollView>
        }
      }
    }
  }
}

export default withError
