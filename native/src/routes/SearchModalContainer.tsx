import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'styled-components'

import { SearchRouteType } from 'api-client'

import { NavigationProps } from '../constants/NavigationTypes'
import useCityAppContext from '../hooks/useCityAppContext'
import useLoadCategories from '../hooks/useLoadCategories'
import useNavigate from '../hooks/useNavigate'
import LoadingErrorHandler from './LoadingErrorHandler'
import SearchModal from './SearchModal'

export type SearchModalContainerProps = {
  navigation: NavigationProps<SearchRouteType>
}

const SearchModalContainer = ({ navigation }: SearchModalContainerProps): ReactElement | null => {
  const { cityCode, languageCode } = useCityAppContext()
  const { data, ...response } = useLoadCategories({ cityCode, languageCode })
  const theme = useContext(ThemeContext)
  const { t } = useTranslation('search')
  const { navigateTo } = useNavigate()

  return (
    <LoadingErrorHandler {...response} scrollView>
      {data && (
        <SearchModal
          cityCode={cityCode}
          navigateTo={navigateTo}
          closeModal={navigation.goBack}
          categories={data.categories}
          language={languageCode}
          theme={theme}
          t={t}
        />
      )}
    </LoadingErrorHandler>
  )
}

export default SearchModalContainer
