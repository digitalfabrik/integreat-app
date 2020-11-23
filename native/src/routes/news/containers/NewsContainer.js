// @flow

import type { NewsModelsType, NewsRouteStateType, NewsType, StateType } from '../../../modules/app/StateType'
import type { FetchMoreNewsActionType, StoreActionType } from '../../../modules/app/StoreActionType'
import { connect } from 'react-redux'
import { type TFunction, withTranslation } from 'react-i18next'
import withRouteCleaner from '../../../modules/endpoint/hocs/withRouteCleaner'
import createNavigateToNews from '../../../modules/app/createNavigateToNews'
import type { Dispatch } from 'redux'
import type { NavigationStackProp } from 'react-navigation-stack'
import { CityModel } from 'api-client'
import * as React from 'react'
import NewsList from '../components/NewsList'
import { TUNEWS } from '../../../modules/endpoint/constants'
import withPayloadProvider, { type StatusPropsType } from '../../../modules/endpoint/hocs/withPayloadProvider'
import NewsHeader from '../../../modules/common/components/NewsHeader'
import { View } from 'react-native'
import LoadingSpinner from '../../../modules/common/components/LoadingSpinner'
import ErrorCodes from '../../../modules/error/ErrorCodes'

type ContainerPropsType = {|
  status: 'fetching',
  newsId: ?string,
  cityCode: string,
  language: string,
  navigation: NavigationStackProp<*>,
  dispatch: Dispatch<StoreActionType>,
  cityModel: CityModel,
  selectedNewsType: NewsType
|} | {|
  status: 'ready',
  news: NewsModelsType,
  hasMoreNews?: boolean,
  page?: number,
  isFetchingMore: boolean,
  newsId: ?string,
  cityCode: string,
  language: string,
  navigation: NavigationStackProp<*>,
  dispatch: Dispatch<StoreActionType>,
  cityModel: CityModel,
  selectedNewsType: NewsType
|}

type RefreshPropsType = {|
  navigation: NavigationStackProp<*>,
  cityCode: string,
  language: string,
  newsId: ?string,
  selectedNewsType: NewsType
|}

type OwnPropsType = {| navigation: NavigationStackProp<*>, t: TFunction |}
type StatePropsType = StatusPropsType<ContainerPropsType, RefreshPropsType>
type DispatchPropsType = {| dispatch: Dispatch<StoreActionType> |}
type PropsType = {| ...OwnPropsType, ...StatePropsType, ...DispatchPropsType |}

const refresh = (refreshProps: RefreshPropsType, dispatch: Dispatch<StoreActionType>) => {
  const { navigation, cityCode, language, newsId, selectedNewsType } = refreshProps

  const navigateToNews = createNavigateToNews(dispatch, navigation)
  navigateToNews({
    cityCode,
    type: selectedNewsType,
    language,
    newsId,
    forceRefresh: true,
    key: navigation.state.key
  })
}

const createChangeUnavailableLanguage = (city: string, t: TFunction) => (
  dispatch: Dispatch<StoreActionType>,
  newLanguage: string
) => {
  dispatch({ type: 'SWITCH_CONTENT_LANGUAGE', params: { newLanguage, city, t } })
}

