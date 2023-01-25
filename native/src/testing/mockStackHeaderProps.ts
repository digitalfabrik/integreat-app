import { StackHeaderProps } from '@react-navigation/stack'
import { merge } from 'lodash'

import { CATEGORIES_ROUTE } from 'api-client'

import { NavigationProps, RouteProps, RoutesType } from '../constants/NavigationTypes'
import createNavigationMock from './createNavigationPropMock'

type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>
}
type mockStackHeaderPropsProps = {
  route: RouteProps<RoutesType>
  navigation: NavigationProps<RoutesType>
}

const mockStackHeaderProps = (
  props: DeepPartial<mockStackHeaderPropsProps> = {},
  routeIndex = 0
): mockStackHeaderPropsProps =>
  merge(
    {
      navigation: createNavigationMock(routeIndex),
      route: {
        key: 'key-0',
        name: CATEGORIES_ROUTE,
        params: {},
      },
      options: {},
      layout: {
        width: 450,
        height: 600,
      },
      progress: {
        current: {
          interpolate: jest.fn(),
          addListener: jest.fn(),
          removeListener: jest.fn(),
          removeAllListeners: jest.fn(),
          hasListeners: jest.fn(),
        },
      },
      back: {
        title: 'back title',
      },
      styleInterpolator: jest.fn(),
    },
    props as StackHeaderProps
  )

export default mockStackHeaderProps
