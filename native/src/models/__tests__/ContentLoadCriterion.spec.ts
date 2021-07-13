import moment from 'moment'

import { ContentLoadCriterion } from '../ContentLoadCriterion'

describe('ContentLoadCriterion', () => {
  const stateView = new ContentLoadCriterion(
    {
      forceUpdate: false,
      shouldRefreshResources: false
    },
    false
  )
  it('should not update content if last update was now', () => {
    const now = moment.utc()
    expect(stateView.shouldUpdate(now)).toBeFalsy()
  })
  it('should update if content was updated 5 minutes before start of today', () => {
    const beforeStartDay = moment.utc().startOf('day').subtract(5, 'minutes')
    expect(stateView.shouldUpdate(beforeStartDay)).toBeTruthy()
  })
})
