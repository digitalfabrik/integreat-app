// @flow

import * as React from 'react'
import { useEffect, useState } from 'react'
import { LanguageModel } from 'api-client'
import { RefreshControl, ScrollView, View } from 'react-native'
import LanguageNotAvailableContainer from '../../common/containers/LanguageNotAvailableContainer'
import type { StoreActionType } from '../../app/StoreActionType'
import { type Dispatch } from 'redux'
import FailureContainer from '../../error/containers/FailureContainer'
import { LOADING_TIMEOUT } from '../../common/constants'
import type { ErrorCodeType } from '../../error/ErrorCodes'
import wrapDisplayName from '../../common/hocs/wrapDisplayName'
import type { NavigationPropType, RoutePropType, RoutesType } from '../../app/components/NavigationTypes'
import { type TFunction } from 'react-i18next'

export type RouteNotInitializedType = {| status: 'routeNotInitialized' |}
export type LoadingType<S: {}, R: {}> = {|
  status: 'loading',
  progress: number,
  innerProps?: S,
  refreshProps?: R
|}
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
  | LoadingType<$Diff<S, { dispatch: Dispatch<StoreActionType> }>, R>
  | ErrorType<R>
  | LanguageNotAvailableType
  | SuccessType<$Diff<S, { dispatch: Dispatch<StoreActionType> }>, R>

export type PropsType<S: { dispatch: Dispatch<StoreActionType> }, R: {}, T: RoutesType> = {|
  ...StatusPropsType<S, R>,
  dispatch: Dispatch<StoreActionType>,
  navigation: NavigationPropType<T>,
  route: RoutePropType<T>,
  t?: TFunction
|}

const withPayloadProvider = <S: { dispatch: Dispatch<StoreActionType> }, R: {}, T: RoutesType> (
  refresh: (refreshProps: R, dispatch: Dispatch<StoreActionType>) => void,
  noScrollView?: boolean
): ((Component: React.ComponentType<S>) => React.ComponentType<PropsType<S, R, T>>) => {
  return (Component: React.ComponentType<S>): React.ComponentType<PropsType<S, R, T>> => {
    const Wrapper = (props: PropsType<S, R, T>) => {
      const [timeoutExpired, setTimeoutExpired] = useState(false)

      useEffect(() => {
        const timer = setTimeout(() => {
          setTimeoutExpired(true)
        }, LOADING_TIMEOUT)
        return () => clearTimeout(timer)
      }, [])

      function refreshIfPossible () {
        if (props.status === 'routeNotInitialized' || props.status === 'loading' ||
          props.status === 'languageNotAvailable') {
          throw Error('Refreshing is not possible because the route is not yet initialized or already loading.')
        }
        if (props.refreshProps) {
          refresh(props.refreshProps, props.dispatch)
        }
      }

      function changeUnavailableLanguage (newLanguage: string) {
        if (props.status !== 'languageNotAvailable') {
          throw Error('Call of changeUnavailableLanguage is only possible when language is not available.')
        }
        props.changeUnavailableLanguage(props.dispatch, newLanguage)
      }

      if (props.status === 'routeNotInitialized') {
        return null
      } else if (props.status === 'error') {
        return <ScrollView refreshControl={<RefreshControl onRefresh={refreshIfPossible} refreshing={false} />}
                           contentContainerStyle={{ flexGrow: 1 }}>
          <FailureContainer tryAgain={refreshIfPossible} message={props.message} code={props.code} />
        </ScrollView>
      } else if (props.status === 'languageNotAvailable') {
        return <LanguageNotAvailableContainer languages={props.availableLanguages}
                                              changeLanguage={changeUnavailableLanguage} />
      } else if (props.status === 'loading') {
        console.log('render loading', props.progress)
        return timeoutExpired
          ? <ScrollView refreshControl={<RefreshControl refreshing />} contentContainerStyle={{ flexGrow: 1 }}
                      keyboardShouldPersistTaps='always'>
          {/* only display content while loading if innerProps and dispatch are available */}
          {props.innerProps && props.dispatch
            ? <Component {...props.innerProps} dispatch={props.dispatch} />
            : null}
        </ScrollView>
          : null
      } else { // props.status === 'success'
        if (noScrollView) {
          return <View style={{ flex: 1 }}>
            <Component {...props.innerProps} dispatch={props.dispatch} />
          </View>
        }
        return <ScrollView keyboardShouldPersistTaps='always'
                           refreshControl={<RefreshControl onRefresh={refreshIfPossible} refreshing={false} />}
                           contentContainerStyle={{ flexGrow: 1 }}>
          <Component {...props.innerProps} dispatch={props.dispatch} />
        </ScrollView>
      }
    }
    Wrapper.displayName = wrapDisplayName(Component, 'withPayloadProvider')
    return Wrapper
  }
}

export default withPayloadProvider
