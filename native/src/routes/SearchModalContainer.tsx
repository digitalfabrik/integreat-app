import React, { ReactElement, useCallback, useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'styled-components'

import { SearchRouteType } from 'shared'
import { loadSprungbrettJobs } from 'shared/api'

import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import useCityAppContext from '../hooks/useCityAppContext'
import useLoadCityContent from '../hooks/useLoadCityContent'
import useLoadExtraCityContent from '../hooks/useLoadExtraCityContent'
import useNavigate from '../hooks/useNavigate'
import { determineApiUrl } from '../utils/helpers'
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
  const { navigateTo } = useNavigate()
  const loadOffers = useCallback(
    () => loadSprungbrettJobs({ cityCode, languageCode, baseUrl: determineApiUrl }),
    [cityCode, languageCode],
  )
  const { data: offerData, loading } = useLoadExtraCityContent({ cityCode, languageCode, load: loadOffers })

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
      })) ?? []),
      ...(offerData?.extra.sprungbrettJobs.map(offer => ({
        title: offer.title,
        location: offer.location,
        url: offer.url,
        id: offer.url,
      })) ?? []),
    ],
    [data?.categories, data?.events, offerData?.extra.sprungbrettJobs],
  )

  return (
    <LoadingErrorHandler {...response}>
      {data && (
        <SearchModal
          cityCode={cityCode}
          navigateTo={navigateTo}
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
