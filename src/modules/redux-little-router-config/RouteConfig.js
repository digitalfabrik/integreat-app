import Route from './Route'
import React from 'react'
import { Fragment } from 'redux-little-router'

export class RouteConfig {
  routes = []

  constructor (routes = {}) {
    this.routes = routes.map(route => {
      if (typeof route === 'object') {
        return new Route(route.id, route.path, route.render, route.condition)
      }

      throw new Error('Value if routes config is no object!')
    })
  }

  getRouterConfig () {
    return this.routes.reduce((accumulator, route) => {
      accumulator[route.path] = {}
      return accumulator
    }, {})
  }

  registerRoute (route) {
    this.routes.push(route)
  }

  /**
   * @param id The id of the route to look for
   * @return {Route} The matched route
   */
  matchRoute (id) {
    return this.routes.find(route => route.id && route.id === id)
  }

  renderRoutes () {
    return <Fragment forRoute='/'>
      {/* Routes */}
      <React.Fragment>
        {this.routes.map(route => (
          <Fragment forRoute={route.path} withConditions={route.condition}>
            {route.renderComponent()}
          </Fragment>
          )
        )}
      </React.Fragment>
    </Fragment>
  }
}

export default RouteConfig
