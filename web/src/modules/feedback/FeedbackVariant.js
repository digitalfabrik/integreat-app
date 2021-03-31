// @flow

import type { FeedbackType } from 'api-client'

class FeedbackVariant {
  feedbackType: FeedbackType
  label: string
  alias: ?string
  value: string

  constructor({
    label,
    feedbackType,
    alias
  }: {|
    label: string,
    feedbackType: FeedbackType,
    alias?: string
  |}) {
    this.feedbackType = feedbackType
    this.label = label
    this.alias = alias
    this.value = label // Required for react-select
  }
}

export default FeedbackVariant
