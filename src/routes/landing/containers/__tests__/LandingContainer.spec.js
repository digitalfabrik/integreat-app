import React from 'react'
import { shallow } from 'enzyme'
import ConnectedLandingPage, { LandingContainer } from '../LandingContainer'
import CityModel from '../../../../modules/endpoint/models/CityModel'
import configureMockStore from 'redux-mock-store'

describe('LandingContainer', () => {
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
    expect(shallow(<LandingContainer cities={cities} language={'de'} t={key => key} />)).toMatchSnapshot()
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
