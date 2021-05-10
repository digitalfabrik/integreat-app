import SearchModal from '../components/SearchModal'
import { useTranslation } from 'react-i18next'
import { NavigationPropType, RoutePropType } from '../../../modules/app/constants/NavigationTypes'
import navigateToLink from '../../../modules/navigation/navigateToLink'
import React, { useCallback, useContext } from 'react'
import { SearchRouteType } from 'api-client/src/routes'
import createNavigate from '../../../modules/navigation/createNavigate'
import { ThemeContext } from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { StateType } from '../../../modules/app/StateType'
import { CategoriesMapModel } from 'api-client/dist/src'

export type PropsType = {
  route: RoutePropType<SearchRouteType>
  navigation: NavigationPropType<SearchRouteType>
}

const SearchModalContainer = ({ navigation }: PropsType) => {
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
