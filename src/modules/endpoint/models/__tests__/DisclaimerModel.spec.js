// @flow

import DisclaimerModel from '../DisclaimerModel'
import moment from 'moment'

describe('DisclaimerModel', () => {
  it('should return correct attributes', () => {
    const props = {
      id: 1689,
      title: 'Feedback, Kontakt und mögliches Engagement',
      content: 'test content blablabla',
      lastUpdate: moment('2016-01-07 10:36:24')
    }
    const disclaimer = new DisclaimerModel(props)
    expect(disclaimer.id).toBe(props.id)
    expect(disclaimer.title).toBe(props.title)
    expect(disclaimer.content).toBe(props.content)
  })
})
