// @flow

import type { Node } from 'react'
import type { Route as RouterRouteType, Action } from 'redux-first-router'
import type { AllPayloadsType } from './types'

type GetLanguageChangeActionType<P> = ({language: string, location: Location, city: string, data: P}) => Action | null
type GoToRouteType = (city: string, language: string, id: string) => Action

class Route<T, P> {
  _name: string
  _goToRoute: GoToRouteType
  _getLanguageChangeAction: ?GetLanguageChangeActionType<P>
  _renderPage: T => Node
  _route: RouterRouteType
  _getRequiredPayloads: AllPayloadsType => T

  constructor ({ name, goToRoute, getLanguageChangeAction, renderPage, route, getRequiredPayloads }: {
    name: string, goToRoute: GoToRouteType, getLanguageChangeAction?: GetLanguageChangeActionType<P>,
    renderPage: T => Node, route: RouterRouteType, getRequiredPayloads: AllPayloadsType => T
  }) {
    this._name = name
    this._goToRoute = goToRoute
    this._getLanguageChangeAction = getLanguageChangeAction
    this._renderPage = renderPage
    this._route = route
    this._getRequiredPayloads = getRequiredPayloads
  }

  get name (): string {
    return this._name
  }

  get goToRoute (): GoToRouteType {
    return this._goToRoute
  }

  get getLanguageChangeAction (): ?GetLanguageChangeActionType<P> {
    return this._getLanguageChangeAction
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
