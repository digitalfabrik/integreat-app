import React, { ReactElement } from 'react'

import { LOCAL_NEWS_TYPE, NEWS_ROUTE, NewsRouteType } from 'shared'

import News from '../components/News'
import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import useHeader from '../hooks/useHeader'
import { CityContentData } from '../hooks/useLoadCityContent'
import urlFromRouteInformation from '../navigation/url'
import cityDisplayName from '../utils/cityDisplayName'

type LocalNewsProps = {
  route: RouteProps<NewsRouteType>
  navigation: NavigationProps<NewsRouteType>
  newsId: string | null
  data: CityContentData
  navigateToNews: (newsId: string) => void
  refresh: () => void
}

const LocalNews = ({ route, navigation, data, newsId, navigateToNews, refresh }: LocalNewsProps): ReactElement => {
  const cityCode = data.city.code
  const languageCode = data.language.code

  const availableLanguages = newsId ? [languageCode] : data.languages.map(it => it.code)
  const shareUrl = urlFromRouteInformation({
    route: NEWS_ROUTE,
    cityCode,
    languageCode,
    newsType: LOCAL_NEWS_TYPE,
    newsId: newsId ?? undefined,
  })
  const cityName = cityDisplayName(data.city)
  useHeader({ navigation, route, availableLanguages, data, shareUrl })

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
