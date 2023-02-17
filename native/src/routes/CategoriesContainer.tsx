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
import usePreviousProp from '../hooks/usePreviousProp'
import useResourceCache from '../hooks/useResourceCache'
import createNavigateToFeedbackModal from '../navigation/createNavigateToFeedbackModal'
import urlFromRouteInformation from '../navigation/url'
import testID from '../testing/testID'
import dataContainer from '../utils/DefaultDataContainer'
import { reportError } from '../utils/sentry'
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
  const resourceCache = useResourceCache({ cityCode, languageCode })
  const resourceCacheUrl = useContext(StaticServerContext)
  const { navigateTo } = useNavigate()

  const { data, refresh, ...response } = useLoadCityContent({ cityCode, languageCode })

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
  const previousLanguageCode = usePreviousProp({ prop: languageCode, onPropChange: onLanguageChange })

  const error =
    data?.categories && !category && previousLanguageCode === languageCode ? ErrorCode.PageNotFound : response.error

  // Workaround clear cache on refresh if city content can't be loaded.
  // TODO IGAPP-1231: Proper cache invalidation for version updates
  const clearResourcesAndCache = useCallback(() => {
    dataContainer.clearInMemoryCache()
    dataContainer.clearOfflineCache().catch(reportError)
    refresh()
  }, [refresh])

  return (
    <LoadingErrorHandler {...response} error={error} refresh={clearResourcesAndCache} scrollView>
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
            resourceCache={resourceCache}
            resourceCacheUrl={resourceCacheUrl}
          />
        </SpaceBetween>
      )}
    </LoadingErrorHandler>
  )
}

export default CategoriesContainer
