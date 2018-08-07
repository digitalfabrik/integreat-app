// @flow

class FeedbackDropdownItem {
  value: string
  feedbackType: ?string
  label: string

  constructor (label: string, feedbackType: ?string) {
    this.value = label
    this.feedbackType = feedbackType
    this.label = label
  }
}

export default FeedbackDropdownItem
