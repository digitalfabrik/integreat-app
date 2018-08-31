// @flow

import React from 'react'
import { shallow } from 'enzyme'
import moment from 'moment-timezone'

import ConnectedDisclaimerPage, { DisclaimerPage } from '../DisclaimerPage'
import DisclaimerModel from 'modules/endpoint/models/DisclaimerModel'
import configureMockStore from 'redux-mock-store'
import CityModel from '../../../../modules/endpoint/models/CityModel'

describe('DisclaimerPage', () => {
  const disclaimer = new DisclaimerModel({
    id: 1689,
    title: 'Feedback, Kontakt und mögliches Engagement',
    content: 'this is a test content',
    lastUpdate: moment.tz('2017-11-18 19:30:00', 'UTC')
  })

  const cities = [
    new CityModel({
      name: 'Augsburg',
      code: 'augsburg',
      live: true,
      eventsEnabled: true,
      extrasEnabled: false,
      sortingName: 'Augsburg'
    })
  ]
  const t = (key: ?string): string => key || ''

  const city = 'augsburg'
  const language = 'de'

  it('should match snapshot', () => {
    const wrapper = shallow(
      <DisclaimerPage disclaimer={disclaimer} city={city} cities={cities} t={t} language={language} routesMap={{}}
                      dispatch={() => {}} />)
    expect(wrapper).toMatchSnapshot()
  })

  describe('connect', () => {
    const mockStore = configureMockStore()
    const store = mockStore({
      disclaimer: {data: disclaimer},
      cities: {data: cities},
      location: {payload: {city, language}}
    })

    it('should map state and fetched data to props', () => {
      const disclaimerPage = shallow(
        <ConnectedDisclaimerPage store={store} />
      )

      expect(disclaimerPage.props()).toMatchObject({
        disclaimer: disclaimer,
        city,
        cities
      })
    })
  })
})
