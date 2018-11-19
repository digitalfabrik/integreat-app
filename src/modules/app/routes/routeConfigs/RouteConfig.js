// @flow

import type { AllPayloadsType, GetLanguageChangePathType, GetPageTitleParamsType } from './types'
import type { Route } from 'redux-first-router'

class RouteConfig<T, P> {
  _name: string
  _route: Route
  _getRoutePath: P => string
  _getRequiredPayloads: AllPayloadsType => T
  _getLanguageChangePath: GetLanguageChangePathType
  _getPageTitle: GetPageTitleParamsType => string

  constructor ({name, route, getRoutePath, getLanguageChangePath, getRequiredPayloads, getPageTitle}: {|
    name: string, route: Route, getRoutePath: P => string, getPageTitle: GetPageTitleParamsType => string,
    getRequiredPayloads: AllPayloadsType => T, getLanguageChangePath: GetLanguageChangePathType
  |}) {
    this._getRequiredPayloads = getRequiredPayloads
    this._getLanguageChangePath = getLanguageChangePath
    this._getPageTitle = getPageTitle
    this._name = name
    this._route = route
    this._getRoutePath = getRoutePath
  }

  get name (): string {
    return this._name
  }

  get route (): Route {
    return this._route
  }

  get getRoutePath (): P => string {
    return this._getRoutePath
  }

  get getRequiredPayloads (): AllPayloadsType => T {
    return this._getRequiredPayloads
  }

  get getLanguageChangePath (): GetLanguageChangePathType {
    return this._getLanguageChangePath
  }

  get getPageTitle (): GetPageTitleParamsType => string {
    return this._getPageTitle
  }
}

export default RouteConfig
