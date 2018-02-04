import Route from './Route'

export class RouteConfig {
  routes = []

  constructor (routes = {}) {
    this.routes = routes.map(route => {
      if (typeof route === 'object') {
        return new Route(route.id, route.path)
      }

      throw new Error('Value if routes config is no object!')
    })
  }

  getRouterConfig () {
    return this.routes.reduce((accumulator, route) => {
      accumulator[route.path] = route
      return accumulator
    }, {})
  }

  /**
   * @param id The id of the route to look for
   * @return {Route} The matched route
   */
  matchRoute (id) {
    return this.routes.find(route => route.id && route.id === id)
  }
}

export default RouteConfig
