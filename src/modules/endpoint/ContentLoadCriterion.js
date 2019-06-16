// @flow

import moment from 'moment-timezone'
import Moment from 'moment'

const MAX_CONTENT_AGE = 24

type ContentType = 'all' | 'events' | 'categories'

export type ContentLoadCriterionType = {|
  contentType?: ContentType,
  peek?: boolean,
  forceUpdate: boolean,
  shouldRefreshResources: boolean
|}

export class ContentLoadCriterion {
  forceUpdate_: boolean
  shouldRefreshResources_: boolean
  contentType_: ContentType
  peek_: boolean

  constructor ({contentType = 'all', peek = false, forceUpdate, shouldRefreshResources}: ContentLoadCriterionType) {
    this.contentType_ = contentType
    this.peek_ = peek
    this.forceUpdate_ = forceUpdate
    this.shouldRefreshResources_ = shouldRefreshResources
  }

  shouldUpdate (lastUpdate: ?Moment): boolean {
    // The last update was more than 24h ago or a refresh should be forced
    return this.forceUpdate_ || !lastUpdate ||
      lastUpdate.isBefore(moment.tz('UTC').subtract(MAX_CONTENT_AGE, 'hours'))
  }

  shouldUpdateLanguages (): boolean {
    return !this.peek_
  }

  peek (): boolean {
    return !!this.peek_
  }

  shouldRefreshResources (): boolean {
    return this.shouldRefreshResources_ || this.peek_
  }
}
