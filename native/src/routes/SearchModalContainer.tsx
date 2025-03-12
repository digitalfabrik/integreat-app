import React, { ReactElement } from 'react'

import { prepareSearchDocuments, SearchRouteType } from 'shared'
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

  const documents = prepareSearchDocuments(data?.categories, data?.events, data?.pois)
  const fallbackLanguageDocuments =
    languageCode !== config.sourceLanguage
      ? prepareSearchDocuments(fallbackData?.categories, fallbackData?.events, fallbackData?.pois)
      : []

  return (
    <LoadingErrorHandler {...response}>
      {data && (
        <SearchModal
          cityCode={cityCode}
          closeModal={navigation.goBack}
          documents={documents}
          fallbackLanguageDocuments={fallbackLanguageDocuments}
          languageCode={languageCode}
          initialSearchText={initialSearchText}
        />
      )}
    </LoadingErrorHandler>
  )
}

export default SearchModalContainer
