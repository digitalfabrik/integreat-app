import { StackHeaderProps } from '@react-navigation/stack'
import { merge } from 'lodash'
import createNavigationMock from './createNavigationPropMock'

type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>
}

const mockStackHeaderProps = (props: DeepPartial<StackHeaderProps> = {}): StackHeaderProps => {
  return merge(
    {
      mode: 'screen',
      layout: {
        width: 450,
        height: 600
      },
      insets: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      },
      styleInterpolator: jest.fn(),
      scene: {
        route: {
          key: 'key-0'
        },
        descriptor: {
          render: jest.fn(),
          options: {},
          navigation: createNavigationMock()
        },
        progress: {
          current: {
            interpolate: jest.fn(),
            addListener: jest.fn(),
            removeListener: jest.fn(),
            removeAllListeners: jest.fn(),
            hasListeners: jest.fn()
          }
        }
      },
      navigation: createNavigationMock()
    },
    props
  ) as StackHeaderProps
}

export default mockStackHeaderProps
