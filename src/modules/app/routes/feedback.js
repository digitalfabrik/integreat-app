// @flow

import type { LocationState, Action } from 'redux-first-router'

export const goToFeedback = (location: LocationState, feedbackType: ?string): Action =>
  ({type: location.type, payload: location.payload, query: feedbackType && {feedback: feedbackType}})
