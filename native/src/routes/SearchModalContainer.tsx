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
  const { data, loading, ...response } = useLoadCityContent({ cityCode, languageCode })
  const theme = useContext(ThemeContext)
  const { t } = useTranslation('search')

  const allPossibleResults = useMemo(
    () => [
      ...(data?.categories
        .toArray()
        .filter(category => !category.isRoot())
        .map(category => ({
          title: category.title,
          content: category.content,
          path: category.path,
          id: category.path,
          thumbnail: category.thumbnail,
        })) ?? []),
      ...(data?.events.map(event => ({
        title: event.title,
        content: event.content,
        path: event.path,
        id: event.path,
        thumbnail: event.thumbnail,
      })) ?? []),
      ...(data?.pois.map(poi => ({
        title: poi.title,
        content: poi.content,
        path: poi.path,
        id: poi.path,
        thumbnail: poi.thumbnail,
      })) ?? []),
    ],
    [data?.categories, data?.events, data?.pois],
  )

  return (
    <LoadingErrorHandler {...response} loading={loading}>
      {data && (
        <SearchModal
          cityCode={cityCode}
          closeModal={navigation.goBack}
          allPossibleResults={allPossibleResults}
          languageCode={languageCode}
          theme={theme}
          t={t}
          initialSearchText={initialSearchText}
          loading={loading}
        />
      )}
    </LoadingErrorHandler>
  )
}

export default SearchModalContainer
