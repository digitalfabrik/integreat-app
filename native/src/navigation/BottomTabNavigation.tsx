import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import React, { ReactElement, useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useWindowDimensions } from 'react-native'
import { NavigationProps, RoutesParamsType } from 'src/constants/NavigationTypes'
import { DefaultTheme, useTheme } from 'styled-components/native'

import {
  BottomTabNavigationRouteType,
  CATEGORIES_ROUTE,
  EVENTS_ROUTE,
  LOCAL_NEWS_TYPE,
  NEWS_ROUTE,
  POIS_ROUTE,
} from 'shared'

import { defaultHeader } from '../Navigator'
import { SignPostIcon } from '../assets'
import Icon from '../components/base/Icon'
import Text from '../components/base/Text'
import buildConfig from '../constants/buildConfig'
import useCityAppContext from '../hooks/useCityAppContext'
import useLoadCityContent from '../hooks/useLoadCityContent'
import useSetRouteTitle from '../hooks/useSetRouteTitle'
import CategoriesContainer from '../routes/CategoriesContainer'
import EventsContainer from '../routes/EventsContainer'
import LoadingErrorHandler from '../routes/LoadingErrorHandler'
import NewsContainer from '../routes/NewsContainer'
import PoisContainer from '../routes/PoisContainer'
import cityDisplayName from '../utils/cityDisplayName'
import getTransitionPreset from '../utils/getTransitionPreset'

const Tab = createBottomTabNavigator<RoutesParamsType>()
const CategoriesStack = createStackNavigator<RoutesParamsType>()
const PoisStack = createStackNavigator<RoutesParamsType>()
const EventsStack = createStackNavigator<RoutesParamsType>()
const NewsStack = createStackNavigator<RoutesParamsType>()

const transitionPreset = getTransitionPreset()

const CategoriesStackScreen = () => (
  <CategoriesStack.Navigator screenOptions={{ header: defaultHeader, ...transitionPreset }}>
    <CategoriesStack.Screen name={CATEGORIES_ROUTE} initialParams={{}} component={CategoriesContainer} />
  </CategoriesStack.Navigator>
)

const PoisStackScreen = () => (
  <PoisStack.Navigator screenOptions={{ header: defaultHeader, ...transitionPreset }}>
    <PoisStack.Screen name={POIS_ROUTE} initialParams={{}} component={PoisContainer} />
  </PoisStack.Navigator>
)

const EventsStackScreen = () => (
  <EventsStack.Navigator screenOptions={{ header: defaultHeader, ...transitionPreset }}>
    <EventsStack.Screen name={EVENTS_ROUTE} initialParams={{}} component={EventsContainer} />
  </EventsStack.Navigator>
)

const NewsStackScreen = () => (
  <NewsStack.Navigator screenOptions={{ header: defaultHeader, ...transitionPreset }}>
    <NewsStack.Screen
      name={NEWS_ROUTE}
      initialParams={{ newsId: null, newsType: LOCAL_NEWS_TYPE }}
      component={NewsContainer}
    />
  </NewsStack.Navigator>
)

const createTabIcon =
  (iconSource: string) =>
  ({ color, size }: { color: string; size: number }) => <Icon source={iconSource} color={color} size={size} />

const createTabLabel =
  (theme: DefaultTheme, label: string) =>
  ({ focused }: { focused: boolean }) => (
    <Text
      variant='body3'
      numberOfLines={1}
      style={{
        fontWeight: focused ? 'bold' : 'normal',
        color: focused ? theme.colors.onSurface : theme.colors.onSurfaceVariant,
      }}>
      {label}
    </Text>
  )

type BottomTabNavigationProps = {
  navigation: NavigationProps<BottomTabNavigationRouteType>
}

const BottomTabNavigation = ({ navigation }: BottomTabNavigationProps): ReactElement | null => {
  const { t } = useTranslation('layout')
  const { cityCode, languageCode } = useCityAppContext()
  const deviceWidth = useWindowDimensions().width
  const { data, loading, error, refresh } = useLoadCityContent({ cityCode, languageCode })
  const cachedDataRef = useRef(data)

  // Preserve previous data during language changes to prevent unmounting
  if (data) {
    cachedDataRef.current = data
  }

  const cachedData = data || cachedDataRef.current

  const homeRouteTitle = cityDisplayName(cachedData?.city, deviceWidth)
  useSetRouteTitle({ navigation, title: homeRouteTitle })
  const theme = useTheme()
  const { featureFlags } = buildConfig()

  const CategoriesIcon = useCallback(
    // eslint-disable-next-line react/no-unused-prop-types
    ({ focused }: { focused: boolean }) => (
      <Icon Icon={SignPostIcon} color={focused ? theme.colors.onSurface : theme.colors.onSurfaceVariant} />
    ),
    [theme],
  )

  if (!cachedData) {
    return <LoadingErrorHandler loading={loading} error={error} refresh={refresh} />
  }

  const isNewsEnabled = cachedData.city.tunewsEnabled || cachedData.city.localNewsEnabled

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.onSurface,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          height: 80,
          backgroundColor: theme.colors.surfaceVariant,
        },
      }}>
      <Tab.Screen
        name={CATEGORIES_ROUTE}
        component={CategoriesStackScreen}
        options={{ tabBarLabel: createTabLabel(theme, t('localInformationLabel')), tabBarIcon: CategoriesIcon }}
      />
      {featureFlags.pois && cachedData.city.poisEnabled && (
        <Tab.Screen
          name={POIS_ROUTE}
          component={PoisStackScreen}
          options={{ tabBarLabel: createTabLabel(theme, t('locations')), tabBarIcon: createTabIcon('map-outline') }}
        />
      )}
      {isNewsEnabled && (
        <Tab.Screen
          name={NEWS_ROUTE}
          component={NewsStackScreen}
          options={{ tabBarLabel: createTabLabel(theme, t('news')), tabBarIcon: createTabIcon('newspaper') }}
        />
      )}
      {cachedData.city.eventsEnabled && (
        <Tab.Screen
          name={EVENTS_ROUTE}
          component={EventsStackScreen}
          options={{
            tabBarLabel: createTabLabel(theme, t('events')),
            tabBarIcon: createTabIcon('calendar-blank-outline'),
          }}
        />
      )}
    </Tab.Navigator>
  )
}

export default BottomTabNavigation
