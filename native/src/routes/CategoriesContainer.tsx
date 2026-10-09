import React, { ReactElement, useCallback, useMemo } from 'react'

import { CATEGORIES_ROUTE, CategoriesRouteType, getSlugFromPath, regionContentPath } from 'shared'
import { ErrorCodes } from 'shared/api'
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
  const { regionCode, languageCode } = useRegionAppContext()
  const { data, ...response } = useLoadRegionContent({ regionCode, languageCode })
  const { navigateTo } = useNavigate()

  // Preload search results for fallback language once the content of the current language is loaded
  useLoadRegionContent({
    regionCode,
    languageCode: config.sourceLanguage,
    enabled: !!data && !response.loading && languageCode !== config.sourceLanguage,
  })

  const path = route.params.path ?? regionContentPath({ regionCode, languageCode })
  const category = useMemo(
    () =>
      data?.categories.findCategoryByPath(path) ??
      data?.categories.toArray().find(category => category.slugHistory.includes(getSlugFromPath(path))),
    [data?.categories, path],
  )
  const availableLanguages =
    category && !category.isRoot() ? Object.keys(category.availableLanguages) : data?.languages.map(it => it.code)

  const shareUrl = urlFromRouteInformation({
    route: CATEGORIES_ROUTE,
    languageCode,
    regionCode,
    regionContentPath: category?.path ?? path,
  })
  useHeader({ navigation, route, availableLanguages, data, shareUrl })
  useSetRouteTitle(category?.isRoot() ? data?.region.name : category?.title)

  // The content of the old language is already gone in the render the language changes in
  const previousCategory = usePreviousProp({ prop: category })
  const onLanguageChange = useCallback(
    (newLanguage: string) => {
      if (previousCategory) {
        navigation.setParams({ path: previousCategory.availableLanguages[newLanguage] })
      }
    },
    [previousCategory, navigation],
  )
  const previousLanguageCode = usePreviousProp({ prop: languageCode, onPropChange: onLanguageChange })

  const error =
    data?.categories && !category && previousLanguageCode === languageCode ? ErrorCodes.PageNotFound : response.error

  return (
    <LoadingErrorHandler refresh={response.refresh} loading={response.loading} error={error} scrollView>
      {data && category && (
        <Categories
          navigateTo={navigateTo}
          language={languageCode}
          regionModel={data.region}
          categories={data.categories}
          category={category}
          goBack={navigation.goBack}
        />
      )}
    </LoadingErrorHandler>
  )
}

export default CategoriesContainer
