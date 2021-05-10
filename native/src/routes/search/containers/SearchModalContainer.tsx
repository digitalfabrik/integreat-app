import SearchModal from '../components/SearchModal'
import { useTranslation } from 'react-i18next'
import type { NavigationPropType, RoutePropType } from '../../../modules/app/constants/NavigationTypes'
import navigateToLink from '../../../modules/navigation/navigateToLink'
import React, { useCallback, useContext } from 'react'
import type { SearchRouteType } from 'api-client/src/routes'
import createNavigate from '../../../modules/navigation/createNavigate'
import { ThemeContext } from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
export type PropsType = {
  route: RoutePropType<SearchRouteType>
  navigation: NavigationPropType<SearchRouteType>
}

const SearchModalContainer = ({ navigation }: PropsType) => {
  const cityCode = useSelector(state => state.cityContent?.city)
  const language = useSelector(state => state.contentLanguage)
  const categories = useSelector(state => state.cityContent?.searchRoute?.categoriesMap)
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

  const closeModal = (query: string) => {
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
