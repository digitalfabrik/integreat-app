import React from 'react'
import { Provider } from 'react-redux'
import EndpointBuilder from 'modules/endpoint/EndpointBuilder'
import { mount, shallow } from 'enzyme'
import ConnectedLocationLayout, { LocationLayout } from '../LocationLayout'
import LocationModel from 'modules/endpoint/models/LocationModel'
import EndpointProvider from '../../../endpoint/EndpointProvider'
import { HALF_HEADER_HEIGHT_SMALL, HEADER_HEIGHT_LARGE } from '../../constants'
import createReduxStore from '../../../app/createReduxStore'
import createHistory from '../../../app/createHistory'
import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'
import Payload from '../../../endpoint/Payload'

describe('LocationLayout', () => {
  const matchRoute = (id) => {}

  const language = 'de'

  const locations = [new LocationModel({name: 'Mambo No. 5', code: 'location1'})]

  const MockNode = () => <div />

  test('should show LocationHeader and LocationFooter if LocationModel is available', () => {
    const component = shallow(
      <LocationLayout location='location1' language={language}
                      matchRoute={matchRoute}
                      locations={locations}
                      scrollHeight={0}
                      currentPath='/:location/:language'>
        <MockNode />
      </LocationLayout>)
    expect(component).toMatchSnapshot()
  })

  test('should show GeneralHeader and GeneralFooter if LocationModel is not available', () => {
    const component = shallow(
      <LocationLayout location='unavailableLocation' language={language}
                      matchRoute={matchRoute}
                      locations={locations}
                      scrollHeight={0}
                      currentPath='/:location/:language'>
        <MockNode />
      </LocationLayout>)
    expect(component).toMatchSnapshot()
  })

  describe('connect()', () => {
    const locationsEndpoint = new EndpointBuilder('locations')
      .withStateToUrlMapper(() => 'https://weird-endpoint/api.json')
      .withMapper(json => json)
      .withResponseOverride(locations)
      .build()

    const location = 'augsburg'
    const path = '/:location/:language'

    test('should map state to props', () => {
      const store = createReduxStore(createHistory, {
        router: {params: {location: location, language: language}, route: path},
        viewport: {is: {small: false}}
      })

      const locationLayout = mount(
        <Provider store={store}>
          <EndpointProvider endpoints={[locationsEndpoint]}>
            <ConnectedLocationLayout />
          </EndpointProvider>
        </Provider>
      ).find(LocationLayout)

      expect(locationLayout.props()).toEqual({
        currentPath: path,
        location: location,
        language: language,
        locations: locations,
        scrollHeight: HEADER_HEIGHT_LARGE,
        dispatch: expect.any(Function)
      })
    })

    const mockStore = configureMockStore([thunk])

    const createComponentInViewport = (small) => {
      const smallStore = mockStore({
        locations: new Payload(false),
        router: {params: {location: 'augsburg', language: 'en', id: '1234'}, route: '/:location/:language'},
        viewport: {is: {small}}
      })
      return mount(
        <Provider store={smallStore}>
          <EndpointProvider endpoints={[locationsEndpoint]}>
            <ConnectedLocationLayout><MockNode /></ConnectedLocationLayout>
          </EndpointProvider>
        </Provider>
      )
    }

    test('should have correct scroll height', () => {
      const smallComponent = createComponentInViewport(true).find(ConnectedLocationLayout).childAt(0)
      expect(smallComponent.prop('scrollHeight')).toBe(HALF_HEADER_HEIGHT_SMALL)

      const largeComponent = createComponentInViewport(false).find(ConnectedLocationLayout).childAt(0)
      expect(largeComponent.prop('scrollHeight')).toBe(HEADER_HEIGHT_LARGE)
    })
  })
})
