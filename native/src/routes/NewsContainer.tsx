import React, { ReactElement, useCallback } from 'react'

import { NEWS_ROUTE, NewsRouteType } from 'shared'
import { createNewsEndpoint, fromError, loadFromEndpoint, usePaginatedLoadAsync } from 'shared/api'

import Failure from '../components/Failure'
import News from '../components/News'
import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import useHeader from '../hooks/useHeader'
import useLoadRegionContent from '../hooks/useLoadRegionContent'
import usePreviousProp from '../hooks/usePreviousProp'
import useRegionAppContext from '../hooks/useRegionAppContext'
import { determineApiUrl } from '../utils/helpers'
import urlFromRouteInformation from '../utils/url'
import LoadingErrorHandler from './LoadingErrorHandler'

type NewsContainerProps = {
  route: RouteProps<NewsRouteType>
  navigation: NavigationProps<NewsRouteType>
}

const NewsContainer = ({ navigation, route }: NewsContainerProps): ReactElement | null => {
  const { id } = route.params
  const { regionCode, languageCode } = useRegionAppContext()
  const { data: regionContent, ...regionContentResponse } = useLoadRegionContent({
    regionCode,
    languageCode,
    refreshNews: true,
  })

  const { data, loadMore, loadingMore, ...response } = usePaginatedLoadAsync(
    useCallback(
      (page: number) =>
        loadFromEndpoint(createNewsEndpoint, determineApiUrl, {
          region: regionCode,
          language: languageCode,
          page,
        }),
      [regionCode, languageCode],
    ),
  )

  const news = data ?? regionContent?.news
  const currentNews = id != null ? news?.find(it => it.id === id) : undefined
  const availableLanguages = currentNews
    ? Object.keys(currentNews.availableLanguages ?? {})
    : regionContent?.languages.map(it => it.code)

  const shareUrl = urlFromRouteInformation({
    route: NEWS_ROUTE,
    languageCode,
    regionCode,
    id: id ?? undefined,
  })
  useHeader({ navigation, route, availableLanguages, data: regionContent, shareUrl })

  const onLanguageChange = useCallback(
    (newLanguage: string) => {
      if (currentNews) {
        const newId = currentNews.availableLanguages?.[newLanguage]
        navigation.setParams({ id: newId })
      }
    },
    [currentNews, navigation],
  )
  usePreviousProp({ prop: languageCode, onPropChange: onLanguageChange })

  return (
    <LoadingErrorHandler {...regionContentResponse} loading={regionContentResponse.loading || response.loading}>
      <>
        {news && (
          <News
            id={id}
            news={news}
            regionCode={regionCode}
            languageCode={languageCode}
            refresh={response.refresh}
            loadMore={loadMore}
            loadingMore={loadingMore}
          />
        )}
        {response.error && <Failure retry={response.refresh} code={fromError(response.error)} />}
      </>
    </LoadingErrorHandler>
  )
}

export default NewsContainer
