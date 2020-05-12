// @flow

import * as React from 'react'

import { LanguageModel, CityModel } from '@integreat-app/integreat-api-client'
import { RefreshControl, ScrollView, View } from 'react-native'
import type {
  StoreActionType,
  FetchNewsActionType
} from '../../../modules/app/StoreActionType'

import { type Dispatch } from 'redux'
import { wrapDisplayName } from 'recompose'
import type { ErrorCodeType } from '../../../modules/error/ErrorCodes'
import FailureContainer from '../../../modules/error/containers/FailureContainer'
import LanguageNotAvailableContainer from '../../../modules/common/containers/LanguageNotAvailableContainer'
import styled from 'styled-components/native'
import activeInternational from '../assets/tu-news-active.svg'
import inactiveInternational from '../assets/tu-news-inactive.svg'
import activeLocalNews from '../assets/local-news-active.svg'
import inactiveLocalNews from '../assets/local-news-inactive.svg'
import type { NavigationScreenProp } from 'react-navigation'

export const INTERNATIONAL = 'international'
export const LOCAL = 'local'

const newsTabs = [
  {
    type: LOCAL,
    active: activeLocalNews,
    inactive: inactiveLocalNews,
    toggleAttr: 'pushNotificationsEnabled'
  },
  {
    type: INTERNATIONAL,
    active: activeInternational,
    inactive: inactiveInternational,
    toggleAttr: 'tunewsEnabled'
  }
]

const NewsTypeIcon = styled.Image`
  align-self: center;
`

const HeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`
const TouchableWrapper = styled.TouchableOpacity`
  margin-top: 17px;
  margin-bottom: 5px;
  margin-horizontal: 10px;
`

const Loader = styled.ActivityIndicator`
  margin-top: 15px;
`

export type RouteNotInitializedType = {| status: "routeNotInitialized" |}

export type ProviderRefreshPropType = {|
  cityModel?: CityModel,
  navigation: NavigationScreenProp<*>,
  cityCode: string,
  language: LanguageModel
|}

export type LoadingType = {|
  status: "loading",
  innerProps?: {
    path: ?string,
    selectedNewsType: string,
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
  path: ?string,
  selectedNewsType: string,
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
    path?: string,
    selectedNewsType: string,
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

const NewsTypeItem = ({ tab, onItemPress, selectedNewsType }) => {
  function onPress () {
    onItemPress(tab.type)
  }

  return (
    <TouchableWrapper onPress={onPress}>
      <NewsTypeIcon
        source={tab.type === selectedNewsType ? tab.active : tab.inactive}
      />
    </TouchableWrapper>
  )
}

const withCustomNewsProvider = <
  S: {
    ...ProviderPropType
  },
  R: {}
>(
    refresh: (refreshProps: R, dispatch: Dispatch<StoreActionType>) => void
  ): ((
  Component: React.ComponentType<S>
) => React.ComponentType<PropsType<S, R>>) => {
  return (
    Component: React.ComponentType<S>
  ): React.ComponentType<PropsType<S, R>> => {
    return class extends React.Component<
      PropsType<S, R>,
      {| selectedNewsType: string |}
    > {
      static displayName = wrapDisplayName(Component, 'withCustomNewsProvider');

      state = {
        selectedNewsType: this.getAvailableNewsType()
      };

      listRef = null;

      getAvailableNewsType (): string {
        const { cityModel, selectedNewsType } = this.props.innerProps || {}
        console.log({ getAvailableNewsType: this.props })
        const { tunewsEnabled, pushNotificationsEnabled } = cityModel || {}
        let type = LOCAL
        if (selectedNewsType) {
          type = selectedNewsType
        } else if (tunewsEnabled && !pushNotificationsEnabled) {
          type = INTERNATIONAL
        } else if (pushNotificationsEnabled && !tunewsEnabled) {
          type = LOCAL
        } else {
          type = LOCAL
        }
        return type
      }

      selectNewsType = type => {
        this.setState(
          {
            selectedNewsType: type
          },
          this.fetchNews
        )
      };

      selectNewsItemAndScrollToTop = type => {
        this.selectNewsType(type)
        requestAnimationFrame(() => {
          this.listRef &&
            this.listRef.scrollToOffset({
              animated: false,
              offset: 0
            })
        })
      };

      setFlatListRef = ref => {
        this.listRef = ref
      };

      fetchNews = () => {
        console.log('fetchNews')

        const { selectedNewsType } = this.state
        const { cityCode, navigation, path, language } =
          this.props.innerProps || {}
        const { dispatch } = this.props
        const fetchNews: FetchNewsActionType = {
          type: 'FETCH_NEWS',
          params: {
            city: cityCode,
            language,
            path,
            type: selectedNewsType,
            key: navigation.state.key,
            criterion: {
              forceUpdate: false,
              shouldRefreshResources: false
            }
          }
        }
        dispatch(fetchNews)
      };

      componentDidUpdate (prevProps: PropsType<S, R>) {
        const prevLanguage = (prevProps.innerProps || {}).language
        const currentLanguage = (this.props.innerProps || {}).language

        if (currentLanguage && prevLanguage !== currentLanguage) {
          this.fetchNews()
        }
      }

      renderHeader = () => {
        const { cityModel, path } = this.props.innerProps || {}
        const { selectedNewsType } = this.state

        return (
          <HeaderContainer>
            {!path &&
              newsTabs.map(tab =>
                (cityModel || {})[tab.toggleAttr] || true ? (
                  <NewsTypeItem
                    key={tab.type}
                    tab={tab}
                    selectedNewsType={selectedNewsType}
                    onItemPress={this.selectNewsItemAndScrollToTop}
                  />
                ) : null
              )}
          </HeaderContainer>
        )
      };

      refresh = () => {
        const props = this.props
        if (
          props.status === 'routeNotInitialized' ||
          props.status === 'loading' ||
          props.status === 'languageNotAvailable'
        ) {
          throw Error(
            'Refreshing is not possible because the route is not yet initialized or already loading.'
          )
        }

        if (props.refreshProps) {
          refresh(props.refreshProps, props.dispatch)
        }
      };

      changeUnavailableLanguage = (newLanguage: string) => {
        if (this.props.status !== 'languageNotAvailable') {
          throw Error(
            'Call of changeUnavailableLanguage is only possible when language is not available.'
          )
        }
        this.props.changeUnavailableLanguage(this.props.dispatch, newLanguage)
      };

      render () {
        const props = this.props
        if (props.status === 'routeNotInitialized') {
          return null
        } else if (props.status === 'error') {
          console.log({ error: props })

          return (
            <ScrollView
              refreshControl={
                <RefreshControl onRefresh={this.refresh} refreshing={false} />
              }
              contentContainerStyle={{ flexGrow: 1 }}>
              <FailureContainer
                tryAgain={this.refresh}
                message={props.message}
                code={props.code}
              />
            </ScrollView>
          )
        } else if (props.status === 'languageNotAvailable') {
          return (
            <LanguageNotAvailableContainer
              languages={props.availableLanguages}
              changeLanguage={this.changeUnavailableLanguage}
            />
          )
        } else if (props.status === 'loading') {
          return (
            <View style={{ flex: 1 }}>
              {this.renderHeader()}
              <Loader />
            </View>
          )
        } else {
          // props.status === 'success'|| props.status === 'loadingMore'
          return (
            <View style={{ flex: 1 }}>
              {this.renderHeader()}
              <Component
                {...props.innerProps}
                setFlatListRef={this.setFlatListRef}
                dispatch={props.dispatch}
              />
            </View>
          )
        }
      }
    }
  }
}

export default withCustomNewsProvider
