// @flow

import React from 'react'
import { shallow } from 'enzyme'
import moment from 'moment-timezone'

import ConnectedDisclaimerPage, { DisclaimerPage } from '../DisclaimerPage'
import { PageModel } from '@integreat-app/integreat-api-client'
import configureMockStore from 'redux-mock-store'

describe('DisclaimerPage', () => {
  const disclaimer = new PageModel({
    id: 1689,
    title: 'Feedback, Kontakt und mögliches Engagement',
    content: 'this is a test content',
    lastUpdate: moment.tz('2017-11-18 19:30:00', 'UTC')
  })

  const language = 'de'

  it('should match snapshot', () => {
    const wrapper = shallow(
      <DisclaimerPage disclaimer={disclaimer}
                      language={language} />)
    expect(wrapper).toMatchSnapshot()
  })

  describe('connect', () => {
    const mockStore = configureMockStore()
    const store = mockStore({
      location: { payload: { language } }
    })

    it('should map state and fetched data to props', () => {
      const disclaimerPage = shallow(
        <ConnectedDisclaimerPage store={store} disclaimer={disclaimer} />
      )

      expect(disclaimerPage.find('DisclaimerPage').props()).toMatchObject({
        disclaimer,
        language
      })
    })
  })
})
