// @flow

import type { Node } from 'react'
import type { AllPayloadsType, GetLanguageChangePathType, GetPageTitleParamsType } from '../types'

class Route<T> {
  _renderPage: T => Node
  _getRequiredPayloads: AllPayloadsType => T
  _getLanguageChangePath: ?GetLanguageChangePathType
  _getPageTitle: GetPageTitleParamsType => string

  constructor ({ getLanguageChangePath, renderPage, getRequiredPayloads, getPageTitle }: {|
    renderPage: T => Node, getPageTitle: GetPageTitleParamsType => string, getRequiredPayloads: AllPayloadsType => T,
    getLanguageChangePath?: GetLanguageChangePathType
  |}) {
    this._renderPage = renderPage
    this._getRequiredPayloads = getRequiredPayloads
    this._getLanguageChangePath = getLanguageChangePath
    this._getPageTitle = getPageTitle
  }

  get renderPage (): T => Node {
    return this._renderPage
  }

  get getRequiredPayloads (): AllPayloadsType => T {
    return this._getRequiredPayloads
  }

  get getLanguageChangePath (): ?GetLanguageChangePathType {
    return this._getLanguageChangePath
  }

  get getPageTitle (): GetPageTitleParamsType => string {
    return this._getPageTitle
  }
}

export default Route
