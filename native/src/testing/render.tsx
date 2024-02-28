import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { render, RenderAPI } from '@testing-library/react-native'
import React, { ReactElement } from 'react'

import { NavigationProps, RouteProps, RoutesParamsType, RoutesType } from '../constants/NavigationTypes'
import { AppContext } from '../contexts/AppContextProvider'
import wrapWithTheme from './wrapWithTheme'

type ReactNavigationProps<T extends RoutesType> = {
  route: RouteProps<T>
  navigation: NavigationProps<T>
}

const renderWithTheme = (component: ReactElement): RenderAPI => render(component, { wrapper: wrapWithTheme })

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
    <AppContext.Provider
      value={{ changeCityCode: jest.fn(), changeLanguageCode: jest.fn(), cityCode: 'augsburg', languageCode: 'de' }}>
      <NavigationContainer>
        <Navigator initialRouteName={routeName}>
          <Screen name={routeName} component={Render} initialParams={initialParams ?? undefined} />
        </Navigator>
      </NavigationContainer>
    </AppContext.Provider>,
  )
}

export default renderWithTheme
