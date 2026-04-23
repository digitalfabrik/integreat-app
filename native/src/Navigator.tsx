import { createStackNavigator, StackHeaderProps } from '@react-navigation/stack'
import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import {
  BOTTOM_TAB_ROUTE,
  BottomTabRouteType,
  CategoriesRouteType,
  CHANGE_LANGUAGE_MODAL_ROUTE,
  SUGGEST_TO_REGION_ROUTE,
  CONSENT_ROUTE,
  IMPRINT_ROUTE,
  FEEDBACK_MODAL_ROUTE,
  IMAGE_VIEW_MODAL_ROUTE,
  INTRO_ROUTE,
  IntroRouteType,
  LANDING_ROUTE,
  LandingRouteType,
  LICENSES_ROUTE,
  PDF_VIEW_MODAL_ROUTE,
  REDIRECT_ROUTE,
  RedirectRouteType,
  SEARCH_ROUTE,
  SETTINGS_ROUTE,
} from 'shared'

import BottomTabNavigator from './BottomTabNavigator'
import Header from './components/Header'
import RedirectContainer from './components/RedirectContainer'
import TransparentHeader from './components/TransparentHeader'
import { ROOT_NAVIGATOR_ID } from './constants'
import { NavigationProps, RouteProps, RoutesParamsType, RoutesType } from './constants/NavigationTypes'
import buildConfig from './constants/buildConfig'
import useLoadRegions from './hooks/useLoadRegions'
import { useAppContext } from './hooks/useRegionAppContext'
import useSnackbar from './hooks/useSnackbar'
import ChangeLanguageModal from './routes/ChangeLanguageModal'
import Consent from './routes/Consent'
import FeedbackModalContainer from './routes/FeedbackModalContainer'
import ImageViewModal from './routes/ImageViewModal'
import ImprintContainer from './routes/ImprintContainer'
import Intro from './routes/Intro'
import Landing from './routes/Landing'
import Licenses from './routes/Licenses'
import LoadingErrorHandler from './routes/LoadingErrorHandler'
import PDFViewModal from './routes/PDFViewModal'
import SearchContainer from './routes/SearchContainer'
import Settings from './routes/Settings'
import SuggestToRegion from './routes/SuggestToRegion'
import dataContainer from './utils/DefaultDataContainer'
import { initSentry, log, reportError } from './utils/sentry'

type HeaderProps = {
  route: RouteProps<RoutesType>
  navigation: NavigationProps<RoutesType>
}

const transparentHeader = (headerProps: StackHeaderProps) => <TransparentHeader {...(headerProps as HeaderProps)} />

export const defaultHeader = (headerProps: StackHeaderProps): ReactElement => (
  <Header {...(headerProps as HeaderProps)} />
)
const settingsHeader = (headerProps: StackHeaderProps) => <Header {...(headerProps as HeaderProps)} showMenu={false} />

const Stack = createStackNavigator<RoutesParamsType>()

type InitialRouteType =
  | {
      name: IntroRouteType | LandingRouteType | CategoriesRouteType | BottomTabRouteType
    }
  | {
      name: RedirectRouteType
      url: string
    }
  | null

const Navigator = (): ReactElement | null => {
  const showSnackbar = useSnackbar()
  const insets = useSafeAreaInsets()
  const appContext = useAppContext()
  const { settings, regionCode, changeRegionCode, updateSettings } = appContext
  const [initialRoute, setInitialRoute] = useState<InitialRouteType>(null)

  // Preload regions
  const { data: regions, error: regionsError, refresh: refreshRegions } = useLoadRegions()

  const updateInitialRoute = useCallback(
    (initialRoute: InitialRouteType) =>
      // Do not override initial route set by opening push notification
      setInitialRoute(previous => (previous?.name === REDIRECT_ROUTE ? previous : initialRoute)),
    [],
  )

  useEffect(() => {
    const { errorTracking, introShown } = settings
    const usingHermes = typeof HermesInternal === 'object' && HermesInternal !== null

    if (usingHermes) {
      log('App is using Hermes: https://reactnative.dev/docs/hermes')
    }

    if (errorTracking) {
      initSentry()
    }

    if (!buildConfig().featureFlags.introSlides && !introShown) {
      updateSettings({ introShown: true })
    }
  }, [updateSettings, settings])

  useEffect(() => {
    if (initialRoute) {
      return
    }
    if (buildConfig().featureFlags.introSlides && !settings.introShown) {
      updateInitialRoute({ name: INTRO_ROUTE })
    } else if (!regionCode) {
      updateInitialRoute({ name: LANDING_ROUTE })
    } else if (regions?.find(it => it.code === regionCode)) {
      updateInitialRoute({ name: BOTTOM_TAB_ROUTE })
    } else if (regions) {
      // Region is not available anymore
      changeRegionCode(null)
      showSnackbar({ text: 'notFound.region' })
      dataContainer.deleteRegion(regionCode).catch(reportError)
      updateInitialRoute({ name: LANDING_ROUTE })
    }
  }, [regions, changeRegionCode, regionCode, showSnackbar, settings, initialRoute, updateInitialRoute])

  if (!initialRoute) {
    return regionsError ? <LoadingErrorHandler error={regionsError} loading={false} refresh={refreshRegions} /> : null
  }

  const redirectUrl = initialRoute.name === REDIRECT_ROUTE ? initialRoute.url : undefined

  return (
    <Stack.Navigator
      id={ROOT_NAVIGATOR_ID}
      initialRouteName={initialRoute.name}
      screenOptions={{ headerMode: 'screen', animation: 'none', cardStyle: { paddingBottom: insets.bottom } }}>
      <Stack.Group screenOptions={{ header: () => null }}>
        <Stack.Screen name={REDIRECT_ROUTE} initialParams={{ url: redirectUrl }} component={RedirectContainer} />
        <Stack.Screen name={INTRO_ROUTE} component={Intro} />
        <Stack.Screen name={SEARCH_ROUTE} component={SearchContainer} />
        <Stack.Screen
          name={BOTTOM_TAB_ROUTE}
          component={BottomTabNavigator}
          options={{ cardStyle: { paddingBottom: 0 } }}
        />
      </Stack.Group>

      <Stack.Group screenOptions={{ header: defaultHeader }}>
        <Stack.Screen name={IMPRINT_ROUTE} component={ImprintContainer} />
        <Stack.Screen name={FEEDBACK_MODAL_ROUTE} component={FeedbackModalContainer} />
        <Stack.Screen name={LANDING_ROUTE} component={Landing} />
      </Stack.Group>

      <Stack.Group screenOptions={{ header: transparentHeader }}>
        <Stack.Screen name={PDF_VIEW_MODAL_ROUTE} component={PDFViewModal} />
        <Stack.Screen name={CHANGE_LANGUAGE_MODAL_ROUTE} component={ChangeLanguageModal} />
        <Stack.Screen name={IMAGE_VIEW_MODAL_ROUTE} component={ImageViewModal} />
        {buildConfig().featureFlags.suggestToRegion && (
          <Stack.Screen name={SUGGEST_TO_REGION_ROUTE} component={SuggestToRegion} />
        )}
      </Stack.Group>

      <Stack.Group screenOptions={{ header: settingsHeader }}>
        <Stack.Screen name={SETTINGS_ROUTE} component={Settings} />
        <Stack.Screen name={LICENSES_ROUTE} component={Licenses} />
        <Stack.Screen name={CONSENT_ROUTE} component={Consent} />
      </Stack.Group>
    </Stack.Navigator>
  )
}

export default Navigator
