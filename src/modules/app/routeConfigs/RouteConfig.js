// @flow

import type { Location, Route } from 'redux-first-router'
import CategoriesMapModel from '../../endpoint/models/CategoriesMapModel'
import EventModel from '../../endpoint/models/EventModel'
import PoiModel from '../../endpoint/models/PoiModel'
import type { TFunction } from 'react-i18next'
import CityModel from '../../endpoint/models/CityModel'
import WohnenOfferModel from '../../endpoint/models/WohnenOfferModel'
import PageModel from '../../endpoint/models/PageModel'
import Payload from '../../endpoint/Payload'
import ExtraModel from '../../endpoint/models/ExtraModel'
import SprungbrettModel from '../../endpoint/models/SprungbrettJobModel'

export type AllPayloadsType = {|
  citiesPayload: Payload<Array<CityModel>>,
  categoriesPayload: Payload<CategoriesMapModel>,
  poisPayload: Payload<Array<PoiModel>>,
  eventsPayload: Payload<Array<EventModel>>,
  extrasPayload: Payload<Array<ExtraModel>>,
  sprungbrettJobsPayload: Payload<Array<SprungbrettModel>>,
  wohnenPayload: Payload<Array<WohnenOfferModel>>,
  disclaimerPayload: Payload<PageModel>
|}

export type GetLanguageChangePathParamsType = {|location: Location, events?: Array<EventModel>,
  categories?: CategoriesMapModel, pois?: Array<PoiModel>, language: string|}

export type GetLanguageChangePathType = GetLanguageChangePathParamsType => string | null

export type GetPageTitleParamsType = {|t: TFunction, cityName: string, pathname: string, events?: Array<EventModel>,
  categories?: CategoriesMapModel, pois?: Array<PoiModel>|}

class RouteConfig<T, P> {
  _name: string
  _route: Route
  _getRoutePath: T => string
  _getLanguageChangePath: GetLanguageChangePathType
  _getPageTitle: GetPageTitleParamsType => string
  _getRequiredPayloads: AllPayloadsType => P

  constructor ({name, route, getRoutePath, getLanguageChangePath, getPageTitle, getRequiredPayloads}: {| name: string,
    route: Route, getRoutePath: T => string, getPageTitle: GetPageTitleParamsType => string,
    getLanguageChangePath: GetLanguageChangePathType, getRequiredPayloads: AllPayloadsType => P
  |}) {
    this._getLanguageChangePath = getLanguageChangePath
    this._getPageTitle = getPageTitle
    this._name = name
    this._route = route
    this._getRoutePath = getRoutePath
    this._getRequiredPayloads = getRequiredPayloads
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

  get getRequiredPayloads (): AllPayloadsType => P {
    return this._getRequiredPayloads
  }
}

export default RouteConfig
