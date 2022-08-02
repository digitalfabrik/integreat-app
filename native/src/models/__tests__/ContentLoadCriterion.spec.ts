import moment from 'moment'

import { ContentLoadCriterion } from '../ContentLoadCriterion'

describe('ContentLoadCriterion', () => {
  // mock date to avoid test fails running at midnight
  const nowDateString = '2021-07-20T00:00:00'
  beforeAll(() => {
    jest.useFakeTimers()
    jest.setSystemTime(moment(nowDateString).utc().toDate().getTime())
  })

  afterAll(() => {
    jest.useRealTimers()
  })
  const stateView = new ContentLoadCriterion(
    {
      forceUpdate: false,
      shouldRefreshResources: false,
    },
    false
  )

  it('should not update content if last update was now', () => {
    expect(stateView.shouldUpdate(moment(nowDateString).utc())).toBeFalsy()
  })
  it('should update if content was updated 5 minutes before start of today', () => {
    const beforeStartDay = moment(nowDateString).utc().startOf('day').subtract(5, 'minutes')
    expect(stateView.shouldUpdate(beforeStartDay)).toBeTruthy()
  })
  it('should not update if content was updated 5 minutes after start of today', () => {
    const afterStartDay = moment(nowDateString).utc().startOf('day').add(5, 'minutes')
    expect(stateView.shouldUpdate(afterStartDay)).toBeFalsy()
  })
})