const mapStateToProps = (state: StateType, ownProps: OwnPropsType): StatePropsType => {
  const { t, navigation } = ownProps
  if (!state.cityContent) {
    return { status: 'routeNotInitialized' }
  }

  const { newsRouteMapping, switchingLanguage, languages } = state.cityContent

  const route: ?NewsRouteStateType = newsRouteMapping[navigation.state.key]
  if (!route) {
    return { status: 'routeNotInitialized' }
  }

  if (route.status === 'languageNotAvailable' && !switchingLanguage) {
    if (languages.status === 'error' || languages.status === 'loading') {
      console.error('languageNotAvailable status impossible if languages not ready')
      return {
        status: 'error',
        refreshProps: null,
        code: languages.code || ErrorCodes.UnknownError,
        message: languages.message || 'languages not ready'
      }
    }

    return {
      status: 'languageNotAvailable',
      availableLanguages: languages.models.filter(lng => route.allAvailableLanguages.has(lng.code)),
      cityCode: route.city,
      changeUnavailableLanguage: createChangeUnavailableLanguage(route.city, t)
    }
  }

  const refreshProps = {
    newsId: route.newsId,
    cityCode: route.city,
    language: state.contentLanguage,
    navigation: ownProps.navigation,
    selectedNewsType: route.type
  }

  if (state.cities.status === 'error') {
    return { status: 'error', message: state.cities.message, code: state.cities.code, refreshProps }
  } else if (route.status === 'error') {
    return { status: 'error', message: route.message, code: route.code, refreshProps }
  } else if (languages.status === 'error') {
    return { status: 'error', message: languages.message, code: languages.code, refreshProps }
  }

  if (state.cities.status === 'loading' || switchingLanguage || languages.status === 'loading') {
    return { status: 'loading', progress: 0 }
  }

  const cities = state.cities.models
  const cityModel = cities.find(city => city.code === route.city)

  if (!cityModel) {
    throw new Error('cityModel is undefined!')
  } else if (route.status === 'languageNotAvailable') {
    // Necessary for flow type checking, already handled above
    throw new Error('language not available route status not handled!')
  }

  if (route.status === 'loading') {
    return {
      status: 'success',
      refreshProps,
      innerProps: {
        status: 'fetching',
        newsId: route.newsId,
        cityCode: route.city,
        language: state.contentLanguage,
        selectedNewsType: route.type,
        cityModel,
        navigation
      }
    }
  }

  return {
    status: 'success',
    refreshProps,
    innerProps: {
      status: 'ready',
      newsId: route.newsId,
      cityCode: route.city,
      language: state.contentLanguage,
      news: route.models,
      selectedNewsType: route.type,
      cityModel,
      navigation,
      hasMoreNews: route.status === 'loadingMore' ? undefined : route.hasMoreNews,
      page: route.status === 'loadingMore' ? undefined : route.page,
      isFetchingMore: route.status === 'loadingMore'
    }
  }
}

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>): DispatchPropsType => ({ dispatch })

class NewsContainer extends React.Component<ContainerPropsType> {
  fetchNews = (newsType: NewsType) => {
    const { dispatch, cityCode, navigation, language } = this.props
    dispatch({
      type: 'FETCH_NEWS',
      params: {
        city: cityCode,
        language,
        newsId: null,
        type: newsType,
        key: navigation.state.key,
        criterion: {
          forceUpdate: false,
          shouldRefreshResources: false
        }
      }
    })
  }

  fetchMoreNews = () => {
    if (this.props.status === 'fetching') {
      throw new Error('Cannot fetch more if already fetching')
    }
    const { news, hasMoreNews, page, dispatch, selectedNewsType, ...rest } = this.props
    const { cityCode, language, navigation, newsId } = rest

    const isTunews = selectedNewsType === TUNEWS

    if (hasMoreNews && isTunews) {
      const fetchNews: FetchMoreNewsActionType = {
        type: 'FETCH_MORE_NEWS',
        params: {
          city: cityCode,
          language,
          newsId,
          type: TUNEWS,
          key: navigation.state.key,
          page: page + 1,
          previouslyFetchedNews: news,
          hasMoreNews,
          criterion: {
            forceUpdate: false,
            shouldRefreshResources: false
          }
        }
      }
      dispatch(fetchNews)
    }
  }

  render () {
    if (this.props.status === 'ready') {
      const { isFetchingMore, status, cityModel, selectedNewsType, dispatch, ...rest } = this.props

      return (
        <View style={{ flex: 1 }}>
          <NewsHeader selectedNewsType={selectedNewsType} cityModel={cityModel} navigateToNews={this.fetchNews} />
          <NewsList dispatch={dispatch}
                    selectedNewsType={selectedNewsType}
                    isFetchingMore={isFetchingMore}
                    fetchMoreNews={this.fetchMoreNews}
                    navigateToNews={createNavigateToNews(dispatch, rest.navigation)}
                    {...rest} />
        </View>
      )
    } else {
      const { cityModel, selectedNewsType } = this.props
      return (
        <View style={{ flex: 1 }}>
          <NewsHeader selectedNewsType={selectedNewsType} cityModel={cityModel} navigateToNews={this.fetchNews} />
          <LoadingSpinner />
        </View>
      )
    }
  }
}

export default withRouteCleaner<{| navigation: NavigationStackProp<*> |}>(
  withTranslation('error')(
    connect<PropsType, OwnPropsType, _, _, _, _>(mapStateToProps, mapDispatchToProps)(
      withPayloadProvider<ContainerPropsType, RefreshPropsType>(refresh, true)(
        NewsContainer
      ))))
