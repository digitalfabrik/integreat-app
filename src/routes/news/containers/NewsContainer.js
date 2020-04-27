// @flow

import type {
  NewsRouteStateType,
  LanguageResourceCacheStateType,
  StateType
} from '../../../modules/app/StateType'
import { View, Text } from 'react-native'
import { connect } from 'react-redux'
import { type TFunction, withTranslation } from 'react-i18next'
import withRouteCleaner from '../../../modules/endpoint/hocs/withRouteCleaner'
import createNavigateToNews from '../../../modules/app/createNavigateToNews'
import type { Dispatch } from 'redux'
import type {
  StoreActionType,
  SwitchContentLanguageActionType
} from '../../../modules/app/StoreActionType'
import type { NavigationScreenProp } from 'react-navigation'
import type { StatusPropsType } from '../../../modules/error/hocs/withPayloadProvider'
import withTheme from '../../../modules/theme/hocs/withTheme'
import { CityModel } from '@integreat-app/integreat-api-client'
import * as React from 'react'
import { mapProps } from 'recompose'
import NewsList from '../components/NewsList'
import styled from 'styled-components/native'
import activeInternational from '../assets/tu-news-active.svg'
import inactiveInternational from '../assets/tu-news-inactive.svg'
import activeLocalNews from '../assets/local-news-active.svg'
import inactiveLocalNews from '../assets/local-news-inactive.svg'
export const INTERNATIONAL = 'international'
export const LOCAL = 'local'

