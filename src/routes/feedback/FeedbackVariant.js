// @flow

import type { FeedbackType } from '@integreat-app/integreat-api-client/endpoints/createFeedbackEndpoint'

class FeedbackVariant {
  label: string
  language: string
  city: string
  feedbackType: FeedbackType
  pagePath: ?string
  alias: ?string

  constructor (label: string, language: string, city: string, feedbackType: FeedbackType, pagePath?: string, alias?: string) {
    this.label = label
    this.language = language
    this.city = city
    this.feedbackType = feedbackType
    this.pagePath = pagePath
    this.alias = alias
  }
}

export default FeedbackVariant
