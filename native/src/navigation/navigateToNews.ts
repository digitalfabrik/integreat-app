import { NewsType, NEWS_ROUTE } from 'api-client/src/routes'

import { NavigationProps, RoutesType } from '../constants/NavigationTypes'

const navigateToNews = <T extends RoutesType>({
  navigation,
  cityCode,
  languageCode,
  type,
  newsId,
}: {
  navigation: NavigationProps<T>
  cityCode: string
  languageCode: string
  type: NewsType
  newsId: string | null | undefined
}): void => {
  navigation.navigate({
    name: NEWS_ROUTE,
    params: {
      cityCode,
      languageCode,
      newsId: newsId ?? null,
      newsType: type,
    },
  })
}

export default navigateToNews
