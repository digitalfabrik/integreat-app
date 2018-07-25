import React from 'react'
import { shallow } from 'enzyme'

import ConnectedDisclaimerPage, { DisclaimerPage } from '../DisclaimerPage'
import DisclaimerModel from 'modules/endpoint/models/DisclaimerModel'
import configureMockStore from 'redux-mock-store'
import CityModel from '../../../../modules/endpoint/models/CityModel'

describe('DisclaimerPage', () => {
  const disclaimer = new DisclaimerModel({
    id: 1689, title: 'Feedback, Kontakt und mögliches Engagement', content: 'this is a test content'
  })

  const cities = [
    new CityModel({
      name: 'Augsburg',
      code: 'augsburg',
      live: true,
      eventsEnabled: true,
      extrasEnabled: false
    })
  ]

  const city = 'augsburg'

  it('should match snapshot', () => {
    const wrapper = shallow(
      <DisclaimerPage disclaimer={disclaimer} city={city} cities={cities} t={key => key} />)
    expect(wrapper).toMatchSnapshot()
  })

  describe('connect', () => {
    const mockStore = configureMockStore()
    const store = mockStore({
      disclaimer: {data: disclaimer},
      cities: {data: cities},
      location: {payload: {city}}
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
