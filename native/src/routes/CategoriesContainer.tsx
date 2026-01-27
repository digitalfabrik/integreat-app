import React, { ReactElement, useCallback, useMemo } from 'react'
import { useWindowDimensions } from 'react-native'

import { CATEGORIES_ROUTE, CategoriesRouteType, cityContentPath } from 'shared'
import { ErrorCode } from 'shared/api'
import { config } from 'translations'

import Categories from '../components/Categories'
import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import useCityAppContext from '../hooks/useCityAppContext'
import useHeader from '../hooks/useHeader'
import useLoadCityContent from '../hooks/useLoadCityContent'
import useNavigate from '../hooks/useNavigate'
import usePreviousProp from '../hooks/usePreviousProp'
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
  const { navigateTo } = useNavigate()

  const { data, ...response } = useLoadCityContent({ cityCode, languageCode })
  // Preload search results for fallback language
  useLoadCityContent({ cityCode, languageCode: config.sourceLanguage })

  const homeRouteTitle = cityDisplayName(data?.city, deviceWidth)
  const path = route.params.path ?? cityContentPath({ cityCode, languageCode })
  const category = useMemo(() => data?.categories.findCategoryByPath(path), [data?.categories, path])
  const availableLanguages =
    category && !category.isRoot() ? Object.keys(category.availableLanguages) : data?.languages.map(it => it.code)

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
        navigation.setParams({ path: category.availableLanguages[newLanguage] })
      }
    },
    [category, navigation],
  )
  const previousLanguageCode = usePreviousProp({ prop: languageCode, onPropChange: onLanguageChange })

  const error =
    data?.categories && !category && previousLanguageCode === languageCode ? ErrorCode.PageNotFound : response.error

  return (
    <LoadingErrorHandler refresh={response.refresh} loading={response.loading} error={error} scrollView>
      {data && category && (
        <Categories
          navigateTo={navigateTo}
          language={languageCode}
          cityModel={data.city}
          categories={data.categories}
          category={category}
          goBack={navigation.goBack}
        />
      )}
    </LoadingErrorHandler>
  )
}

export default CategoriesContainer
