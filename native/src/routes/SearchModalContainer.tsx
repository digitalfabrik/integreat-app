import React, { ReactElement } from 'react'

import { SearchRouteType } from 'shared'
import { formatPossibleSearchResults } from 'shared/hooks/useSearch'
import { config } from 'translations'

import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import useCityAppContext from '../hooks/useCityAppContext'
import useLoadCityContent from '../hooks/useLoadCityContent'
import LoadingErrorHandler from './LoadingErrorHandler'
import SearchModal from './SearchModal'

export type SearchModalContainerProps = {
  navigation: NavigationProps<SearchRouteType>
  route: RouteProps<SearchRouteType>
}

const SearchModalContainer = ({ navigation, route }: SearchModalContainerProps): ReactElement | null => {
  const { cityCode, languageCode } = useCityAppContext()
  const initialSearchText = route.params.searchText ?? ''
  const { data, ...response } = useLoadCityContent({ cityCode, languageCode })
  const { data: fallbackData } = useLoadCityContent({ cityCode, languageCode: config.sourceLanguage })

  const allPossibleContentLanguageResults = formatPossibleSearchResults(data?.categories, data?.events, data?.pois)

  const allPossibleFallbackLanguageResults = formatPossibleSearchResults(
    fallbackData?.categories,
    fallbackData?.events,
    fallbackData?.pois,
  )

  return (
    <LoadingErrorHandler {...response}>
      {data && (
        <SearchModal
          cityCode={cityCode}
          closeModal={navigation.goBack}
          allPossibleContentLanguageResults={allPossibleContentLanguageResults}
          allPossibleFallbackLanguageResults={allPossibleFallbackLanguageResults}
          languageCode={languageCode}
          initialSearchText={initialSearchText}
        />
      )}
    </LoadingErrorHandler>
  )
}

export default SearchModalContainer
