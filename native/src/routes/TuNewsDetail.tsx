import React, { ReactElement } from 'react'

import { NEWS_ROUTE, NewsRouteType, TU_NEWS_TYPE } from 'api-client'

import News from '../components/News'
import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import useHeader from '../hooks/useHeader'
import { CityContentData } from '../hooks/useLoadCityContent'
import useLoadTuNewsElement from '../hooks/useLoadTuNewsElement'
import urlFromRouteInformation from '../navigation/url'
import LoadingErrorHandler from './LoadingErrorHandler'

type TuNewsProps = {
  route: RouteProps<NewsRouteType>
  navigation: NavigationProps<NewsRouteType>
  newsId: string
  data: CityContentData<unknown>
  selectNews: (newsId: string | null) => void
}

const TuNewsNews = ({ route, navigation, data, selectNews, newsId }: TuNewsProps): ReactElement => {
  const cityCode = data.city.code
  const languageCode = data.language.code
  const { data: tuNews, ...response } = useLoadTuNewsElement({ newsId })

  const shareUrl = urlFromRouteInformation({
    route: NEWS_ROUTE,
    cityCode,
    languageCode,
    newsType: TU_NEWS_TYPE,
    newsId,
  })
  useHeader({ navigation, route, availableLanguages: [languageCode], data, shareUrl })

  return (
    <LoadingErrorHandler {...response}>
      {tuNews && (
        <News
          newsId={newsId}
          languageCode={languageCode}
          selectedNewsType={TU_NEWS_TYPE}
          selectNews={selectNews}
          news={tuNews}
          refresh={response.refresh}
        />
      )}
    </LoadingErrorHandler>
  )
}

export default TuNewsNews
