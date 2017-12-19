import React from 'react'
import withFetcher from '../withFetcher'
import { Provider } from 'react-redux'
import { mount } from 'enzyme'
import configureMockStore from 'redux-mock-store'
import EndpointBuilder from '../../EndpointBuilder'
import thunk from 'redux-thunk'
import Payload from '../../Payload'

describe('withFetcher', () => {
  const mockStore = configureMockStore([thunk])
  const endpoint = new EndpointBuilder('endpoint')
    .withUrl('https://someendpoint/api.json')
    .withMapper((json) => json)
    .withResponseOverride({test: 'random'})
    .build()

  test('should ', () => {
    const store = mockStore({endpoint: new Payload(false)})
    const TestComponent = () => <span>Text</span>
    const HOC = withFetcher(endpoint, true, true)
    const Hoced = HOC(TestComponent)

    const mounted = mount(<Provider store={store}>
      <Hoced/>
    </Provider>)


  })
})
