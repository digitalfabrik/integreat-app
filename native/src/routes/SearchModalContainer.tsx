import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { ThemeContext } from 'styled-components'

import { CategoriesMapModel, SearchRouteType } from 'api-client'

import { NavigationPropType, RoutePropType } from '../constants/NavigationTypes'
import createNavigate from '../navigation/createNavigate'
import { StateType } from '../redux/StateType'
import SearchModal from './SearchModal'

export type PropsType = {
  route: RoutePropType<SearchRouteType>
  navigation: NavigationPropType<SearchRouteType>
}

const SearchModalContainer = ({ navigation }: PropsType): ReactElement | null => {
  const cityCode = useSelector<StateType, string | undefined>(state => state.cityContent?.city)
  const language = useSelector<StateType, string>(state => state.contentLanguage)
  const categories = useSelector<StateType, CategoriesMapModel | null>(
    state => state.cityContent?.searchRoute?.categoriesMap ?? null
  )
  const dispatch = useDispatch()
  const theme = useContext(ThemeContext)
  const { t } = useTranslation('search')

  const closeModal = () => {
    navigation.goBack()
  }

  return cityCode ? (
    <SearchModal
      cityCode={cityCode}
      navigateTo={createNavigate(dispatch, navigation)}
      closeModal={closeModal}
      categories={categories}
      language={language}
      theme={theme}
      t={t}
    />
  ) : null
}

export default SearchModalContainer
