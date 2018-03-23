import React from 'react'
import { mount, shallow } from 'enzyme'
import { Provider } from 'react-redux'
import ConnectedLandingPage, { LandingPage } from '../LandingPage'
import CityModel from '../../../../modules/endpoint/models/CityModel'
import createReduxStore from '../../../../modules/app/createReduxStore'
import createHistory from '../../../../modules/app/createHistory'

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

      const store = createReduxStore(createHistory, {
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
