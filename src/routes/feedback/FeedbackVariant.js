// @flow

class FeedbackVariant {
  feedbackType: string
  label: string

  constructor (label: string, feedbackType: string) {
    this.label = label
    this.feedbackType = feedbackType
  }
}

export default FeedbackVariant
