import Route from './Route'
import { isPlainObject } from 'lodash/lang'

export class RouteConfig {
  routes = []

  constructor (routes = []) {
    this.routes = routes.map(route => {
      if (isPlainObject(route)) {
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
    const route = this.routes.find(route => route.id && route.id === id)
    if (!route) {
      throw Error(`Route ${id} was not found in RouteConfig!`)
    }

    return route
  }
}

export default RouteConfig
