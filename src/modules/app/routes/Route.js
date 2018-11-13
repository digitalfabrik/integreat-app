// @flow

import type { Node } from 'react'
import type { Route as RouterRouteType } from 'redux-first-router'
import type { AllPayloadsType, GetLanguageChangePathType } from './types'

class Route<T, P> {
  _name: string
  _getRoutePath: P => string
  _renderPage: T => Node
  _route: RouterRouteType
  _getRequiredPayloads: AllPayloadsType => T
  _getLanguageChangePath: ?GetLanguageChangePathType

  constructor ({ name, getRoutePath, getLanguageChangePath, renderPage, route, getRequiredPayloads }: {|
    name: string, getRoutePath: P => string, renderPage: T => Node, route: RouterRouteType,
    getRequiredPayloads: AllPayloadsType => T, getLanguageChangePath?: GetLanguageChangePathType
  |}) {
    this._name = name
    this._getRoutePath = getRoutePath
    this._renderPage = renderPage
    this._route = route
    this._getRequiredPayloads = getRequiredPayloads
    this._getLanguageChangePath = getLanguageChangePath
  }

  get name (): string {
    return this._name
  }

  get getRoutePath (): P => string {
    return this._getRoutePath
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

  get getLanguageChangePath (): ?GetLanguageChangePathType {
    return this._getLanguageChangePath
  }
}

export default Route
