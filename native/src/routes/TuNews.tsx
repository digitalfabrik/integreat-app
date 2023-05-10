import React, { ReactElement } from 'react'

import { ErrorCode, NEWS_ROUTE, NewsRouteType, TU_NEWS_TYPE } from 'api-client'

import News from '../components/News'
import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import useHeader from '../hooks/useHeader'
import { CityContentData } from '../hooks/useLoadCityContent'
import useLoadTuNews from '../hooks/useLoadTuNews'
import urlFromRouteInformation from '../navigation/url'
import LoadingErrorHandler from './LoadingErrorHandler'

type TuNewsProps = {
  route: RouteProps<NewsRouteType>
  navigation: NavigationProps<NewsRouteType>
  data: CityContentData
  navigateToNews: (newsId: string) => void
}

const TuNews = ({ route, navigation, data, navigateToNews }: TuNewsProps): ReactElement => {
  const cityCode = data.city.code
  const languageCode = data.language.code
  const {
    data: tuNews,
    availableLanguages,
    loadMore,
    loadingMore,
    ...response
  } = useLoadTuNews({ language: languageCode })

  const availableLanguageCodes = availableLanguages?.map(it => it.code)
  const shareUrl = urlFromRouteInformation({ route: NEWS_ROUTE, cityCode, languageCode, newsType: TU_NEWS_TYPE })
  useHeader({ navigation, route, availableLanguages: availableLanguageCodes, data, shareUrl })

  const error =
    availableLanguageCodes && !availableLanguageCodes.find(it => it === languageCode)
      ? ErrorCode.LanguageUnavailable
      : response.error

  return (
    <LoadingErrorHandler {...response} error={error} availableLanguages={availableLanguages ?? undefined}>
      {tuNews && (
        <News
          languageCode={languageCode}
          selectedNewsType={TU_NEWS_TYPE}
          navigateToNews={navigateToNews}
          news={tuNews}
          refresh={response.refresh}
          loadingMore={loadingMore}
          loadMore={loadMore}
          newsId={null}
        />
      )}
    </LoadingErrorHandler>
  )
}

export default TuNews
