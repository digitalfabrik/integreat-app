import React from 'react'
import { shallow } from 'enzyme'
import ConnectedLandingPage, { LandingPage } from '../LandingPage'
import CityModel from '../../../../modules/endpoint/models/CityModel'
import configureMockStore from 'redux-mock-store'
import { ThemeProvider } from 'styled-components'
import theme from '../../../../modules/app/constants/theme'

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

  it('should map state to props', () => {
    const language = 'en'

    const location = {payload: {language}}

    const mockStore = configureMockStore()
    const store = mockStore({
      location: location,
      cities: {data: cities}
    })

    const tree = shallow(
      <ConnectedLandingPage store={store} />
    )

    const landingPageProps = tree.find(LandingPage).props()

    expect(landingPageProps).toEqual({
      language,
      cities,
      store: store,
      storeSubscription: expect.any(Object),
      dispatch: expect.any(Function)
    })
  })
})
