import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { render, RenderAPI } from '@testing-library/react-native'
import React, { ReactElement } from 'react'

import { NavigationProps, RouteProps, RoutesParamsType, RoutesType } from '../constants/NavigationTypes'
import TestingAppContext from './TestingAppContext'
import wrapWithTheme from './wrapWithTheme'

type ReactNavigationProps<T extends RoutesType> = {
  route: RouteProps<T>
  navigation: NavigationProps<T>
}

const renderWithTheme = (component: ReactElement, wrapWithNavigationContainer = true): RenderAPI =>
  render(wrapWithNavigationContainer ? <NavigationContainer>{component}</NavigationContainer> : component, {
    wrapper: wrapWithTheme,
  })

export const renderWithNavigator = <T extends RoutesType, P>(
  routeName: T,
  Component: (props: ReactNavigationProps<T> & P) => ReactElement,
  props: P,
  initialParams?: Partial<RoutesParamsType[T]>,
): RenderAPI => {
  const { Screen, Navigator } = createStackNavigator<RoutesParamsType>()

  const Render = ({ route, navigation }: { route: RouteProps<T>; navigation: NavigationProps<T> }) => (
    <Component route={route} navigation={navigation} {...props} />
  )

  return renderWithTheme(
    <TestingAppContext>
      <NavigationContainer>
        <Navigator initialRouteName={routeName}>
          <Screen name={routeName} component={Render} initialParams={initialParams ?? undefined} />
        </Navigator>
      </NavigationContainer>
    </TestingAppContext>,
    false,
  )
}

export default renderWithTheme
