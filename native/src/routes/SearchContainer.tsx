import React, { ReactElement } from 'react'

import { prepareSearchDocuments, SearchRouteType } from 'shared'
import { config } from 'translations'

import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import useCityAppContext from '../hooks/useCityAppContext'
import useLoadCityContent from '../hooks/useLoadCityContent'
import LoadingErrorHandler from './LoadingErrorHandler'
import Search from './Search'

export type SearchContainerProps = {
  navigation: NavigationProps<SearchRouteType>
  route: RouteProps<SearchRouteType>
}

const SearchContainer = ({ navigation, route }: SearchContainerProps): ReactElement | null => {
  const { cityCode, languageCode } = useCityAppContext()
  const initialSearchText = route.params.searchText ?? ''
  const { data, ...response } = useLoadCityContent({ cityCode, languageCode })
  const { data: fallbackData } = useLoadCityContent({ cityCode, languageCode: config.sourceLanguage })

  const documents = prepareSearchDocuments(data?.categories, data?.events, data?.pois)
  const fallbackLanguageDocuments =
    languageCode !== config.sourceLanguage
      ? prepareSearchDocuments(fallbackData?.categories, fallbackData?.events, fallbackData?.pois)
      : []

  return (
    <LoadingErrorHandler {...response}>
      {data && (
        <Search
          navigation={navigation}
          cityCode={cityCode}
          documents={documents}
          fallbackLanguageDocuments={fallbackLanguageDocuments}
          languageCode={languageCode}
          initialSearchText={initialSearchText}
        />
      )}
    </LoadingErrorHandler>
  )
}

export default SearchContainer
