import React from 'react'
import { mount, shallow } from 'enzyme'
import { Provider } from 'react-redux'
import ConnectedLandingPage, { LandingPage } from '../LandingPage'
import CityModel from '../../../../modules/endpoint/models/CityModel'
import configureMockStore from 'redux-mock-store'
import routesMap from '../../../../modules/app/routesMap'
import { LANDING_ROUTE } from '../../../../modules/app/routes/landing'

describe('LandingPage', () => {
  const cities = [
    new CityModel({
      name: 'City',
      code: 'city',
      live: true,
      eventsEnabled: false,
      extrasEnabled: false
    })
  ]

  it('should match snapshot', () => {
    expect(shallow(<LandingPage cities={cities} language={'de'} />)).toMatchSnapshot()
  })

  describe('connect()', () => {
    it('should map state to props', () => {
      const language = 'en'

      const mockStore = configureMockStore()
      const store = mockStore({
        location: {payload: {language: language}, pathname: '/landing/en', routesMap: routesMap, type: LANDING_ROUTE},
        cities: {data: cities}
      })

      const tree = mount(
        <Provider store={store}>
          <ConnectedLandingPage />
        </Provider>
      )

      const landingPageProps = tree.find(LandingPage).props()

      expect(landingPageProps).toEqual({
        language,
        cities
      })
    })
  })
})
