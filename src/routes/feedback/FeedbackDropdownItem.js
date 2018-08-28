// @flow

class FeedbackDropdownItem {
  value: string
  feedbackType: ?string
  label: string

  constructor (label: string, feedbackType: ?string, value?: string) {
    this.value = value || label
    this.feedbackType = feedbackType
    this.label = label
  }
}

export default FeedbackDropdownItem
