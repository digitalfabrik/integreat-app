import React from 'react'
import { mount, shallow } from 'enzyme'
import { Provider } from 'react-redux'
import ConnectedLandingPage, { LandingPage } from '../LandingPage'
import LocationModel from '../../../../modules/endpoint/models/CityModel'
import createHistory from '../../../../modules/app/createHistory'
import createReduxStore from '../../../../modules/app/createReduxStore'
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
    it('should map state to props', () => {
      const language = 'en'

      const store = createReduxStore(createHistory, {
        router: {params: {language}}
      })

      const tree = mount(
        <ThemeProvider theme={theme}>
          <Provider store={store}>
          <ConnectedLandingPage locations={locations} />
        </Provider></ThemeProvider>
      )

      const landingPageProps = tree.find(LandingPage).props()

      expect(landingPageProps).toEqual({
        language,
        locations,
        dispatch: expect.any(Function)
      })
    })

    it('should fallback to "de" if state is empty', () => {
      const store = createReduxStore(createHistory, {})

      const tree = mount(
        <ThemeProvider theme={theme}>
          <Provider store={store}>
          <ConnectedLandingPage locations={locations} />
        </Provider></ThemeProvider>
      )

      const landingPageProps = tree.find(LandingPage).props()
      expect(landingPageProps.language).toEqual('de')
    })
  })
})
