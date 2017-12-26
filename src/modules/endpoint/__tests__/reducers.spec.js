import reducers from '../reducers'

describe('reducers', () => {
  test('should have all reducers we currently need', () => {
    // This helped to find possible typos in file names or endpoint names
    expect(reducers).toEqual({
      disclaimer: expect.any(Function),
      events: expect.any(Function),
      languages: expect.any(Function),
      locations: expect.any(Function),
      pages: expect.any(Function)
    })
  })
})
