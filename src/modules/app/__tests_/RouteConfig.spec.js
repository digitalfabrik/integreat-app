import Route from '../Route'
import RouteConfig from '../RouteConfig'

describe('RouteConfig', () => {
  test('should build correct config for redux-little-router', () => {
    const routeConfig = new RouteConfig([{id: 'some-id', path: ':location/:language'}])
    const route = new Route('some-id', ':location/:language')
    expect(routeConfig.getRouterConfig()).toEqual({':location/:language': route})
  })

  test('should throw error if providing invalid config', () => {
    expect(() => new RouteConfig([0xBABE])).toThrow()
  })

  test('should match routes', () => {
    const routeConfig = new RouteConfig([{id: 'some-id', path: ':location/:language'}])
    const route = new Route('some-id', ':location/:language')
    expect(routeConfig.matchRoute('some-id')).toEqual(route)
  })

  test('should throw error if route is not found', () => {
    const routeConfig = new RouteConfig([])
    expect(() => routeConfig.matchRoute('some-id')).toThrow()
  })
})
