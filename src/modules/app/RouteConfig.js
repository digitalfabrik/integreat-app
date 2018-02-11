import { clone } from 'lodash/lang'
import Route from './Route'

export class RouteConfig {
  routes = []

  constructor (routes = []) {
    this.routes = routes.map((route) => {
      if (!(route instanceof Route)) {
        throw new Error('All values in the route config must be Routes!')
      }

      return route
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
