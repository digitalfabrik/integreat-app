// @flow

import type { Node } from 'react'
import type { Route as RouterRouteType, Action } from 'redux-first-router'
import type { AllPayloadsType } from './types'

class Route<T, P> {
  _name: string
  _goToRoute: P => Action
  _renderPage: T => Node
  _route: RouterRouteType
  _getRequiredPayloads: AllPayloadsType => T

  constructor ({ name, goToRoute, getLanguageChangeAction, renderPage, route, getRequiredPayloads }: {
    name: string, goToRoute: P => Action, renderPage: T => Node, route: RouterRouteType,
    getRequiredPayloads: AllPayloadsType => T
  }) {
    this._name = name
    this._goToRoute = goToRoute
    this._renderPage = renderPage
    this._route = route
    this._getRequiredPayloads = getRequiredPayloads
  }

  get name (): string {
    return this._name
  }

  get goToRoute (): P => Action {
    return this._goToRoute
  }

  get renderPage (): T => Node {
    return this._renderPage
  }

  get route (): RouterRouteType {
    return this._route
  }

  get getRequiredPayloads (): AllPayloadsType => T {
    return this._getRequiredPayloads
  }
}

export default Route
