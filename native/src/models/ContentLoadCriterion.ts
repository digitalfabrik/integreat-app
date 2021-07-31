import moment, { Moment } from 'moment'

export type ContentLoadCriterionType = {
  readonly forceUpdate: boolean
  readonly shouldRefreshResources: boolean
}

export class ContentLoadCriterion {
  _forceUpdate: boolean
  _shouldRefreshResources: boolean
  _peeking: boolean

  constructor({ forceUpdate, shouldRefreshResources }: ContentLoadCriterionType, peeking: boolean) {
    this._peeking = peeking
    this._forceUpdate = forceUpdate
    this._shouldRefreshResources = shouldRefreshResources
  }

  peeking(): boolean {
    return this._peeking
  }

  shouldUpdate(lastUpdate: Moment | null | undefined): boolean {
    // If an update is forced or the last update was before the start of today
    return this._forceUpdate || !lastUpdate || lastUpdate.isBefore(moment.utc().startOf('day'))
  }

  shouldLoadLanguages(): boolean {
    return !this.peeking()
  }

  shouldRefreshResources(): boolean {
    // When we are peeking we do not want to load resources.
    // Resources are downloaded on-demand in this case.
    return this.peeking() ? false : this._shouldRefreshResources
  }
}
