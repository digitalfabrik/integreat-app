import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import Endpoint from '../Endpoint'

describe('Endpoint', () => {
  const mockStore = configureMockStore([thunk])

  const endpoint = new Endpoint('endpoint', 'https://weird-endpoint/{var1}/{var2}/api.json', (json) => json, (state) => ({}), false)

  test('should have corrent names', () => {
    expect(endpoint.stateName).toBe('endpoint')
    expect(endpoint.payloadName).toBe('endpointPayload')
  })

  test('should ', () => {
    const store = mockStore({[endpoint.stateName]: endpoint.createReducer()})
    store.subscribe((state) => console.log(state))
    store.dispatch(endpoint.requestAction({})).then(() => {
      // return of async actions
      // expect(store.getActions()).toEqual(expectedActions)
      console.log(store.getActions())
    })
  })
})
