// @flow

import type { FeedbackType, FeedbackCategoryType } from 'api-client'

class FeedbackVariant {
  label: string
  feedbackType: FeedbackType
  feedbackCategory: FeedbackCategoryType
  alias: ?string
  value: string

  constructor({
    label,
    feedbackType,
    feedbackCategory,
    alias
  }: {|
    label: string,
    feedbackType: FeedbackType,
    feedbackCategory: FeedbackCategoryType,
    alias?: string
  |}) {
    this.feedbackType = feedbackType
    this.label = label
    this.feedbackCategory = feedbackCategory
    this.alias = alias
    this.value = label // Required for react-select
  }
}

export default FeedbackVariant
