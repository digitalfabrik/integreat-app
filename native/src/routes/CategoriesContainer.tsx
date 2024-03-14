import notifee from '@notifee/react-native'
import React, { ReactElement, useCallback, useMemo } from 'react'
import { Button, useWindowDimensions } from 'react-native'

import { CATEGORIES_ROUTE, CategoriesRouteType, cityContentPath } from 'shared'
import { ErrorCode } from 'shared/api'

import Categories from '../components/Categories'
import DashboardNavigationTiles from '../components/DashboardNavigationTiles'
import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import buildConfig from '../constants/buildConfig'
import useCityAppContext from '../hooks/useCityAppContext'
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
  const { navigateTo } = useNavigate()

  const { data, ...response } = useLoadCityContent({ cityCode, languageCode })

  const homeRouteTitle = cityDisplayName(data?.city, deviceWidth)
  const path = route.params.path ?? cityContentPath({ cityCode, languageCode })
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

  const error =
    data?.categories && !category && previousLanguageCode === languageCode ? ErrorCode.PageNotFound : response.error

  const displayNotification = async () => {
    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    })

    await notifee.displayNotification({
      title: 'Hello, World',
      body: 'This is a notification',
      android: {
        smallIcon: 'ic_notification',
        color: buildConfig().lightTheme.colors.themeColor,
        channelId,
      },
    })
  }

  return (
    <LoadingErrorHandler refresh={response.refresh} loading={response.loading} error={error} scrollView>
      {data && category && (
        <>
          <Button title='Click me' onPress={displayNotification} />
          {category.isRoot() && (
            <DashboardNavigationTiles cityModel={data.city} languageCode={languageCode} navigateTo={navigateTo} />
          )}
          <Categories
            navigateTo={navigateTo}
            language={languageCode}
            cityModel={data.city}
            categories={data.categories}
            category={category}
            resourceCache={resourceCache}
            goBack={navigation.goBack}
          />
        </>
      )}
    </LoadingErrorHandler>
  )
}

export default CategoriesContainer
