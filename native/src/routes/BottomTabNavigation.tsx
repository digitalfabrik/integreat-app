import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { RoutesParamsType } from 'src/constants/NavigationTypes'

import { CATEGORIES_ROUTE, EVENTS_ROUTE, LOCAL_NEWS_TYPE, NEWS_ROUTE, POIS_ROUTE } from 'shared'

import { defaultHeader } from '../Navigator'
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
const BottomTabNavigation = (): ReactElement => {
  const { t } = useTranslation('layout')
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name={CATEGORIES_ROUTE}
        component={CategoriesStackScreen}
        options={{ tabBarLabel: t('localInformationLabel') }}
      />
      <Tab.Screen name={POIS_ROUTE} component={PoisStackScreen} options={{ tabBarLabel: t('locations') }} />
      <Tab.Screen name={EVENTS_ROUTE} component={EventsStackScreen} options={{ tabBarLabel: t('events') }} />
      <Tab.Screen name={NEWS_ROUTE} component={NewsStackScreen} options={{ tabBarLabel: t('news') }} />
    </Tab.Navigator>
  )
}

export default BottomTabNavigation
