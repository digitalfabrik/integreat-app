/* eslint-disable react/destructuring-assignment */
import * as React from 'react'
import { useEffect, useState } from 'react'
import { RefreshControl } from 'react-native'
import { Dispatch } from 'redux'

import { ErrorCode, LanguageModel } from 'api-client'

import Failure from '../components/Failure'
import LanguageNotAvailablePage from '../components/LanguageNotAvailablePage'
import Layout from '../components/Layout'
import LayoutedScrollView from '../components/LayoutedScrollView'
import ProgressSpinner from '../components/ProgressSpinner'
import { NavigationPropType, RoutePropType, RoutesType } from '../constants/NavigationTypes'
import wrapDisplayName from '../hocs/wrapDisplayName'
import useClearRouteOnClose from '../hooks/useClearRouteOnClose'
import { StoreActionType } from '../redux/StoreActionType'

// A waiting time of >=1s feels like an interruption
export const LOADING_TIMEOUT = 800

export type RouteNotInitializedType = {
  status: 'routeNotInitialized'
}
export type LoadingType<S extends Record<string, unknown>, R extends Record<string, unknown>> = {
  status: 'loading'
  progress: number
  innerProps?: S
  refreshProps?: R
}
export type ErrorType<R extends Record<string, unknown>> = {
  status: 'error'
  message: string | null | undefined
  code: ErrorCode
  refreshProps: R | null
}
export type LanguageNotAvailableType = {
  status: 'languageNotAvailable'
  availableLanguages: Array<LanguageModel>
  cityCode: string
  changeUnavailableLanguage: (dispatch: Dispatch<StoreActionType>, newLanguage: string) => void
}
export type SuccessType<S extends Record<string, unknown>, R extends Record<string, unknown>> = {
  status: 'success'
  innerProps: S
  refreshProps: R
}

export type StatusPropsType<
  S extends {
    dispatch: Dispatch<StoreActionType>
  },
  R extends Record<string, unknown>
> =
  | RouteNotInitializedType
  | LoadingType<Omit<S, keyof { dispatch: Dispatch<StoreActionType> }>, R>
  | ErrorType<R>
  | LanguageNotAvailableType
  | SuccessType<Omit<S, keyof { dispatch: Dispatch<StoreActionType> }>, R>

export type withPayloadProviderPropsType<
  S extends {
    dispatch: Dispatch<StoreActionType>
  },
  R extends Record<string, unknown>,
  T extends RoutesType
> = StatusPropsType<S, R> & {
  dispatch: Dispatch<StoreActionType>
  navigation: NavigationPropType<T>
  route: RoutePropType<T>
}

const withPayloadProvider =
  <
    S extends {
      dispatch: Dispatch<StoreActionType>
    },
    R extends Record<string, unknown>,
    T extends RoutesType
  >(
    refresh: (refreshProps: R, dispatch: Dispatch<StoreActionType>) => void,
    clearRouteOnClose: boolean,
    noScrollView?: boolean
  ): ((Component: React.ComponentType<S>) => React.ComponentType<withPayloadProviderPropsType<S, R, T>>) =>
  (Component: React.ComponentType<S>): React.ComponentType<withPayloadProviderPropsType<S, R, T>> => {
    const Wrapper = ({ route, dispatch, ...props }: withPayloadProviderPropsType<S, R, T>) => {
      const [timeoutExpired, setTimeoutExpired] = useState(false)
      // The hook must be used here and not in the route containers since the containers are unmounted on language change
      // Otherwise the routes are cleared on language change and just a blank screen is displayed
      useClearRouteOnClose(route, dispatch, clearRouteOnClose)

      useEffect(() => {
        const timer = setTimeout(() => {
          setTimeoutExpired(true)
        }, LOADING_TIMEOUT)
        return () => clearTimeout(timer)
      }, [])

      const refreshIfPossible = () => {
        if (
          props.status === 'routeNotInitialized' ||
          props.status === 'loading' ||
          props.status === 'languageNotAvailable'
        ) {
          throw Error('Refreshing is not possible because the route is not yet initialized or already loading.')
        }

        if (props.refreshProps) {
          refresh(props.refreshProps, dispatch)
        }
      }

      const changeUnavailableLanguage = (newLanguage: string) => {
        if (props.status !== 'languageNotAvailable') {
          throw Error('Call of changeUnavailableLanguage is only possible when language is not available.')
        }

        props.changeUnavailableLanguage(dispatch, newLanguage)
      }

      if (props.status === 'routeNotInitialized') {
        return <Layout />
      }
      if (props.status === 'error') {
        return (
          <LayoutedScrollView refreshControl={<RefreshControl onRefresh={refreshIfPossible} refreshing={false} />}>
            <Failure tryAgain={refreshIfPossible} code={props.code} />
          </LayoutedScrollView>
        )
      }
      if (props.status === 'languageNotAvailable') {
        return (
          <LanguageNotAvailablePage languages={props.availableLanguages} changeLanguage={changeUnavailableLanguage} />
        )
      }
      if (props.status === 'loading') {
        const { innerProps } = props

        if (!timeoutExpired) {
          // Prevent jumpy behaviour by showing nothing until the timeout finishes
          return <Layout />
        }
        if (innerProps) {
          const componentProps = { ...innerProps, dispatch } as S
          // Display previous content if available
          return (
            <LayoutedScrollView refreshControl={<RefreshControl refreshing />}>
              <Component {...componentProps} />
            </LayoutedScrollView>
          )
        }
        // Full screen loading spinner
        return (
          <LayoutedScrollView refreshControl={<RefreshControl refreshing={false} />}>
            <ProgressSpinner progress={props.progress} />
          </LayoutedScrollView>
        )
      }
      const componentProps = { ...props.innerProps, dispatch } as S
      // props.status === 'success'
      if (noScrollView) {
        return (
          <Layout>
            <Component {...componentProps} />
          </Layout>
        )
      }

      return (
        <LayoutedScrollView refreshControl={<RefreshControl onRefresh={refreshIfPossible} refreshing={false} />}>
          <Component {...componentProps} />
        </LayoutedScrollView>
      )
    }

    Wrapper.displayName = wrapDisplayName(Component, 'withPayloadProvider')
    return Wrapper
  }

export default withPayloadProvider
