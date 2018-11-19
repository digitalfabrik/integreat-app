// @flow

import type { Location, Route } from 'redux-first-router'
import CategoriesMapModel from '../../endpoint/models/CategoriesMapModel'
import EventModel from '../../endpoint/models/EventModel'
import PoiModel from '../../endpoint/models/PoiModel'
import type { TFunction } from 'react-i18next'

export type GetLanguageChangePathParamsType = {|location: Location, events?: Array<EventModel>,
  categories?: CategoriesMapModel, pois?: Array<PoiModel>, language: string|}

export type GetLanguageChangePathType = GetLanguageChangePathParamsType => string | null

export type GetPageTitleParamsType = {|t: TFunction, cityName: string, pathname: string, events?: Array<EventModel>,
  categories?: CategoriesMapModel, pois?: Array<PoiModel>|}

class RouteConfig<T> {
  _name: string
  _route: Route
  _getRoutePath: T => string
  _getLanguageChangePath: GetLanguageChangePathType
  _getPageTitle: GetPageTitleParamsType => string

  constructor ({name, route, getRoutePath, getLanguageChangePath, getPageTitle}: {| name: string, route: Route,
    getRoutePath: T => string, getPageTitle: GetPageTitleParamsType => string,
    getLanguageChangePath: GetLanguageChangePathType
  |}) {
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

  get getRoutePath (): T => string {
    return this._getRoutePath
  }

  get getLanguageChangePath (): GetLanguageChangePathType {
    return this._getLanguageChangePath
  }

  get getPageTitle (): GetPageTitleParamsType => string {
    return this._getPageTitle
  }
}

export default RouteConfig
