import React, { ReactElement, useCallback, useContext } from 'react'
import styled from 'styled-components/native'

import { CATEGORIES_ROUTE, CategoriesRouteType, cityContentPath, ErrorCode } from 'api-client'

import Categories from '../components/Categories'
import DashboardNavigationTiles from '../components/DashboardNavigationTiles'
import SpaceBetween from '../components/SpaceBetween'
import { StaticServerContext } from '../components/StaticServerProvider'
import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import useCityAppContext from '../hooks/useCityAppContext'
import useHeader from '../hooks/useHeader'
import useLoadCityContent from '../hooks/useLoadCityContent'
import useNavigate from '../hooks/useNavigate'
import useOnLanguageChange from '../hooks/useOnLanguageChange'
import createNavigateToFeedbackModal from '../navigation/createNavigateToFeedbackModal'
import urlFromRouteInformation from '../navigation/url'
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

  const { data, ...response } = useLoadCityContent({ cityCode, languageCode })

  const path = route.params.path ?? cityContentPath({ cityCode, languageCode })
  const category = data?.categories.findCategoryByPath(path)
  const availableLanguages =
    category && !category.isRoot() ? Array.from(category.availableLanguages.keys()) : data?.languages.map(it => it.code)

  const shareUrl = urlFromRouteInformation({
    route: CATEGORIES_ROUTE,
    languageCode,
    cityCode,
    cityContentPath: path,
  })
  useHeader({ navigation, route, availableLanguages, data, isHome: !route.params.path, shareUrl })

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

  const error =
    data?.categories && !category && previousLanguageCode === languageCode ? ErrorCode.PageNotFound : response.error

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
