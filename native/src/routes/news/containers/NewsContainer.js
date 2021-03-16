// @flow

import type { NewsModelsType, StateType } from '../../../modules/app/StateType'
import type { FetchMoreNewsActionType, StoreActionType } from '../../../modules/app/StoreActionType'
import { connect } from 'react-redux'
import { type TFunction, withTranslation } from 'react-i18next'
import type { Dispatch } from 'redux'
import { CityModel } from 'api-client'
import React, { useCallback } from 'react'
import News from '../components/News'
import withPayloadProvider, { type StatusPropsType } from '../../../modules/endpoint/hocs/withPayloadProvider'
import NewsHeader from '../../../modules/common/components/NewsHeader'
import { View } from 'react-native'
import LoadingSpinner from '../../../modules/common/components/LoadingSpinner'
import ErrorCodes from '../../../modules/error/ErrorCodes'
import type { NavigationPropType, RoutePropType } from '../../../modules/app/constants/NavigationTypes'
import type { NewsRouteType, NewsType } from 'api-client/src/routes'
import { NEWS_ROUTE, TU_NEWS_TYPE } from 'api-client/src/routes'
import createNavigate from '../../../modules/navigation/createNavigate'
import navigateToLink from '../../../modules/navigation/navigateToLink'

type NavigationPropsType = {|
  route: RoutePropType<NewsRouteType>,
  navigation: NavigationPropType<NewsRouteType>
|}

type OwnPropsType = {|
  ...NavigationPropsType,
  t: TFunction
|}

type DispatchPropsType = {| dispatch: Dispatch<StoreActionType> |}

type ContainerPropsType =
  | {|
  ...NavigationPropsType,
  ...DispatchPropsType,
  status: 'fetching',
  newsId: ?string,
  language: string,
  cityModel: CityModel,
  selectedNewsType: NewsType
|}
  | {|
  ...NavigationPropsType,
  ...DispatchPropsType,
  status: 'ready',
  news: NewsModelsType,
  hasMoreNews: ?boolean,
  page: ?number,
  isFetchingMore: boolean,
  newsId: ?string,
  language: string,
  cityModel: CityModel,
  selectedNewsType: NewsType
|}

type RefreshPropsType = {|
  ...NavigationPropsType,
  cityCode: string,
  language: string,
  newsId: ?string,
  selectedNewsType: NewsType
|}

type StatePropsType = StatusPropsType<ContainerPropsType, RefreshPropsType>
type PropsType = {| ...OwnPropsType, ...StatePropsType, ...DispatchPropsType |}

const onRouteClose = (routeKey: string, dispatch: Dispatch<StoreActionType>) => {
  dispatch({ type: 'CLEAR_NEWS', params: { key: routeKey } })
}

const refresh = (refreshProps: RefreshPropsType, dispatch: Dispatch<StoreActionType>) => {
  const { route, navigation, cityCode, language, newsId, selectedNewsType } = refreshProps

  const navigateTo = createNavigate(dispatch, navigation)
  navigateTo(
    {
      route: NEWS_ROUTE,
      cityCode,
      newsType: selectedNewsType,
      languageCode: language,
      newsId: newsId || undefined
    },
    route.key,
    true
  )
}

const createChangeUnavailableLanguage = (city: string, t: TFunction) => (
  dispatch: Dispatch<StoreActionType>,
  newLanguage: string
) => {
  dispatch({ type: 'SWITCH_CONTENT_LANGUAGE', params: { newLanguage, city, t } })
}

const mapStateToProps = (state: StateType, ownProps: OwnPropsType): StatePropsType => {
  const {
    t,
    navigation,
    route: { key }
  } = ownProps
  if (!state.cityContent) {
    return { status: 'routeNotInitialized' }
  }

  const { routeMapping, switchingLanguage, languages } = state.cityContent

  const route = routeMapping[key]

  if (!route || route.routeType !== NEWS_ROUTE) {
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
    route: ownProps.route,
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
        language: state.contentLanguage,
        selectedNewsType: route.type,
        cityModel,
        navigation,
        route: ownProps.route
      }
    }
  }

  return {
    status: 'success',
    refreshProps,
    innerProps: {
      status: 'ready',
      newsId: route.newsId,
      language: state.contentLanguage,
      news: route.models,
      selectedNewsType: route.type,
      cityModel,
      navigation,
      route: ownProps.route,
      hasMoreNews: route.hasMoreNews || null,
      page: route.page || null,
      isFetchingMore: route.status === 'loadingMore'
    }
  }
}

const NewsContainer = (props: ContainerPropsType) => {
  const { cityModel, dispatch, selectedNewsType, route, language, newsId, navigation } = props

  const navigateToLinkProp = useCallback(
    (url: string, language: string, shareUrl: string) => {
      const navigateTo = createNavigate(dispatch, navigation)
      navigateToLink(url, navigation, language, navigateTo, shareUrl)
    },
    [dispatch, navigation]
  )

  const fetchNews = useCallback(
    (newsType: NewsType) => {
      dispatch({
        type: 'FETCH_NEWS',
        params: {
          city: cityModel.code,
          language,
          newsId: null,
          type: newsType,
          key: route.key,
          criterion: {
            forceUpdate: false,
            shouldRefreshResources: false
          }
        }
      })
    },
    [cityModel, language, route, dispatch]
  )

  const fetchMoreNews = useCallback(
    ({ hasMoreNews, news, page }: {| hasMoreNews: ?boolean, news: NewsModelsType, page: ?number |}) => () => {
      if (!hasMoreNews || !page) {
        // Already fetching more
        return
      }
      const isTunews = selectedNewsType === TU_NEWS_TYPE

      if (hasMoreNews && isTunews) {
        const fetchNews: FetchMoreNewsActionType = {
          type: 'FETCH_MORE_NEWS',
          params: {
            city: cityModel.code,
            language,
            newsId,
            type: TU_NEWS_TYPE,
            key: route.key,
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
    },
    [selectedNewsType, language, cityModel, newsId, dispatch, route]
  )

  if (props.status === 'ready') {
    const { news, page, hasMoreNews, isFetchingMore } = props
    return (
      <View style={{ flex: 1 }}>
        <NewsHeader selectedNewsType={selectedNewsType} cityModel={cityModel} navigateToNews={fetchNews} />
        <News
          newsId={newsId}
          news={news}
          routeKey={route.key}
          selectedNewsType={selectedNewsType}
          isFetchingMore={isFetchingMore}
          fetchMoreNews={fetchMoreNews({ news, hasMoreNews, page })}
          cityCode={cityModel.code}
          language={language}
          navigateTo={createNavigate(dispatch, navigation)}
          navigateToLink={navigateToLinkProp}
        />
      </View>
    )
  } else {
    return (
      <View style={{ flex: 1 }}>
        <NewsHeader selectedNewsType={selectedNewsType} cityModel={cityModel} navigateToNews={fetchNews} />
        <LoadingSpinner />
      </View>
    )
  }
}

export default withTranslation<OwnPropsType>('error')(
  connect<PropsType, OwnPropsType, _, _, _, _>(mapStateToProps)(
    withPayloadProvider<ContainerPropsType, RefreshPropsType, NewsRouteType>(refresh, onRouteClose, true)(NewsContainer)
  )
)
