// @flow

import React from 'react'
import { shallow } from 'enzyme'
import ConnectedLandingPage, { LandingPage } from '../LandingPage'
import { CityModel } from '@integreat-app/integreat-api-client'
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

  const t = (key: ?string): string => key || ''

  it('should match snapshot', () => {
    expect(shallow(<LandingPage cities={cities} language={'de'} t={t} />)).toMatchSnapshot()
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
      <ConnectedLandingPage store={store} cities={cities} />
    )

    expect(landingPage.props()).toMatchObject({
      language,
      cities
    })
  })
})
