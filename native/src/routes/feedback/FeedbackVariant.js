// @flow

import type { FeedbackType, FeedbackCategoryType } from 'api-client'

class FeedbackVariant {
  label: string
  language: string
  city: string
  feedbackType: FeedbackType
  feedbackCategory: FeedbackCategoryType
  pagePath: ?string
  alias: ?string

  constructor (label: string, language: string, city: string, feedbackType: FeedbackType,
    feedbackCategory: FeedbackCategoryType, pagePath?: string, alias?: string) {
    this.label = label
    this.language = language
    this.city = city
    this.feedbackType = feedbackType
    this.feedbackCategory = feedbackCategory
    this.pagePath = pagePath
    this.alias = alias
  }
}

export default FeedbackVariant
