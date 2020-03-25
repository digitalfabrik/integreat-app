// @flow

import type {
  FeedbackCategoryType,
  FeedbackType
} from '@integreat-app/integreat-api-client/endpoints/createFeedbackEndpoint'

class FeedbackDropdownItem {
  feedbackType: FeedbackType
  feedbackCategory: FeedbackCategoryType
  label: string
  alias: ?string

  constructor ({ label, feedbackType, feedbackCategory, alias }: {|
    label: string, feedbackType: FeedbackType, feedbackCategory: FeedbackCategoryType, alias?: string
  |}) {
    this.feedbackType = feedbackType
    this.label = label
    this.feedbackCategory = feedbackCategory
    this.alias = alias
  }
}

export default FeedbackDropdownItem
