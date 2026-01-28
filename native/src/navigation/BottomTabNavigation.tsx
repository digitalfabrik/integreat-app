import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import React, { ReactElement, useCallback } from 'react'
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
import useCityAppContext from '../hooks/useCityAppContext'
import useLoadCityContent from '../hooks/useLoadCityContent'
import useSetRouteTitle from '../hooks/useSetRouteTitle'
import CategoriesContainer from '../routes/CategoriesContainer'
import EventsContainer from '../routes/EventsContainer'
import NewsContainer from '../routes/NewsContainer'
import PoisContainer from '../routes/PoisContainer'
import cityDisplayName from '../utils/cityDisplayName'

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

const createTabLabel =
  (theme: DefaultTheme, label: string) =>
  ({ focused }: { focused: boolean }) => (
    <Text
      variant='body3'
      style={{
        fontWeight: focused ? 'bold' : 'normal',
        color: focused ? theme.colors.primary : theme.colors.onSurfaceVariant,
      }}>
      {label}
    </Text>
  )

type BottomTabNavigationProps = {
  navigation: NavigationProps<BottomTabNavigationRouteType>
}

const BottomTabNavigation = ({ navigation }: BottomTabNavigationProps): ReactElement => {
  const { t } = useTranslation('layout')
  const { cityCode, languageCode } = useCityAppContext()
  const deviceWidth = useWindowDimensions().width
  const { data } = useLoadCityContent({ cityCode, languageCode })
  const homeRouteTitle = cityDisplayName(data?.city, deviceWidth)
  useSetRouteTitle({ navigation, title: homeRouteTitle })
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
        tabBarStyle: {
          height: 80,
        },
      }}>
      <Tab.Screen
        name={CATEGORIES_ROUTE}
        component={CategoriesStackScreen}
        options={{ tabBarLabel: createTabLabel(theme, t('localInformationLabel')), tabBarIcon: CategoriesIcon }}
      />
      <Tab.Screen
        name={POIS_ROUTE}
        component={PoisStackScreen}
        options={{ tabBarLabel: createTabLabel(theme, t('locations')), tabBarIcon: createTabIcon('map-outline') }}
      />
      <Tab.Screen
        name={NEWS_ROUTE}
        component={NewsStackScreen}
        options={{ tabBarLabel: createTabLabel(theme, t('news')), tabBarIcon: createTabIcon('newspaper') }}
      />
      <Tab.Screen
        name={EVENTS_ROUTE}
        component={EventsStackScreen}
        options={{
          tabBarLabel: createTabLabel(theme, t('events')),
          tabBarIcon: createTabIcon('calendar-blank-outline'),
        }}
      />
    </Tab.Navigator>
  )
}

export default BottomTabNavigation
