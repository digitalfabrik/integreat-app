import React from 'react'
import { mount, shallow } from 'enzyme'
import { Provider } from 'react-redux'
import ConnectedLandingPage, { LandingPage } from '../LandingPage'
import Payload from 'modules/endpoint/Payload'
import LocationModel from '../../../../modules/endpoint/models/LocationModel'
import createHistory from '../../../../modules/app/createHistory'
import createReduxStore from '../../../../modules/app/createReduxStore'
import EndpointProvider from '../../../../modules/endpoint/EndpointProvider'
import EndpointBuilder from '../../../../modules/endpoint/EndpointBuilder'
import { ThemeProvider } from 'styled-components'
import theme from '../../../../modules/app/constants/theme'

describe('LandingPage', () => {
  const locations = [
    new LocationModel({
      name: 'City',
      code: 'city',
      live: true,
      eventsEnabled: false,
      extrasEnabled: false
    })
  ]

  it('should match snapshot', () => {
    expect(shallow(<LandingPage locations={locations} language={'de'} />)).toMatchSnapshot()
  })

  describe('connect()', () => {
    const locationsEndpoint = new EndpointBuilder('locations')
      .withStateToUrlMapper(() => 'https://weird-endpoint/api.json')
      .withMapper(json => json)
      .withResponseOverride(locations)
      .build()

    it('should map state to props', () => {
      const language = 'en'

      const store = createReduxStore(createHistory, {
        locations: new Payload(false),
        router: {params: {language}}
      })

      const tree = mount(
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <EndpointProvider endpoints={[locationsEndpoint]}>
              <ConnectedLandingPage />
            </EndpointProvider>
          </Provider>
        </ThemeProvider>
      )

      const landingPageProps = tree.find(LandingPage).props()

      expect(landingPageProps).toEqual({
        language,
        locations,
        dispatch: expect.any(Function)
      })
    })

    it('should fallback to "de" if state is empty', () => {
      const store = createReduxStore(createHistory, {
        locations: new Payload(false)
      })

      const tree = mount(
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <EndpointProvider endpoints={[locationsEndpoint]}>
              <ConnectedLandingPage />
            </EndpointProvider>
          </Provider>
        </ThemeProvider>
      )

      const landingPageProps = tree.find(LandingPage).props()
      expect(landingPageProps.language).toEqual('de')
    })
  })
})
