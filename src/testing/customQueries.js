// @flow

import { isArray } from 'lodash'
import { type NativeTestInstance } from '@testing-library/react-native'

export function queryAllFlex (container: NativeTestInstance): Array<ReactTestInstance> {
  return Array.from(container.findAll(c => c.getProp('style')))
    .filter((node: NativeTestInstance) => {
      const style = node.getProp('style')

      if (!style) {
        return
      }

      const testForFlex = style => style.display === 'flex'
      return isArray(style) ? style.some(testForFlex) : testForFlex(style)
    })
}
