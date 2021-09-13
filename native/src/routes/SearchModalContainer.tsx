import React, { ReactElement, useCallback, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { ThemeContext } from 'styled-components'

import { SearchRouteType, CategoriesMapModel } from 'api-client'

import { NavigationPropType, RoutePropType } from '../constants/NavigationTypes'
import createNavigate from '../navigation/createNavigate'
import navigateToLink from '../navigation/navigateToLink'
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
    state => state?.cityContent?.searchRoute?.categoriesMap ?? null
  )
  const dispatch = useDispatch()
  const theme = useContext(ThemeContext)
  const { t } = useTranslation('search')
  const navigateToLinkProp = useCallback(
    (url: string, language: string, shareUrl: string) => {
      const navigateTo = createNavigate(dispatch, navigation)
      navigateToLink(url, navigation, language, navigateTo, shareUrl)
    },
    [dispatch, navigation]
  )

  const closeModal = () => {
    navigation.goBack()
  }

  return cityCode ? (
    <SearchModal
      cityCode={cityCode}
      navigateToLink={navigateToLinkProp}
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
