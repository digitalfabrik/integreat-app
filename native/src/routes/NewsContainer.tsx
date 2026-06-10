import React, { ReactElement, useCallback, useState } from 'react'

import {
  NEWS_ALL_SOURCES_FILTER,
  NEWS_ROUTE,
  newsFilterToSources,
  NewsRouteType,
  NewsSourceFilter as NewsSourceFilterType,
} from 'shared'

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
  const { id } = route.params
  const { regionCode, languageCode } = useRegionAppContext()
  const [newsSourceFilter, setNewsSourceFilter] = useState<NewsSourceFilterType>(NEWS_ALL_SOURCES_FILTER)
  const { data, ...response } = useLoadRegionContent({
    regionCode,
    languageCode,
    refreshNews: true,
  })

  const newsSources = newsFilterToSources(newsSourceFilter)
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
      {news && (
        <News
          id={id}
          news={news}
          regionCode={regionCode}
          languageCode={languageCode}
          refresh={response.refresh}
          newsSource={newsSourceFilter}
          setNewsSource={setNewsSourceFilter}
        />
      )}
    </LoadingErrorHandler>
  )
}

export default NewsContainer
