import React from 'react'
import { shallow } from 'enzyme'
import ConnectedLandingPage, { LandingPage } from '../LandingPage'
import CityModel from '../../../../modules/endpoint/models/CityModel'
import configureMockStore from 'redux-mock-store'

describe('LandingPage', () => {
  const cities = [
    new CityModel({
      name: 'City',
      code: 'city',
      live: true,
      eventsEnabled: false,
      extrasEnabled: false,
      sortingName: 'City'
    })
  ]

  it('should match snapshot', () => {
    expect(shallow(<LandingPage cities={cities} language={'de'} t={key => key} />)).toMatchSnapshot()
  })

  it('should map state to props', () => {
    const language = 'en'

    const location = {payload: {language}}

    const mockStore = configureMockStore()
    const store = mockStore({
      location: location,
      cities: {data: cities}
    })

    const landingPage = shallow(
      <ConnectedLandingPage store={store} />
    )

    expect(landingPage.props()).toMatchObject({
      language,
      cities
    })
  })
})
