// @flow

import type {
  NewsRouteStateType,
  LanguageResourceCacheStateType,
  StateType
} from '../../../modules/app/StateType'
import type {
  FetchMoreNewsActionType,
  StoreActionType,
  SwitchContentLanguageActionType
} from '../../../modules/app/StoreActionType'
import { connect } from 'react-redux'
import { type TFunction, withTranslation } from 'react-i18next'
import withRouteCleaner from '../../../modules/endpoint/hocs/withRouteCleaner'
import createNavigateToNews from '../../../modules/app/createNavigateToNews'
import type { Dispatch } from 'redux'

import type { NavigationScreenProp } from 'react-navigation'
import withCustomPayloadProvider, {
  INTERNATIONAL
} from './WithCustomNewsProvider'
import type { StatusPropsType } from './WithCustomNewsProvider'
import {
  CityModel,
  LocalNewsModel,
  TunewsModel
} from '@integreat-app/integreat-api-client'
import * as React from 'react'
import { mapProps } from 'recompose'
import TranslatedWithThemeNewsList from '../components/NewsList'

type ContainerPropsType = {|
  path: ?string,
  newsList: $ReadOnlyArray<LocalNewsModel | TunewsModel>,
  cities: $ReadOnlyArray<CityModel>,
  cityCode: string,
  language: string,
  status: string,
  resourceCache: LanguageResourceCacheStateType,
  navigation: NavigationScreenProp<*>,
  dispatch: Dispatch<StoreActionType>,
  cityModel: CityModel,

  // option props that comes from provider
  setFlatListRef?: (ref: any) => void,
  fetchNews?: () => void,
  selectedNewsType: string,

  // option props that comes from action
  hasMoreNews?: boolean,
  page?: number
|}

type RefreshPropsType = {|
  navigation: NavigationScreenProp<*>,
  cityCode: string,
  language: string,
  path: ?string,
  selectedNewsType: string
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
  console.log({ routeline96: route })

  if (!route) {
    return { status: 'routeNotInitialized' }
  }
  if (
    state.cities.status === 'loading' ||
    switchingLanguage ||
    languages.status === 'loading'
  ) {
    return { status: 'loading' }
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
      changeUnavailableLanguage: createChangeUnavailableLanguage(route.city, t),
      innerProps: {
        language: state.contentLanguage,
        cityCode: route.city,
        selectedNewsType: route.type,
        navigation: ownProps.navigation
      }
    }
  }

  const refreshProps = {
    path: route.path,
    cityCode: route.city,
    language: state.contentLanguage,
    navigation: ownProps.navigation,
    selectedNewsType: route.type
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
  }
  const cities = state.cities.models
  const cityModel = cities.find(city => city.code === route.city) || {}
  if (route.status === 'loading') {
    return {
      status: 'loading',
      innerProps: {
        cityModel,
        language: state.contentLanguage,
        path: route.path,
        navigation,
        selectedNewsType: route.type,
        cityCode: route.city
      }
    }
  }

  const innerProps = {
    path: route.path,
    cities: cities,
    cityCode: route.city,
    language: state.contentLanguage,
    newsList: route.models,
    resourceCache: resourceCache.value,
    selectedNewsType: route.type,
    status: route.status,
    cityModel,
    navigation
  }

  if (route.status === 'loadingMore') {
    return {
      status: 'loadingMore',
      innerProps
    }
  }
  return {
    status: 'ready',
    refreshProps,
    innerProps: {
      ...innerProps,
      hasMoreNews: route.hasMoreNews,
      page: route.page
    }
  }
}

const mapDispatchToProps = (
  dispatch: Dispatch<StoreActionType>
): DispatchPropsType => ({ dispatch })

class NewsContainer extends React.Component<ContainerPropsType> {
  fetchMoreNews = async () => {
    const { dispatch, selectedNewsType, ...rest } = this.props
    const { cityCode, language, navigation, path, page } = rest
    const { newsList, hasMoreNews } = rest
    const isTuNews = selectedNewsType === INTERNATIONAL

    if (hasMoreNews && isTuNews) {
      const fetchNews: FetchMoreNewsActionType = {
        type: 'FETCH_MORE_NEWS',
        params: {
          city: cityCode,
          language,
          path,
          type: selectedNewsType,
          key: navigation.state.key,
          page: page + 1,
          oldNewsList: newsList,
          hasMoreNews,
          criterion: {
            forceUpdate: false,
            shouldRefreshResources: false
          }
        }
      }
      dispatch(fetchNews)
    }
  };

  render () {
    const { dispatch, status, ...rest } = this.props

    return (
      <TranslatedWithThemeNewsList
        {...rest}
        dispatch={dispatch}
        {...this.state}
        status={status}
        isFetchingMore={status === 'loadingMore'}
        setFlatListRef={this.props.setFlatListRef}
        fetchMoreNews={this.fetchMoreNews}
        fetchNews={this.props.fetchNews}
        navigateToNews={createNavigateToNews(dispatch, rest.navigation)}
      />
    )
  }
}

type RestType = $Diff<PropsType, OwnPropsType>
const removeOwnProps = (props: PropsType): RestType => {
  const { t, navigation, ...rest } = props
  return rest
}

const refresh = (
  refreshProps: RefreshPropsType,
  dispatch: Dispatch<StoreActionType>
) => {
  const { navigation, cityCode, language, path, selectedNewsType } = refreshProps
  console.log({ path, selectedNewsType })

  const navigateToNews = createNavigateToNews(dispatch, navigation)
  navigateToNews({
    cityCode,
    type: selectedNewsType,
    language,
    path,
    forceRefresh: true,
    key: navigation.state.key
  })
}

const NewsContainerWithNewsPayloadProvider = withCustomPayloadProvider<ContainerPropsType, RefreshPropsType>(
  refresh
)(NewsContainer)

export default withRouteCleaner<{| navigation: NavigationScreenProp<*> |}>(
  withTranslation('error')(
    connect<PropsType, OwnPropsType, _, _, _, _>(
      mapStateToProps,
      mapDispatchToProps
    )(
      mapProps<RestType, PropsType>(removeOwnProps)(
        NewsContainerWithNewsPayloadProvider
      )
    )
  )
)
