import { StackHeaderProps } from '@react-navigation/stack'
import { merge } from 'lodash'

import createNavigationMock from './createNavigationPropMock'

type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>
}

const mockStackHeaderProps = (props: DeepPartial<StackHeaderProps> = {}, routeIndex = 0): StackHeaderProps =>
  merge(
    {
      navigation: createNavigationMock(routeIndex),
      route: {
        key: 'key-0'
      },
      options: {},
      layout: {
        width: 450,
        height: 600
      },
      progress: {
        current: {
          interpolate: jest.fn(),
          addListener: jest.fn(),
          removeListener: jest.fn(),
          removeAllListeners: jest.fn(),
          hasListeners: jest.fn()
        }
      },
      back: {
        title: 'back title'
      },
      styleInterpolator: jest.fn()
    },
    props as StackHeaderProps
  )

export default mockStackHeaderProps
