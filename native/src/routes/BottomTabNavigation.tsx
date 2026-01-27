import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import React, { ReactElement, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'react-native-paper'
import { RoutesParamsType } from 'src/constants/NavigationTypes'

import { CATEGORIES_ROUTE, EVENTS_ROUTE, LOCAL_NEWS_TYPE, NEWS_ROUTE, POIS_ROUTE } from 'shared'

import { defaultHeader } from '../Navigator'
import { SignPostIcon } from '../assets'
import Icon from '../components/base/Icon'
import CategoriesContainer from './CategoriesContainer'
import EventsContainer from './EventsContainer'
import NewsContainer from './NewsContainer'
import PoisContainer from './PoisContainer'

const Tab = createBottomTabNavigator<RoutesParamsType>()
const CategoriesStack = createStackNavigator<RoutesParamsType>()
const PoisStack = createStackNavigator<RoutesParamsType>()
const EventsStack = createStackNavigator<RoutesParamsType>()
const NewsStack = createStackNavigator<RoutesParamsType>()

const CategoriesStackScreen = () => (
  <CategoriesStack.Navigator screenOptions={{ header: defaultHeader }}>
    <CategoriesStack.Screen name={CATEGORIES_ROUTE} initialParams={{}} component={CategoriesContainer} />
  </CategoriesStack.Navigator>
)

const PoisStackScreen = () => (
  <PoisStack.Navigator screenOptions={{ header: defaultHeader }}>
    <PoisStack.Screen name={POIS_ROUTE} initialParams={{}} component={PoisContainer} />
  </PoisStack.Navigator>
)

const EventsStackScreen = () => (
  <EventsStack.Navigator screenOptions={{ header: defaultHeader }}>
    <EventsStack.Screen name={EVENTS_ROUTE} initialParams={{}} component={EventsContainer} />
  </EventsStack.Navigator>
)

const NewsStackScreen = () => (
  <NewsStack.Navigator screenOptions={{ header: defaultHeader }}>
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

const PoisTabIcon = createTabIcon('map-outline')
const NewsTabIcon = createTabIcon('newspaper')
const EventsTabIcon = createTabIcon('calendar-blank-outline')

const BottomTabNavigation = (): ReactElement => {
  const { t } = useTranslation('layout')
  const theme = useTheme()
  const CategoriesIcon = useCallback(
    ({ focused }: { focused: boolean }) => (
      <Icon Icon={SignPostIcon} color={focused ? theme.colors.primary : theme.colors.onSurfaceVariant} />
    ),
    [theme],
  )

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '600',
        },

        tabBarStyle: {
          height: 80, // Erhöhe die Tab Bar Höhe
        },
      }}>
      <Tab.Screen
        name={CATEGORIES_ROUTE}
        component={CategoriesStackScreen}
        options={{ tabBarLabel: t('localInformationLabel'), tabBarIcon: CategoriesIcon }}
      />
      <Tab.Screen
        name={POIS_ROUTE}
        component={PoisStackScreen}
        options={{ tabBarLabel: t('locations'), tabBarIcon: PoisTabIcon }}
      />
      <Tab.Screen
        name={NEWS_ROUTE}
        component={NewsStackScreen}
        options={{ tabBarLabel: t('news'), tabBarIcon: NewsTabIcon }}
      />
      <Tab.Screen
        name={EVENTS_ROUTE}
        component={EventsStackScreen}
        options={{ tabBarLabel: t('events'), tabBarIcon: EventsTabIcon }}
      />
    </Tab.Navigator>
  )
}

export default BottomTabNavigation
