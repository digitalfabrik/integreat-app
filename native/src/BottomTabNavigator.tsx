import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import React, { ReactElement, useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { NavigationProps, RoutesParamsType } from 'src/constants/NavigationTypes'
import { DefaultTheme, useTheme } from 'styled-components/native'

import {
  BottomTabRouteType,
  CATEGORIES_ROUTE,
  CATEGORIES_TAB_ROUTE,
  EVENTS_ROUTE,
  EVENTS_TAB_ROUTE,
  LOCAL_NEWS_TYPE,
  NEWS_ROUTE,
  NEWS_TAB_ROUTE,
  PLACES_ROUTE,
  PLACES_TAB_ROUTE,
} from 'shared'

import { SignPostIcon } from './assets'
import ChatFab from './components/ChatFab'
import { defaultHeader } from './components/DefaultHeader'
import Icon from './components/base/Icon'
import Text from './components/base/Text'
import { TAB_NAVIGATOR_ID } from './constants'
import buildConfig from './constants/buildConfig'
import useLoadRegionContent from './hooks/useLoadRegionContent'
import useNavigate from './hooks/useNavigate'
import useRegionAppContext from './hooks/useRegionAppContext'
import useSetRouteTitle from './hooks/useSetRouteTitle'
import CategoriesContainer from './routes/CategoriesContainer'
import EventsContainer from './routes/EventsContainer'
import LoadingErrorHandler from './routes/LoadingErrorHandler'
import NewsContainer from './routes/NewsContainer'
import PlacesContainer from './routes/PlacesContainer'
import { usePushNotificationListener } from './utils/PushNotificationsManager'

const Tab = createBottomTabNavigator<RoutesParamsType>()
const CategoriesStack = createStackNavigator<RoutesParamsType>()
const PlacesStack = createStackNavigator<RoutesParamsType>()
const EventsStack = createStackNavigator<RoutesParamsType>()
const NewsStack = createStackNavigator<RoutesParamsType>()

const TAB_HEIGHT = 60

const CategoriesStackScreen = () => (
  <CategoriesStack.Navigator screenOptions={{ header: defaultHeader, animation: 'none' }}>
    <CategoriesStack.Screen name={CATEGORIES_ROUTE} initialParams={{}} component={CategoriesContainer} />
  </CategoriesStack.Navigator>
)

const PlacesStackScreen = () => (
  <PlacesStack.Navigator screenOptions={{ header: defaultHeader, animation: 'none' }}>
    <PlacesStack.Screen name={PLACES_ROUTE} initialParams={{}} component={PlacesContainer} />
  </PlacesStack.Navigator>
)

const EventsStackScreen = () => (
  <EventsStack.Navigator screenOptions={{ header: defaultHeader, animation: 'none' }}>
    <EventsStack.Screen name={EVENTS_ROUTE} initialParams={{}} component={EventsContainer} />
  </EventsStack.Navigator>
)

const NewsStackScreen = () => (
  <NewsStack.Navigator screenOptions={{ header: defaultHeader, animation: 'none' }}>
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

type BottomTabNavigatorProps = {
  navigation: NavigationProps<BottomTabRouteType>
}

const BottomTabNavigator = ({ navigation }: BottomTabNavigatorProps): ReactElement | null => {
  const { t } = useTranslation('layout')
  const { regionCode, languageCode } = useRegionAppContext()
  const { navigateTo } = useNavigate()
  const insets = useSafeAreaInsets()
  const { data, loading, error, refresh } = useLoadRegionContent({ regionCode, languageCode })
  const cachedDataRef = useRef(data)

  // Preserve previous data during language changes to prevent unmounting
  if (data) {
    cachedDataRef.current = data
  }

  usePushNotificationListener(navigateTo)

  const cachedData = data || cachedDataRef.current

  useSetRouteTitle({ navigation, title: cachedData?.region.name })
  const theme = useTheme()

  const CategoriesIcon = useCallback(
    // eslint-disable-next-line react/no-unused-prop-types
    ({ focused }: { focused: boolean }) => (
      <Icon icon={SignPostIcon} color={focused ? theme.colors.onSurface : theme.colors.onSurfaceVariant} />
    ),
    [theme],
  )

  if (!cachedData) {
    return <LoadingErrorHandler loading={loading} error={error} refresh={refresh} />
  }

  const { eventsEnabled, placesEnabled, localNewsEnabled, tuNewsEnabled, chatEnabled } = cachedData.region
  const chatVisible = buildConfig().featureFlags.chat && chatEnabled && regionCode === 'testumgebung'

  const Tabs = [
    <Tab.Screen
      name={CATEGORIES_TAB_ROUTE}
      component={CategoriesStackScreen}
      options={{
        tabBarLabel: createTabLabel(theme, t('localInformationLabel')),
        tabBarIcon: CategoriesIcon,
        tabBarAccessibilityLabel: t('localInformationLabel'),
      }}
    />,
    placesEnabled && (
      <Tab.Screen
        name={PLACES_TAB_ROUTE}
        component={PlacesStackScreen}
        options={{
          tabBarLabel: createTabLabel(theme, t('locations')),
          tabBarIcon: createTabIcon('map-outline'),
          tabBarAccessibilityLabel: t('locations'),
        }}
      />
    ),
    (localNewsEnabled || tuNewsEnabled) && (
      <Tab.Screen
        name={NEWS_TAB_ROUTE}
        component={NewsStackScreen}
        options={{
          tabBarLabel: createTabLabel(theme, t('news')),
          tabBarIcon: createTabIcon('newspaper'),
          tabBarAccessibilityLabel: t('news'),
        }}
      />
    ),
    eventsEnabled && (
      <Tab.Screen
        name={EVENTS_TAB_ROUTE}
        component={EventsStackScreen}
        options={{
          tabBarLabel: createTabLabel(theme, t('events')),
          tabBarIcon: createTabIcon('calendar-blank-outline'),
          tabBarAccessibilityLabel: t('events'),
        }}
      />
    ),
  ].filter(Boolean)

  const bottomTabsVisible = Tabs.length > 1

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        id={TAB_NAVIGATOR_ID}
        backBehavior='history'
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: theme.colors.onSurface,
          tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
          tabBarStyle: {
            height: TAB_HEIGHT + insets.bottom,
            backgroundColor: theme.colors.surfaceVariant,
            display: bottomTabsVisible ? 'flex' : 'none',
          },
          sceneStyle: bottomTabsVisible ? undefined : { paddingBottom: insets.bottom },
        }}>
        {Tabs}
      </Tab.Navigator>
      {chatVisible && <ChatFab style={{ bottom: TAB_HEIGHT + insets.bottom }} />}
    </View>
  )
}

export default BottomTabNavigator
