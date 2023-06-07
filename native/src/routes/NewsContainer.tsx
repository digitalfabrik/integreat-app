import React, { ReactElement, useCallback } from 'react'

import { ErrorCode, LOCAL_NEWS_TYPE, NEWS_ROUTE, NewsRouteType, NewsType, TU_NEWS_TYPE } from 'api-client'

import NewsHeader from '../components/NewsHeader'
import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import useCityAppContext from '../hooks/useCityAppContext'
import useLoadCityContent from '../hooks/useLoadCityContent'
import useNavigate from '../hooks/useNavigate'
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
  const { data, ...response } = useLoadCityContent({ cityCode, languageCode })
  const { navigateTo } = useNavigate()

  const navigateToNews = useCallback(
    (newsId: string) => navigateTo({ route: NEWS_ROUTE, cityCode, languageCode, newsType, newsId }),
    [cityCode, languageCode, newsType, navigateTo]
  )

  const selectNewsType = (newsType: NewsType) => navigation.setParams({ newsType, newsId: null })

  const isDisabled = data && (newsType === LOCAL_NEWS_TYPE ? !data.city.localNewsEnabled : !data.city.tunewsEnabled)
  const error = isDisabled ? ErrorCode.PageNotFound : response.error

  return (
    <LoadingErrorHandler {...response} error={error}>
      {data && (
        <>
          {newsId === null && (
            <NewsHeader selectedNewsType={newsType} cityModel={data.city} selectNewsType={selectNewsType} />
          )}
          {newsType === LOCAL_NEWS_TYPE && (
            <LocalNews
              route={route}
              navigation={navigation}
              navigateToNews={navigateToNews}
              newsId={newsId}
              data={data}
            />
          )}
          {newsType === TU_NEWS_TYPE &&
            (newsId ? (
              <TuNewsDetail route={route} navigation={navigation} newsId={newsId} data={data} />
            ) : (
              <TuNews route={route} navigation={navigation} navigateToNews={navigateToNews} data={data} />
            ))}
        </>
      )}
    </LoadingErrorHandler>
  )
}

export default NewsContainer
