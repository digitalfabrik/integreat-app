import React, { ReactElement, useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'styled-components'

import { SearchRouteType } from 'shared'

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
  const theme = useContext(ThemeContext)
  const { t } = useTranslation('search')

  const allPossibleResults = useMemo(
    () => [
      ...(data?.categories.toArray().filter(category => !category.isRoot()) || []),
      ...(data?.events || []),
      ...(data?.pois || []),
    ],
    [data?.categories, data?.events, data?.pois],
  )

  return (
    <LoadingErrorHandler {...response}>
      {data && (
        <SearchModal
          cityCode={cityCode}
          closeModal={navigation.goBack}
          allPossibleResults={allPossibleResults}
          languageCode={languageCode}
          theme={theme}
          t={t}
          initialSearchText={initialSearchText}
        />
      )}
    </LoadingErrorHandler>
  )
}

export default SearchModalContainer