const newsTabs = [
  {
    type: LOCAL,
    active: activeLocalNews,
    inactive: inactiveLocalNews
  },
  {
    type: INTERNATIONAL,
    active: activeInternational,
    inactive: inactiveInternational
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

type ContainerPropsType = {|
  path: ?string,
  news: $ReadOnlyArray<any>,
  cities: $ReadOnlyArray<CityModel>,
  cityCode: string,
  language: string,
  resourceCache: LanguageResourceCacheStateType,
  navigation: NavigationScreenProp<*>,
  dispatch: Dispatch<StoreActionType>
|}

type RefreshPropsType = {|
  navigation: NavigationScreenProp<*>,
  cityCode: string,
  language: string,
  path: ?string
|}

type OwnPropsType = {| navigation: NavigationScreenProp<*>, t: TFunction |}
type StatePropsType = StatusPropsType<ContainerPropsType, RefreshPropsType>
type DispatchPropsType = {| dispatch: Dispatch<StoreActionType> |}
type PropsType = {| ...OwnPropsType, ...StatePropsType, ...DispatchPropsType |}

const createChangeUnavailableLanguage = (city: string, t: TFunction) => (
  dispatch: Dispatch<StoreActionType>,
  newLanguage: string
) => {
  const switchContentLanguage: SwitchContentLanguageActionType = {
    type: 'SWITCH_CONTENT_LANGUAGE',
    params: { newLanguage, city, t }
  }
  dispatch(switchContentLanguage)
}

const mapStateToProps = (
  state: StateType,
  ownProps: OwnPropsType
): StatePropsType => {
  const { t, navigation } = ownProps

  if (!state.cityContent) {
    return { status: 'routeNotInitialized' }
  }

  const {
    resourceCache,
    newsRouteMapping,
    switchingLanguage,
    languages
  } = state.cityContent
  const route: ?NewsRouteStateType = newsRouteMapping[navigation.state.key]

  const refreshProps = {
    path: route.path,
    cityCode: route.city,
    language: route.language,
    navigation: ownProps.navigation,
    page: route.page
  }

  if (!route) {
    return { status: 'routeNotInitialized' }
  }

  if (
    state.cities.status === 'loading' ||
    switchingLanguage ||
    route.status === 'loading' ||
    languages.status === 'loading'
  ) {
    return {
      status: 'loading',
      innerProps: {
        contentLanguage: state.contentLanguage
      },
      refreshProps
    }
  }

  if (route.status === 'languageNotAvailable') {
    if (languages.status === 'error') {
      console.error(
        'languageNotAvailable status impossible if languages not ready'
      )
      return {
        status: 'error',
        refreshProps: null,
        code: languages.code,
        message: languages.message
      }
    }
    return {
      status: 'languageNotAvailable',
      availableLanguages: languages.models.filter(lng =>
        route.allAvailableLanguages.has(lng.code)
      ),
      cityCode: route.city,
      changeUnavailableLanguage: createChangeUnavailableLanguage(route.city, t)
    }
  }

  if (state.cities.status === 'error') {
    return {
      status: 'error',
      message: state.cities.message,
      code: state.cities.code,
      refreshProps
    }
  } else if (resourceCache.status === 'error') {
    return {
      status: 'error',
      message: resourceCache.message,
      code: resourceCache.code,
      refreshProps
    }
  } else if (route.status === 'error') {
    return {
      status: 'error',
      message: route.message,
      code: route.code,
      refreshProps
    }
  } else if (languages.status === 'error') {
    return {
      status: 'error',
      message: languages.message,
      code: languages.code,
      refreshProps
    }
  } else if (route.status === 'loadingMore') {
    return {
      status: 'loadingMore',
      message: route.message,
      code: route.code,
      refreshProps,
      innerProps: {
        path: route.path,
        newsList: route.models
      }
    }
  }
  const cities = state.cities.models

  return {
    status: 'success',
    refreshProps,
    innerProps: {
      path: route.path,
      newsList: route.models,
      cities: cities,
      cityCode: route.city,
      page: route.page,
      hasMoreNews: route.hasMoreNews,
      language: state.contentLanguage,
      contentLanguage: state.contentLanguage,
      resourceCache: resourceCache.value,
      type: route.type,
      navigation
    }
  }
}

const mapDispatchToProps = (
  dispatch: Dispatch<StoreActionType>
): DispatchPropsType => ({ dispatch })

const ThemedTranslatedNewsList = withTranslation('news')(
  withTheme(props => props.language)(NewsList)
)

class NewsContainer extends React.Component<ContainerPropsType> {
  state = {
    selectedNewsType: this.props.type || LOCAL,
    language: (this.props.innerProps || {}).contentLanguage
  };

  selectNewsType = type => {
    this.setState(
      {
        selectedNewsType: type
      },
      this.fetchNews
    )
  };

  componentDidUpdate (prevProps, prevState) {
    const prevLanguage = prevProps.innerProps.contentLanguage
    const currentLanguage = this.props.innerProps.contentLanguage
    if (prevLanguage !== currentLanguage) {
      currentLanguage && this.fetchNews()
    }
  }

  async fetchMoreNews () {
    const { dispatch, ...rest } = this.props
    const { cityCode, language, navigation, path, page } = rest.refreshProps
    const { newsList, hasMoreNews } = rest.innerProps
    const { selectedNewsType } = this.state
    if (hasMoreNews) {
      const fetchNews: FetchNewsActionType = {
        type: 'FETCH_MORE_NEWS',
        params: {
          city: cityCode,
          language,
          path,
          type: selectedNewsType,
          key: navigation.state.key,
          page: page + 1,
          oldNewsList: newsList,
          criterion: {}
        }
      }
      dispatch(fetchNews)
    }
  }

  fetchNews () {
    const { dispatch, ...rest } = this.props
    const { cityCode, navigation, path } = rest.refreshProps
    const { contentLanguage } = rest.innerProps
    const { selectedNewsType } = this.state
    const fetchNews: FetchNewsActionType = {
      type: 'FETCH_NEWS',
      params: {
        city: cityCode,
        language: contentLanguage,
        path,
        type: selectedNewsType,
        key: navigation.state.key,
        criterion: {}
      }
    }
    dispatch(fetchNews)
  }

  render () {
    const { dispatch, innerProps, refreshProps, status } = this.props
    const { selectedNewsType } = this.state
    const { path } = refreshProps

    return (
      <View style={{ flex: 1 }}>
        <HeaderContainer>
          {!path &&
            newsTabs.map(tab => (
              <TouchableWrapper
                key={tab.type}
                onPress={() => {
                  this.selectNewsType(tab.type)
                }}>
                <NewsTypeIcon
                  source={
                    tab.type === selectedNewsType ? tab.active : tab.inactive
                  }
                />
              </TouchableWrapper>
            ))}
        </HeaderContainer>
        <ThemedTranslatedNewsList
          {...innerProps}
          {...refreshProps}
          dispatch={dispatch}
          {...this.state}
          status={status}
          fetchMoreNews={() => this.fetchMoreNews()}
          fetchNews={() => this.fetchNews()}
          navigateToNews={createNavigateToNews(
            dispatch,
            refreshProps.navigation
          )}
        />
      </View>
    )
  }
}

type RestType = $Diff<PropsType, OwnPropsType>
const removeOwnProps = (props: PropsType): RestType => {
  const { t, navigation, ...rest } = props
  return rest
}

export default withRouteCleaner<{| navigation: NavigationScreenProp<*> |}>(
  withTranslation('error')(
    connect<PropsType, OwnPropsType, _, _, _, _>(
      mapStateToProps,
      mapDispatchToProps
    )(mapProps<RestType, PropsType>(removeOwnProps)(NewsContainer))
  )
)
