import React, { ReactElement, useCallback } from 'react'

import { ErrorCode, LOCAL_NEWS_TYPE, NewsRouteType, NewsType, TU_NEWS_TYPE } from 'api-client'

import NewsHeader from '../components/NewsHeader'
import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import useCityAppContext from '../hooks/useCityAppContext'
import useLoadCityContent from '../hooks/useLoadCityContent'
import useOnBackNavigation from '../hooks/useOnBackNavigation'
import useOnLanguageChange from '../hooks/useOnLanguageChange'
import LoadingErrorHandler from './LoadingErrorHandler'
import LocalNews from './LocalNews'
import TuNews from './TuNews'
import TuNewsDetail from './TuNewsDetail'

type NewsContainerProps = {
  route: RouteProps<NewsRouteType>
  navigation: NavigationProps<NewsRouteType>
}

const NewsContainer = ({ route, navigation }: NewsContainerProps): ReactElement | null => {
  const { newsType, newsId } = route.params
  const { cityCode, languageCode } = useCityAppContext()
  const unusedLoad = useCallback(async () => ({ unused: true }), [])
  const { data, ...response } = useLoadCityContent({
    cityCode,
    languageCode,
    load: unusedLoad,
  })
  const selectNews = useCallback((newsId: string | null) => navigation.setParams({ newsId }), [navigation])
  const deselectNews = useCallback(() => selectNews(null), [selectNews])

  useOnBackNavigation(newsId ? deselectNews : undefined)

  // We don't support language change between single news as we don't know whether they are translated and with what id
  useOnLanguageChange({ languageCode, onLanguageChange: deselectNews })

  const navigateToNews = (newsType: NewsType) => {
    navigation.setParams({ newsType, newsId: null })
  }

  const isDisabled = data && (newsType === LOCAL_NEWS_TYPE ? !data.city.localNewsEnabled : !data.city.tunewsEnabled)
  const error = isDisabled ? ErrorCode.PageNotFound : response.error

  const props = { route, navigation, selectNews }

  return (
    <LoadingErrorHandler {...response} error={error}>
      {data && (
        <>
          <NewsHeader selectedNewsType={newsType} cityModel={data.city} navigateToNews={navigateToNews} />
          {newsType === LOCAL_NEWS_TYPE && <LocalNews {...props} newsId={newsId} data={data} />}
          {newsType === TU_NEWS_TYPE &&
            (newsId ? <TuNewsDetail {...props} newsId={newsId} data={data} /> : <TuNews {...props} data={data} />)}
        </>
      )}
    </LoadingErrorHandler>
  )
}

export default NewsContainer
