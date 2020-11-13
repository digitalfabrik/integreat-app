// @flow

import React from 'react'
import { shallow } from 'enzyme'
import ConnectedLandingPage, { LandingPage } from '../LandingPage'
import { CityModel } from 'api-client'
import configureMockStore from 'redux-mock-store'
import { LANDING_ROUTE } from '../../../../modules/app/route-configs/LandingRouteConfig'
import { routesMap } from '../../../../modules/app/route-configs'

describe('LandingPage', () => {
  const cities = [
    new CityModel({
      name: 'City',
      code: 'city',
      live: true,
      eventsEnabled: false,
      offersEnabled: false,
      pushNotificationsEnabled: false,
      tunewsEnabled: false,
      sortingName: 'City',
      aliases: null,
      prefix: null,
      longitude: null,
      latitude: null
    })
  ]

  it('should match snapshot', () => {
    expect(shallow(<LandingPage cities={cities} language='de' />)).toMatchSnapshot()
  })

  it('should map state to props', () => {
    const language = 'en'

    const location = { type: LANDING_ROUTE, payload: { language }, routesMap }

    const mockStore = configureMockStore()
    const store = mockStore({
      location: location,
      cities: { data: cities }
    })

    const landingPage = shallow(
      <ConnectedLandingPage store={store} cities={cities} />
    )

    expect(landingPage.find(LandingPage).props()).toMatchObject({
      language,
      cities
    })
  })
})
