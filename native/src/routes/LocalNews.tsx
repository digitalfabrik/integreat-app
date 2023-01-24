import React, { ReactElement } from 'react'

import { LOCAL_NEWS_TYPE, NEWS_ROUTE, NewsRouteType } from 'api-client'

import News from '../components/News'
import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import useHeader from '../hooks/useHeader'
import { CityContentData } from '../hooks/useLoadCityContent'
import useLoadLocalNews from '../hooks/useLoadLocalNews'
import urlFromRouteInformation from '../navigation/url'
import LoadingErrorHandler from './LoadingErrorHandler'

type LocalNewsProps = {
  route: RouteProps<NewsRouteType>
  navigation: NavigationProps<NewsRouteType>
  newsId: string | null
  data: CityContentData
  selectNews: (newsId: string | null) => void
}

const LocalNews = ({ route, navigation, data, newsId, selectNews }: LocalNewsProps): ReactElement => {
  const cityCode = data.city.code
  const languageCode = data.language.code
  const { data: localNews, ...response } = useLoadLocalNews({ cityCode, languageCode })

  const availableLanguages = newsId ? [languageCode] : data.languages.map(it => it.code)
  const shareUrl = urlFromRouteInformation({
    route: NEWS_ROUTE,
    cityCode,
    languageCode,
    newsType: LOCAL_NEWS_TYPE,
    newsId: newsId ?? undefined,
  })
  useHeader({ navigation, route, availableLanguages, data, shareUrl })

  return (
    <LoadingErrorHandler {...response}>
      {localNews && (
        <News
          newsId={newsId}
          languageCode={languageCode}
          selectedNewsType={LOCAL_NEWS_TYPE}
          selectNews={selectNews}
          news={localNews}
          refresh={response.refresh}
        />
      )}
    </LoadingErrorHandler>
  )
}

export default LocalNews
