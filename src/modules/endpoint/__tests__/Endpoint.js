import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import Endpoint from '../Endpoint'
import Payload from '../Payload'

describe('Endpoint', () => {
  const mockStore = configureMockStore([thunk])

  const urlParams = {var1: 'a', var2: 'b'}
  const defaultFetchUrl = 'https://weird-endpoint/{var1}/{var2}/api.json'
  const defaultJsonMapper = (json) => json

  const createEndpoint = ({name = 'endpoint', fetchUrl = defaultFetchUrl, jsonMapper = defaultJsonMapper}) => {
    return new Endpoint(name, fetchUrl, jsonMapper, (state) => ({}), false)
  }

  const expectDispatchedActions = (dispatchResult, store, expectedActions) => {
    return store.dispatch(dispatchResult)
      .promise
      .then(() => expect(store.getActions()).toEqual(expectedActions))
  }

  test('should have corrent names', () => {
    const endpoint = createEndpoint({name: 'endpoint'})

    expect(endpoint.stateName).toBe('endpoint')
    expect(endpoint.payloadName).toBe('endpointPayload')
  })

  describe('Store interaction', () => {
    beforeEach(() => {
      fetch.resetMocks()
    })

    test('should create reducer correctly', () => {
      const endpoint = createEndpoint({})
      endpoint.createReducer()
    })

    test('should fetch correctly', () => {
      const endpoint = createEndpoint({
        name: 'endpoint',
        jsonMapper: (json) => json,
        fetchUrl: 'https://weird-endpoint/{var1}/{var2}/api.json'
      })
      const reducer = endpoint.createReducer()
      const store = mockStore({[endpoint.stateName]: reducer})
      const json = {test: 'random'}
      fetch.mockResponse(JSON.stringify(json))

      const expectedActions = [
        {
          type: 'START_FETCH_DATA_ENDPOINT',
          payload: new Payload(true)
        },
        {
          type: 'FINISH_FETCH_DATA_ENDPOINT',
          payload: new Payload(false,
            json,
            null,
            'https://weird-endpoint/a/b/api.json',
            expect.any(Number)
          )
        }
      ]

      return expectDispatchedActions(endpoint.requestAction(urlParams), store, expectedActions)
    })

    test('should fail if json is malformatted', () => {
      const endpoint = createEndpoint({
        name: 'endpoint',
        jsonMapper: (json) => json,
        fetchUrl: 'https://weird-endpoint/{var1}/{var2}/api.json'
      })
      const reducer = endpoint.createReducer()
      const store = mockStore({[endpoint.stateName]: reducer})
      const malformattedJson = 'I\'m so mean!'
      fetch.mockResponse(malformattedJson)

      const expectedActions = [
        {
          type: 'START_FETCH_DATA_ENDPOINT',
          payload: new Payload(true)
        },
        {
          type: 'FINISH_FETCH_DATA_ENDPOINT',
          payload: new Payload(false,
            null,
            'endpoint:page.loadingFailed',
            'https://weird-endpoint/a/b/api.json',
            expect.any(Number)
          )
        }
      ]

      return expectDispatchedActions(endpoint.requestAction(urlParams), store, expectedActions)
    })

    test('should fail if json transform is malformatted', () => {
      const errorMessage = 'Let the world burn!'
      const endpoint = createEndpoint({
        name: 'endpoint',
        jsonMapper: () => { throw new Error(errorMessage) },
        fetchUrl: 'https://weird-endpoint/{var1}/{var2}/api.json'
      })
      const reducer = endpoint.createReducer()
      const store = mockStore({[endpoint.stateName]: reducer})
      fetch.mockResponse(JSON.stringify({}))

      const expectedActions = [
        {
          type: 'START_FETCH_DATA_ENDPOINT',
          payload: new Payload(true)
        },
        {
          type: 'FINISH_FETCH_DATA_ENDPOINT',
          payload: new Payload(false,
            null,
            errorMessage,
            'https://weird-endpoint/a/b/api.json',
            expect.any(Number)
          )
        }
      ]

      return expectDispatchedActions(endpoint.requestAction(urlParams), store, expectedActions)
    })
  })
})
