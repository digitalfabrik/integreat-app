import React from 'react'
import { Provider } from 'react-redux'
import EndpointBuilder from 'modules/endpoint/EndpointBuilder'
import { mount, shallow } from 'enzyme'
import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'
import ConnectedLocationLayout, { LocationLayout } from '../LocationLayout'
import Payload from 'modules/endpoint/Payload'
import LocationModel from 'modules/endpoint/models/LocationModel'
import EndpointProvider from '../../../endpoint/EndpointProvider'
import Header from '../../components/Header'
import { HALF_HEADER_HEIGHT_SMALL, HEADER_HEIGHT_LARGE } from '../../constants'

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
      .withUrl('https://weird-endpoint/api.json')
      .withMapper(json => json)
      .withResponseOverride(locations)
      .build()

    const mockStore = configureMockStore([thunk])

    test('should map state to props', () => {
      const store = mockStore({
        locations: new Payload(false),
        router: {params: {location: 'augsburg', language: 'en', id: '1234'}, route: '/:location/:language'},
        viewport: {is: {small: true}}
      })

      const tree = mount(
        <Provider store={store}>
          <EndpointProvider endpoints={[locationsEndpoint]}>
            <ConnectedLocationLayout><MockNode /></ConnectedLocationLayout>
          </EndpointProvider>
        </Provider>
      )
      // todo: add locations
      expect(tree.find(ConnectedLocationLayout).childAt(0).props()).toMatchSnapshot()
    })

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
