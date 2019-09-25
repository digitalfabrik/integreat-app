// @flow

import { queryAllFlex } from './customQueries'
import type { NativeTestInstance } from '@testing-library/react-native'

const jestExtends = {
  /**
   * Checks whether the received components have a reverse direction. This allows to test whether the component
   * is correctly internationalized.
   *
   * @param received The received result
   * @returns {{pass: boolean, message: (function(): string)}} A jest.extend compatible matcher
   */
  toHaveReverseDirection: (received: Array<ReactTestInstance>) => {
    if (received.every(instance => instance.props.style.some(style => style.flexDirection.includes('reverse')))) {
      return {
        message: () =>
          `expected received components not to have direction`,
        pass: true
      }
    } else {
      return {
        message: () =>
          `expected received components to have direction`,
        pass: false
      }
    }
  }
}

export const expectToHaveReverseDirection = (container: NativeTestInstance) => {
  // $FlowFixMe https://github.com/flow-typed/flow-typed/issues/948
  expect(queryAllFlex(container)).toHaveReverseDirection()
}

export const expectToHaveForwardDirection = (container: NativeTestInstance) => {
  // $FlowFixMe https://github.com/flow-typed/flow-typed/issues/948
  expect(queryAllFlex(container)).not.toHaveReverseDirection()
}

export const extend = () => {
  expect.extend(jestExtends)
}
