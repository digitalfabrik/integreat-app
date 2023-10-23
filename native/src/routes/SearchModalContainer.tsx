import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { SearchRouteType } from 'api-client'

import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import useCityAppContext from '../hooks/useCityAppContext'
import useLoadCityContent from '../hooks/useLoadCityContent'
import useNavigate from '../hooks/useNavigate'
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
  const { t } = useTranslation('search')
  const { navigateTo } = useNavigate()

  return (
    <LoadingErrorHandler {...response}>
      {data && (
        <SearchModal
          cityCode={cityCode}
          navigateTo={navigateTo}
          closeModal={navigation.goBack}
          categories={data.categories}
          languageCode={languageCode}
          t={t}
          initialSearchText={initialSearchText}
        />
      )}
    </LoadingErrorHandler>
  )
}

export default SearchModalContainer
