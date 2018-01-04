import React from 'react'
import { Provider } from 'react-redux'
import EndpointBuilder from 'modules/endpoint/EndpointBuilder'
import { mount, shallow } from 'enzyme'
import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'
import ConnectedLocationLayout, { LocationLayout } from '../LocationLayout'
import Payload from 'modules/endpoint/Payload'
import LocationModel from 'modules/endpoint/models/LocationModel'
import Navigation from 'modules/app/Navigation'

describe('LocationLayout', () => {
  const locations = [new LocationModel({name: 'Mambo No. 5', code: 'location1'})]

  const MockNode = () => <div />

  describe('connect', () => {
    const mockLocationsEndpoint = new EndpointBuilder('locations')
      .withUrl('https://weird-endpoint/api.json')
      .withMapper(json => json)
      .withResponseOverride(locations)
      .build()

    jest.mock('modules/endpoint/endpoints/locations', () => mockLocationsEndpoint)

    const mockStore = configureMockStore([thunk])

    const store = mockStore({
      locations: new Payload(false),
      router: {params: {location: 'augsburg', language: 'en', id: '1234'}, route: '/:location/:language'}
    })
    test('should map state to props', () => {

      const tree = mount(
        <Provider store={store}>
          <ConnectedLocationLayout><MockNode /></ConnectedLocationLayout>
        </Provider>
      )
      // todo: add locations
      expect(tree.find(ConnectedLocationLayout).childAt(0).props()).toMatchSnapshot()
    })
  })

  test('should show LocationHeader and LocationFooter if LocationModel is available', () => {
    const component = shallow(
      <LocationLayout location='location1'
                      navigation={new Navigation('location1', 'language1')}
                      locations={locations}
                      route='/:location/:language'>
        <MockNode />
      </LocationLayout>)
    expect(component).toMatchSnapshot()
  })

  test('should show GeneralHeader and GeneralFooter if LocationModel is not available', () => {
    const component = shallow(
      <LocationLayout location='unavailableLocation'
                      navigation={new Navigation('location1', 'language1')}
                      locations={locations}
                      route='/:location/:language'>
        <MockNode />
      </LocationLayout>)
    expect(component).toMatchSnapshot()
  })

})
