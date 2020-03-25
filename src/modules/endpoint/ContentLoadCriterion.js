// @flow

import moment from 'moment'

const MAX_CONTENT_AGE = 24

export type ContentLoadCriterionType = {|
  +forceUpdate: boolean,
  +shouldRefreshResources: boolean
|}

export class ContentLoadCriterion {
  _forceUpdate: boolean
  _shouldRefreshResources: boolean
  _peeking: boolean

  constructor ({ forceUpdate, shouldRefreshResources }: ContentLoadCriterionType, peeking: boolean) {
    this._peeking = peeking
    this._forceUpdate = forceUpdate
    this._shouldRefreshResources = shouldRefreshResources
  }

  peeking (): boolean {
    return this._peeking
  }

  shouldUpdate (lastUpdate: ?moment): boolean {
    // The last update was more than 24h ago or a refresh should be forced
    return this._forceUpdate || !lastUpdate ||
      lastUpdate.isBefore(moment.utc().subtract(MAX_CONTENT_AGE, 'hours'))
  }

  shouldLoadLanguages (): boolean {
    return !this.peeking()
  }

  shouldRefreshResources (): boolean {
    // When we are peeking we do not want to load resources.
    // Resources are downloaded on-demand in this case.
    return this.peeking() ? false : this._shouldRefreshResources
  }
}
