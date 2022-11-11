import React, { ReactElement, useCallback, useContext } from 'react'
import styled from 'styled-components/native'

import { CATEGORIES_ROUTE, CategoriesRouteType, cityContentPath, ErrorCode, NotFoundError } from 'api-client'

import Categories from '../components/Categories'
import DashboardNavigationTiles from '../components/DashboardNavigationTiles'
import LanguageNotAvailablePage from '../components/LanguageNotAvailablePage'
import SpaceBetween from '../components/SpaceBetween'
import { StaticServerContext } from '../components/StaticServerProvider'
import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import useCityAppContext from '../hooks/useCityAppContext'
import useHeader from '../hooks/useHeader'
import useLoadCategories from '../hooks/useLoadCategories'
import useNavigate from '../hooks/useNavigate'
import useOnLanguageChange from '../hooks/useOnLanguageChange'
import useSetShareUrl from '../hooks/useSetShareUrl'
import createNavigateToFeedbackModal from '../navigation/createNavigateToFeedbackModal'
import testID from '../testing/testID'
import LoadingErrorHandler from './LoadingErrorHandler'

const Spacing = styled.View`
  padding: 10px;
`

type CategoriesContainerProps = {
  route: RouteProps<CategoriesRouteType>
  navigation: NavigationProps<CategoriesRouteType>
}

const CategoriesContainer = ({ navigation, route }: CategoriesContainerProps): ReactElement => {
  const { cityCode, languageCode } = useCityAppContext()
  const resourceCacheUrl = useContext(StaticServerContext)
  const { navigateTo } = useNavigate()

  const response = useLoadCategories({ cityCode, languageCode })
  const { data } = response

  const path = route.params.path ?? cityContentPath({ cityCode, languageCode })
  const category = data?.categories.findCategoryByPath(path)
  const availableLanguages =
    category && !category.isRoot() ? Array.from(category.availableLanguages.keys()) : data?.languages.map(it => it.code)

  useHeader({ navigation, route, availableLanguages, languages: data?.languages, languageCode, city: data?.city })

  const onLanguageChange = useCallback(
    (newLanguage: string) => {
      if (category) {
        const newPath = category.availableLanguages.get(newLanguage)
        // TODO IGAPP-636: Handle language not available?
        navigation.setParams({ path: newPath })
      }
    },
    [category, navigation]
  )
  const previousLanguageCode = useOnLanguageChange({ languageCode, onLanguageChange })
  useSetShareUrl({
    navigation,
    route,
    routeInformation: {
      route: CATEGORIES_ROUTE,
      languageCode,
      cityCode,
      cityContentPath: path,
    },
  })

  if (response.errorCode === ErrorCode.LanguageUnavailable) {
    return <LanguageNotAvailablePage />
  }

  const error =
    data?.categories && !category && previousLanguageCode === languageCode
      ? new NotFoundError({ id: path, type: 'category', city: cityCode, language: languageCode })
      : response.error

  return (
    <LoadingErrorHandler {...response} error={error} scrollView>
      {data && category && (
        <SpaceBetween {...(category.isRoot() ? testID('Dashboard-Page') : {})}>
          {category.isRoot() ? (
            <DashboardNavigationTiles cityModel={data.city} languageCode={languageCode} navigateTo={navigateTo} />
          ) : (
            <Spacing />
          )}
          <Categories
            navigateTo={navigateTo}
            navigateToFeedback={createNavigateToFeedbackModal(navigation)}
            language={languageCode}
            cityModel={data.city}
            categories={data.categories}
            category={category}
            resourceCache={data.resourceCache}
            resourceCacheUrl={resourceCacheUrl}
          />
        </SpaceBetween>
      )}
    </LoadingErrorHandler>
  )
}

export default CategoriesContainer
