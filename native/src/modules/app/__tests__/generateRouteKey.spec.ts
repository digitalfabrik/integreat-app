import { generateKey } from '../generateRouteKey'
import { times } from 'lodash'
describe('generateRouteKey', () => {
  it('should not generate the same key multiple times', () => {
    const keys = []
    times(1000, () => keys.push(generateKey()))
    expect(new Set(keys).size).toBe(1000)
  })
})
