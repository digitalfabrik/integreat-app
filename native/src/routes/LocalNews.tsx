import React, { ReactElement, useCallback } from 'react'

import { LOCAL_NEWS_TYPE, NEWS_ROUTE, NewsRouteType } from 'shared'

import News from '../components/News'
import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import useHeader from '../hooks/useHeader'
import { RegionContentData } from '../hooks/useLoadRegionContent'
import usePreviousProp from '../hooks/usePreviousProp'
import urlFromRouteInformation from '../utils/url'

type LocalNewsProps = {
  route: RouteProps<NewsRouteType>
  navigation: NavigationProps<NewsRouteType>
  newsId: number | null
  data: RegionContentData
  navigateToNews: (newsId: number) => void
  refresh: () => void
}

const LocalNews = ({ route, navigation, data, newsId, navigateToNews, refresh }: LocalNewsProps): ReactElement => {
  const regionCode = data.region.code
  const languageCode = data.language.code
  const selectedLocalNews = data.localNews.find(it => it.id === newsId)
  const availableLanguages = selectedLocalNews
    ? Object.keys(selectedLocalNews.availableLanguages)
    : data.languages.map(it => it.code)
  const shareUrl = urlFromRouteInformation({
    route: NEWS_ROUTE,
    regionCode,
    languageCode,
    newsType: LOCAL_NEWS_TYPE,
    newsId: newsId ?? undefined,
  })
  useHeader({ navigation, route, availableLanguages, data, shareUrl })

  const onLanguageChange = useCallback(
    (newLanguage: string) => {
      if (selectedLocalNews) {
        navigation.setParams({ newsId: selectedLocalNews.availableLanguages[newLanguage] })
      }
    },
    [selectedLocalNews, navigation],
  )
  usePreviousProp({ prop: languageCode, onPropChange: onLanguageChange })

  return (
    <News
      newsId={newsId}
      languageCode={languageCode}
      selectedNewsType={LOCAL_NEWS_TYPE}
      navigateToNews={navigateToNews}
      news={data.localNews}
      refresh={refresh}
    />
  )
}

export default LocalNews
