import fc from 'fast-check'

import { parseQueryParams, toQueryParams } from '../query'

describe('query params round-trip (property-based)', () => {
  it('should preserve the params through a toQueryParams/parseQueryParams round-trip', () => {
    const params = fc.record({
      searchText: fc.option(fc.string({ minLength: 1 }), { nil: undefined }),
      chat: fc.option(fc.boolean(), { nil: undefined }),
      multipoi: fc.option(fc.integer(), { nil: undefined }),
      poiCategoryId: fc.option(fc.integer(), { nil: undefined }),
      zoom: fc.option(fc.integer(), { nil: undefined }),
    })
    fc.assert(
      fc.property(params, input => {
        expect(parseQueryParams(toQueryParams(input))).toEqual(input)
      }),
    )
  })
})
