import Route from '../Route'

describe('Route', () => {
  test('should stringify correctly', () => {
    const route = new Route('some-id', ':location/:language')
    expect(route.stringify({location: 'augsburg', language: 'de'})).toBe('augsburg/de')
  })

  test('should throw error if a param is missing', () => {
    const route = new Route('some-id', ':location/:language')
    expect(() => route.stringify({location: 'augsburg'})).toThrow()
  })

  test('should have correct path and id', () => {
    const route = new Route('some-id', ':location/:language')
    expect(route.path).toBe(':location/:language')
    expect(route.id).toBe('some-id')
  })
})
