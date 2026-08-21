import React, { ReactElement, useCallback } from 'react'

import { NEWS_ALL_SOURCES_FILTER, NEWS_ROUTE, newsFilterToSources, NewsRouteType } from 'shared'

import News from '../components/News'
import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import useHeader from '../hooks/useHeader'
import useLoadRegionContent from '../hooks/useLoadRegionContent'
import usePreviousProp from '../hooks/usePreviousProp'
import useRegionAppContext from '../hooks/useRegionAppContext'
import urlFromRouteInformation from '../utils/url'
import LoadingErrorHandler from './LoadingErrorHandler'

type NewsContainerProps = {
  route: RouteProps<NewsRouteType>
  navigation: NavigationProps<NewsRouteType>
}

const NewsContainer = ({ navigation, route }: NewsContainerProps): ReactElement | null => {
  const { id, sourceFilter } = route.params
  const { regionCode, languageCode } = useRegionAppContext()
  const { data, ...response } = useLoadRegionContent({
    regionCode,
    languageCode,
    refreshNews: true,
  })

  const newsSources = newsFilterToSources(sourceFilter)
  const news = data?.news.filter(news => !newsSources || newsSources.includes(news.source))
  const currentNews = id != null ? data?.news.find(it => it.id === id) : undefined
  const availableLanguages = currentNews
    ? Object.keys(currentNews.availableLanguages ?? {})
    : data?.languages.map(it => it.code)

  const shareUrl = urlFromRouteInformation({
    route: NEWS_ROUTE,
    languageCode,
    regionCode,
    id: id ?? undefined,
  })
  useHeader({ navigation, route, availableLanguages, data, shareUrl })

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
    <LoadingErrorHandler {...response} loading={response.loading}>
      {data && news && (
        <News
          id={id}
          news={news}
          region={data.region}
          languageCode={languageCode}
          refresh={response.refresh}
          sourceFilter={sourceFilter ?? NEWS_ALL_SOURCES_FILTER}
          setSourceFilter={sourceFilter => navigation.setParams({ sourceFilter })}
        />
      )}
    </LoadingErrorHandler>
  )
}

export default NewsContainer
