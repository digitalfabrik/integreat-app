import React, { ReactElement, useCallback, useMemo } from 'react'

import { CATEGORIES_ROUTE, CategoriesRouteType, cityContentPath } from 'shared'
import { ErrorCode } from 'shared/api'
import { config } from 'translations'

import Categories from '../components/Categories'
import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import useHeader from '../hooks/useHeader'
import useLoadRegionContent from '../hooks/useLoadRegionContent'
import useNavigate from '../hooks/useNavigate'
import usePreviousProp from '../hooks/usePreviousProp'
import useRegionAppContext from '../hooks/useRegionAppContext'
import useSetRouteTitle from '../hooks/useSetRouteTitle'
import urlFromRouteInformation from '../utils/url'
import LoadingErrorHandler from './LoadingErrorHandler'

type CategoriesContainerProps = {
  route: RouteProps<CategoriesRouteType>
  navigation: NavigationProps<CategoriesRouteType>
}

const CategoriesContainer = ({ navigation, route }: CategoriesContainerProps): ReactElement => {
  const { cityCode, languageCode } = useRegionAppContext()
  const { navigateTo } = useNavigate()

  const { data, ...response } = useLoadRegionContent({ cityCode, languageCode })
  // Preload search results for fallback language
  useLoadRegionContent({ cityCode, languageCode: config.sourceLanguage })

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
  useSetRouteTitle({ navigation, title: category?.isRoot() ? data?.city.name : category?.title })

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
