import React, { ReactElement, useCallback, useMemo } from 'react'
import { useWindowDimensions } from 'react-native'

import { CATEGORIES_ROUTE, CategoriesRouteType, cityContentPath, ErrorCode } from 'api-client'

import Categories from '../components/Categories'
import DashboardNavigationTiles from '../components/DashboardNavigationTiles'
import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import useCityAppContext from '../hooks/useCityAppContext'
import useEmbeddedOffer from '../hooks/useEmbeddedOffer'
import useHeader from '../hooks/useHeader'
import useLoadCityContent from '../hooks/useLoadCityContent'
import useNavigate from '../hooks/useNavigate'
import usePreviousProp from '../hooks/usePreviousProp'
import useResourceCache from '../hooks/useResourceCache'
import useSetRouteTitle from '../hooks/useSetRouteTitle'
import urlFromRouteInformation from '../navigation/url'
import cityDisplayName from '../utils/cityDisplayName'
import LoadingErrorHandler from './LoadingErrorHandler'

type CategoriesContainerProps = {
  route: RouteProps<CategoriesRouteType>
  navigation: NavigationProps<CategoriesRouteType>
}

const CategoriesContainer = ({ navigation, route }: CategoriesContainerProps): ReactElement => {
  const { cityCode, languageCode } = useCityAppContext()
  const deviceWidth = useWindowDimensions().width
  const resourceCache = useResourceCache({ cityCode, languageCode })
  const path = route.params.path ?? cityContentPath({ cityCode, languageCode })
  const { navigateTo } = useNavigate()

  const { data, ...response } = useLoadCityContent({ cityCode, languageCode })

  const homeRouteTitle = cityDisplayName(data?.city, deviceWidth)
  const category = useMemo(() => data?.categories.findCategoryByPath(path), [data?.categories, path])
  const availableLanguages =
    category && !category.isRoot() ? Array.from(category.availableLanguages.keys()) : data?.languages.map(it => it.code)

  const shareUrl = urlFromRouteInformation({
    route: CATEGORIES_ROUTE,
    languageCode,
    cityCode,
    cityContentPath: path,
  })
  useHeader({ navigation, route, availableLanguages, data, shareUrl })
  useSetRouteTitle({ navigation, title: category?.isRoot() ? homeRouteTitle : category?.title })

  const onLanguageChange = useCallback(
    (newLanguage: string) => {
      if (category) {
        const newPath = category.availableLanguages.get(newLanguage)
        navigation.setParams({ path: newPath })
      }
    },
    [category, navigation],
  )
  const previousLanguageCode = usePreviousProp({ prop: languageCode, onPropChange: onLanguageChange })

  const { extra, ...combinedResponse } = useEmbeddedOffer({
    category,
    cityCode,
    languageCode,
    cityContentResponse: response,
  })

  const error =
    data?.categories && !category && previousLanguageCode === languageCode
      ? ErrorCode.PageNotFound
      : combinedResponse.error

  return (
    <LoadingErrorHandler refresh={combinedResponse.refresh} loading={combinedResponse.loading} error={error} scrollView>
      {data && category && (
        <>
          {category.isRoot() && (
            <DashboardNavigationTiles cityModel={data.city} languageCode={languageCode} navigateTo={navigateTo} />
          )}
          <Categories
            navigateTo={navigateTo}
            language={languageCode}
            cityModel={data.city}
            categories={data.categories}
            category={category}
            extra={extra}
            resourceCache={resourceCache}
          />
        </>
      )}
    </LoadingErrorHandler>
  )
}

export default CategoriesContainer
