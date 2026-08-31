import { BottomTabBarButtonProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { PlatformPressable } from '@react-navigation/elements'
import { getFocusedRouteNameFromRoute, useNavigationState } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import React, { ReactElement, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled, { DefaultTheme, useTheme } from 'styled-components/native'

import {
  ACTIVE_TAB_HEIGHT,
  BottomTabRouteType,
  CATEGORIES_ROUTE,
  CATEGORIES_TAB_ROUTE,
  EVENTS_ROUTE,
  EVENTS_TAB_ROUTE,
  NEWS_ROUTE,
  NEWS_TAB_ROUTE,
  PLACES_ROUTE,
  PLACES_TAB_ROUTE,
} from 'shared'

import ChatFab from './components/ChatFab'
import { defaultHeader } from './components/DefaultHeader'
import Icon from './components/base/Icon'
import Text from './components/base/Text'
import { TAB_NAVIGATOR_ID } from './constants'
import { NavigationProps, RouteProps, RoutesParamsType } from './constants/NavigationTypes'
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

// note: the theme.dark logic will get replaced with proper theme handling at #4334
const getActiveTabColor = (theme: DefaultTheme): string =>
  theme.dark ? theme.colors.primaryContainer : theme.colors.primary

const ActiveIndicator = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: ${ACTIVE_TAB_HEIGHT}px;
  border-radius: 0 0 20px 20px;
  background-color: ${props => getActiveTabColor(props.theme)};
`

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
    <NewsStack.Screen name={NEWS_ROUTE} initialParams={{ id: null }} component={NewsContainer} />
  </NewsStack.Navigator>
)

const createTabIcon =
  (iconSource: string) =>
  ({ color, size }: { color: string; size: number }) => <Icon source={iconSource} color={color} size={size} />

const createTabLabel =
  (label: string) =>
  ({ focused, color }: { focused: boolean; color: string }) => (
    <Text variant='body3' numberOfLines={1} style={{ fontWeight: focused ? 'bold' : 'normal', color }}>
      {label}
    </Text>
  )

const TabButton = ({ children, ...props }: BottomTabBarButtonProps): ReactElement => (
  <PlatformPressable {...props}>
    {props['aria-selected'] && <ActiveIndicator />}
    {children}
  </PlatformPressable>
)

type BottomTabNavigatorProps = {
  route: RouteProps<BottomTabRouteType>
  navigation: NavigationProps<BottomTabRouteType>
}

const BottomTabNavigator = ({ route, navigation }: BottomTabNavigatorProps): ReactElement | null => {
  const { t } = useTranslation()
  const { regionCode, languageCode } = useRegionAppContext()
  const { navigateTo } = useNavigate()
  const insets = useSafeAreaInsets()
  const { data, loading, error, refresh } = useLoadRegionContent({ regionCode, languageCode })
  const cachedDataRef = useRef(data)
  const activeTab = useNavigationState(() => getFocusedRouteNameFromRoute(route))

  // Preserve previous data during language changes to prevent unmounting
  if (data) {
    cachedDataRef.current = data
  }

  usePushNotificationListener(navigateTo)

  const cachedData = data || cachedDataRef.current

  useSetRouteTitle({ navigation, title: cachedData?.region.name })
  const theme = useTheme()

  if (!cachedData) {
    return <LoadingErrorHandler loading={loading} error={error} refresh={refresh} />
  }

  const { eventsEnabled, placesEnabled, newsEnabled, chatEnabled } = cachedData.region
  const chatVisible = buildConfig().featureFlags.chat && chatEnabled && activeTab !== PLACES_TAB_ROUTE

  const Tabs = [
    <Tab.Screen
      name={CATEGORIES_TAB_ROUTE}
      component={CategoriesStackScreen}
      options={{
        tabBarLabel: createTabLabel(t($ => $.layout.localInformationLabel)),
        tabBarIcon: createTabIcon('home'),
        tabBarAccessibilityLabel: t($ => $.layout.localInformationLabel),
      }}
    />,
    placesEnabled && (
      <Tab.Screen
        name={PLACES_TAB_ROUTE}
        component={PlacesStackScreen}
        options={{
          tabBarLabel: createTabLabel(t($ => $.layout.locations)),
          tabBarIcon: createTabIcon('map'),
          tabBarAccessibilityLabel: t($ => $.layout.locations),
        }}
      />
    ),
    newsEnabled && (
      <Tab.Screen
        name={NEWS_TAB_ROUTE}
        component={NewsStackScreen}
        options={{
          tabBarLabel: createTabLabel(t($ => $.layout.news)),
          tabBarIcon: createTabIcon('note-text'),
          tabBarAccessibilityLabel: t($ => $.layout.news),
        }}
      />
    ),
    eventsEnabled && (
      <Tab.Screen
        name={EVENTS_TAB_ROUTE}
        component={EventsStackScreen}
        options={{
          tabBarLabel: createTabLabel(t($ => $.layout.events)),
          tabBarIcon: createTabIcon('calendar-blank-outline'),
          tabBarAccessibilityLabel: t($ => $.layout.events),
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
          tabBarActiveTintColor: getActiveTabColor(theme),
          tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
          tabBarButton: TabButton,
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
