import * as React from 'react'
import { useEffect, useState } from 'react'
import { RefreshControl } from 'react-native'
import { Dispatch } from 'redux'

import { ErrorCode, LanguageModel } from 'api-client'

import Failure from '../components/Failure'
import LanguageNotAvailableContainer from '../components/LanguageNotAvailableContainer'
import LayoutContainer from '../components/LayoutContainer'
import LayoutedScrollView from '../components/LayoutedScrollView'
import ProgressContainer from '../components/ProgressContainer'
import { NavigationPropType, RoutePropType, RoutesType } from '../constants/NavigationTypes'
import wrapDisplayName from '../hocs/wrapDisplayName'
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

export type PropsType<
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

const withPayloadProvider = <
  S extends {
    dispatch: Dispatch<StoreActionType>
  },
  R extends Record<string, unknown>,
  T extends RoutesType
>(
  refresh: (refreshProps: R, dispatch: Dispatch<StoreActionType>) => void,
  onRouteClose?: (routeKey: string, dispatch: Dispatch<StoreActionType>) => void,
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
      useEffect(() => {
        if (onRouteClose) {
          return () => onRouteClose(props.route.key, props.dispatch)
        }
      }, [props.route.key, props.dispatch])

      function refreshIfPossible() {
        if (
          props.status === 'routeNotInitialized' ||
          props.status === 'loading' ||
          props.status === 'languageNotAvailable'
        ) {
          throw Error('Refreshing is not possible because the route is not yet initialized or already loading.')
        }

        if (props.refreshProps) {
          refresh(props.refreshProps, props.dispatch)
        }
      }

      function changeUnavailableLanguage(newLanguage: string) {
        if (props.status !== 'languageNotAvailable') {
          throw Error('Call of changeUnavailableLanguage is only possible when language is not available.')
        }

        props.changeUnavailableLanguage(props.dispatch, newLanguage)
      }

      if (props.status === 'routeNotInitialized') {
        return <LayoutContainer />
      } else if (props.status === 'error') {
        return (
          <LayoutedScrollView refreshControl={<RefreshControl onRefresh={refreshIfPossible} refreshing={false} />}>
            <Failure tryAgain={refreshIfPossible} code={props.code} />
          </LayoutedScrollView>
        )
      } else if (props.status === 'languageNotAvailable') {
        return (
          <LanguageNotAvailableContainer
            languages={props.availableLanguages}
            changeLanguage={changeUnavailableLanguage}
          />
        )
      } else if (props.status === 'loading') {
        const { innerProps, dispatch } = props

        if (!timeoutExpired) {
          // Prevent jumpy behaviour by showing nothing until the timeout finishes
          return <LayoutContainer />
        } else if (!!innerProps && !!dispatch) {
          const componentProps = { ...innerProps, dispatch } as S
          // Display previous content if available
          return (
            <LayoutedScrollView refreshControl={<RefreshControl refreshing />}>
              <Component {...componentProps} />
            </LayoutedScrollView>
          )
        } else {
          // Full screen loading spinner
          return (
            <LayoutedScrollView refreshControl={<RefreshControl refreshing={false} />}>
              <ProgressContainer progress={props.progress} />
            </LayoutedScrollView>
          )
        }
      } else {
        const componentProps = { ...props.innerProps, dispatch: props.dispatch } as S
        // props.status === 'success'
        if (noScrollView) {
          return (
            <LayoutContainer>
              <Component {...componentProps} />
            </LayoutContainer>
          )
        }

        return (
          <LayoutedScrollView refreshControl={<RefreshControl onRefresh={refreshIfPossible} refreshing={false} />}>
            <Component {...componentProps} />
          </LayoutedScrollView>
        )
      }
    }

    Wrapper.displayName = wrapDisplayName(Component, 'withPayloadProvider')
    return Wrapper
  }
}

export default withPayloadProvider
