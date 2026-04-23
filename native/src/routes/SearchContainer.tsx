import React, { ReactElement } from 'react'

import { prepareSearchDocuments, SearchRouteType } from 'shared'
import { config } from 'translations'

import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import useLoadRegionContent from '../hooks/useLoadRegionContent'
import useRegionAppContext from '../hooks/useRegionAppContext'
import LoadingErrorHandler from './LoadingErrorHandler'
import Search from './Search'

export type SearchContainerProps = {
  navigation: NavigationProps<SearchRouteType>
  route: RouteProps<SearchRouteType>
}

const SearchContainer = ({ navigation, route }: SearchContainerProps): ReactElement | null => {
  const { cityCode, languageCode } = useRegionAppContext()
  const initialSearchText = route.params.searchText ?? ''
  const { data, ...response } = useLoadRegionContent({ cityCode, languageCode })
  const { data: sourceLanguageData } = useLoadRegionContent({ cityCode, languageCode: config.sourceLanguage })

  const userLanguageDocuments = prepareSearchDocuments(data?.categories, data?.events, data?.pois)
  const sourceLanguageDocuments =
    languageCode !== config.sourceLanguage
      ? prepareSearchDocuments(sourceLanguageData?.categories, sourceLanguageData?.events, sourceLanguageData?.pois)
      : []

  return (
    <LoadingErrorHandler {...response}>
      {data && (
        <Search
          navigation={navigation}
          cityCode={cityCode}
          userLanguageDocuments={userLanguageDocuments}
          sourceLanguageDocuments={sourceLanguageDocuments}
          languageCode={languageCode}
          initialSearchText={initialSearchText}
        />
      )}
    </LoadingErrorHandler>
  )
}

export default SearchContainer
