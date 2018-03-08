import Route from '../Route'

describe('Route', () => {
  it('should stringify correctly', () => {
    const route = new Route({id: 'some-id', path: ':location/:language'})
    expect(route.stringify({location: 'augsburg', language: 'de'})).toBe('augsburg/de')
  })

  it('should throw error if a param is missing', () => {
    const route = new Route({id: 'some-id', path: ':location/:language'})
    expect(() => route.stringify({location: 'augsburg'})).toThrowErrorMatchingSnapshot()
  })

  it('should have correct path and id', () => {
    const route = new Route({id: 'some-id', path: ':location/:language'})
    expect(route.path).toBe(':location/:language')
    expect(route.id).toBe('some-id')
  })
})
