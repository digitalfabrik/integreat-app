import React from 'react'
import { shallow, mount } from 'enzyme'
import { Provider } from 'react-redux'
import ConnectedLandingPage, { LandingPage } from '../LandingPage'
import Payload from 'modules/endpoint/Payload'
import LocationModel from '../../../../modules/endpoint/models/LocationModel'
import { mockLocations } from 'setupMocks'
import createHistory from '../../../../modules/app/createHistory'
import createReduxStore from '../../../../modules/app/createReduxStore'

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

  test('should match snapshot', () => {
    expect(shallow(<LandingPage locations={locations} language={'de'} />)).toMatchSnapshot()
  })

  describe('connect', () => {
    test('should map state to props', () => {
      const language = 'en'

      const store = createReduxStore(createHistory, {
        languages: new Payload(false),
        router: {params: {language}}
      })

      const tree = mount(
        <Provider store={store}>
          <ConnectedLandingPage />
        </Provider>
      )

      const landingPageProps = tree.find(LandingPage).props()

      expect(landingPageProps).toEqual({
        language,
        dispatch: expect.any(Function),
        requestAction: expect.any(Function),
        urlParams: {},
        locations: mockLocations,
        locationsPayload: new Payload(false, mockLocations, null, 'https://weird-endpoint/api.json', expect.any(Number))
      })
    })

    test('should fallback to "de" if state is empty', () => {
      const store = createReduxStore(createHistory, {router: {params: {}}}) /* todo: this test should also succeed if there is no router. Currently it does
                                            todo: not because of a missing check in mapStateToProps of Footer.js */

      const tree = mount(
        <Provider store={store}>
          <ConnectedLandingPage />
        </Provider>
      )

      const landingPageProps = tree.find(LandingPage).props()
      expect(landingPageProps.language).toEqual('de')
    })
  })
})
