// @flow

import { isArray } from 'lodash'

export function queryAllFlex (container: ReactTestInstance): Array<ReactTestInstance> {
  return Array.from(container.findAll(c => c.getProp('style')))
    .filter(node => {
      const style = node.getProp('style')

      if (!style) {
        return
      }

      const testForFlex = style => style.display === 'flex'
      return isArray(style) ? style.some(testForFlex) : testForFlex(style)
    })
}
