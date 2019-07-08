// @flow

import moment from 'moment-timezone'
import Moment from 'moment'

const MAX_CONTENT_AGE = 24

export type ContentLoadCriterionType = {|
  peek?: boolean,
  forceUpdate: boolean,
  shouldRefreshResources: boolean
|}

export class ContentLoadCriterion {
  _forceUpdate: boolean
  _shouldRefreshResources: boolean
  _peek: boolean

  constructor ({peek = false, forceUpdate, shouldRefreshResources}: ContentLoadCriterionType) {
    this._peek = peek
    this._forceUpdate = forceUpdate
    this._shouldRefreshResources = shouldRefreshResources
  }

  shouldUpdate (lastUpdate: ?Moment): boolean {
    // The last update was more than 24h ago or a refresh should be forced
    return this._forceUpdate || !lastUpdate ||
      lastUpdate.isBefore(moment.tz('UTC').subtract(MAX_CONTENT_AGE, 'hours'))
  }

  shouldUpdateLanguages (): boolean {
    return !this._peek
  }

  peek (): boolean {
    return !!this._peek
  }

  shouldRefreshResources (): boolean {
    return this._shouldRefreshResources || this._peek
  }
}
