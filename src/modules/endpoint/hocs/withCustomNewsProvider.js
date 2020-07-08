// @flow

import * as React from 'react'

import { LanguageModel, CityModel } from '@integreat-app/integreat-api-client'
import { RefreshControl, ScrollView, View } from 'react-native'
import type {
  StoreActionType,
  FetchNewsActionType
} from '../../app/StoreActionType'
import type { NewsType } from '../../app/StateType'
import { type Dispatch } from 'redux'
import { wrapDisplayName } from 'recompose'
import type { ErrorCodeType } from '../../error/ErrorCodes'
import FailureContainer from '../../error/containers/FailureContainer'
import LanguageNotAvailableContainer from '../../common/containers/LanguageNotAvailableContainer'
import type { NavigationScreenProp } from 'react-navigation'

import LoadingSpinner from '../../common/components/LoadingSpinner'
import NewsHeader from '../../common/components/NewsHeader'
import { LOCAL, TUNEWS } from '../../../routes/news/NewsTabs'

export type RouteNotInitializedType = {| status: "routeNotInitialized" |}

export type ProviderRefreshPropType = {|
  cityModel?: CityModel,
  navigation: NavigationScreenProp<*>,
  cityCode: string,
  language: string
|}

export type LoadingType = {|
  status: "loading",
  innerProps?: {
    newsId: ?string,
    selectedNewsType: NewsType,
    ...ProviderRefreshPropType
  }
|}

export type LoadingMoreType<S: {}> = {| status: "loadingMore", innerProps: S |}

export type ErrorType<R: {}> = {|
  status: "error",
  message: ?string,
  code: ErrorCodeType,
  refreshProps: R | null
|}

export type ProviderPropType = {|
  dispatch: Dispatch<StoreActionType>,
  newsId: ?string,
  selectedNewsType: NewsType,
  ...ProviderRefreshPropType
|}

export type LanguageNotAvailableType = {|
  status: "languageNotAvailable",
  availableLanguages: Array<LanguageModel>,
  changeUnavailableLanguage: (
    dispatch: Dispatch<StoreActionType>,
    newLanguage: string
  ) => void,
  innerProps: {
    newsId?: string,
    selectedNewsType: NewsType,
    ...ProviderRefreshPropType
  }
|}

export type SuccessType<S: {}, R: {}> = {|
  status: "ready",
  innerProps: S,
  refreshProps: R
|}

export type StatusPropsType<S: {}, R: {}> =
  | RouteNotInitializedType
  | LoadingType
  | LoadingMoreType<$Diff<S, { dispatch: Dispatch<StoreActionType> }>>
  | ErrorType<R>
  | LanguageNotAvailableType
  | SuccessType<$Diff<S, { dispatch: Dispatch<StoreActionType> }>, R>

export type PropsType<
  S: {
    ...ProviderPropType
  },
  R: {}
> = {|
  ...StatusPropsType<S, R>,
  ...ProviderPropType
|}

const withCustomNewsProvider = <
  S: {
    ...ProviderPropType
  },
  R: {}
>(
    refresh: (refreshProps: R, dispatch: Dispatch<StoreActionType>) => void
  ): ((Component: React.ComponentType<S>) => React.ComponentType<PropsType<S, R>>) => {
  return (Component: React.ComponentType<S>): React.ComponentType<PropsType<S, R>> => {
    return class extends React.Component<PropsType<S, R>, {| selectedNewsType: NewsType |}> {
      static displayName = wrapDisplayName(Component, 'withCustomNewsProvider');

      state = { selectedNewsType: this.getAvailableNewsType() };

      getAvailableNewsType (): NewsType {
        const { cityModel, selectedNewsType } = this.props.innerProps || {}
        const { tunewsEnabled, pushNotificationsEnabled } = cityModel || {}
        if (selectedNewsType) {
          return selectedNewsType
        } else if (tunewsEnabled && !pushNotificationsEnabled) {
          return TUNEWS
        }
        return LOCAL
      }

      selectAndFetchTunews = () => { this.setState({ selectedNewsType: TUNEWS }, this.fetchNews) };
      selectAndFetchLocalNews = () => { this.setState({ selectedNewsType: LOCAL }, this.fetchNews) };

      fetchNews = () => {
        const { selectedNewsType } = this.state
        const { dispatch } = this.props
        if (this.props.innerProps) {
          const {
            cityCode,
            navigation,
            newsId,
            language
          } = this.props.innerProps
          const fetchNews: FetchNewsActionType = {
            type: 'FETCH_NEWS',
            params: {
              city: cityCode,
              language,
              newsId,
              type: selectedNewsType,
              key: navigation.state.key,
              criterion: {
                forceUpdate: false,
                shouldRefreshResources: false
              }
            }
          }
          dispatch(fetchNews)
        }
      };

      componentDidUpdate (prevProps: PropsType<S, R>) {
        const prevLanguage = (prevProps.innerProps || {}).language
        const currentLanguage = (this.props.innerProps || {}).language
        if (currentLanguage && prevLanguage !== currentLanguage) {
          this.fetchNews()
        }
      }

      refresh = () => {
        const props = this.props

        if (
          props.status === 'routeNotInitialized' || props.status === 'loading' ||
          props.status === 'languageNotAvailable') {
          throw Error('Refreshing is not possible because the route is not yet initialized or already loading.')
        }
        if (props.refreshProps) {
          refresh(props.refreshProps, props.dispatch)
        }
      };

      changeUnavailableLanguage = (newLanguage: string) => {
        if (this.props.status !== 'languageNotAvailable') {
          throw Error('Call of changeUnavailableLanguage is only possible when language is not available.')
        }
        this.props.changeUnavailableLanguage(this.props.dispatch, newLanguage)
      };

      render () {
        const props = this.props

        if (props.status === 'routeNotInitialized') {
          return null
        } else if (props.status === 'error') {
          return (
            <ScrollView
              refreshControl={<RefreshControl onRefresh={this.refresh} refreshing={false} />}
                                            contentContainerStyle={{ flexGrow: 1 }}>
              <FailureContainer tryAgain={this.refresh} message={props.message} code={props.code} />
            </ScrollView>
          )
        } else if (props.status === 'languageNotAvailable') {
          return (
            <LanguageNotAvailableContainer languages={props.availableLanguages} changeLanguage={this.changeUnavailableLanguage} />
          )
        } else if (props.status === 'loading') {
          return (
            <View style={{ flex: 1 }}>
              {!props.innerProps?.newsId && props.innerProps?.cityModel &&
              <NewsHeader selectedNewsType={this.state.selectedNewsType}
                          cityModel={props.innerProps?.cityModel}
                          selectAndFetchLocalNews={this.selectAndFetchLocalNews}
                          selectAndFetchTunews={this.selectAndFetchTunews}
              />}
              <LoadingSpinner />
            </View>
          )
        } else {
          return (
            <View style={{ flex: 1 }}>
              {!props.innerProps.newsId && <NewsHeader selectedNewsType={this.state.selectedNewsType}
                                                       cityModel={props.innerProps.cityModel}
                                                       selectAndFetchLocalNews={this.selectAndFetchLocalNews}
                                                       selectAndFetchTunews={this.selectAndFetchTunews} />}
              <Component {...props.innerProps} dispatch={props.dispatch} />
            </View>
          )
        }
      }
    }
  }
}

export default withCustomNewsProvider
