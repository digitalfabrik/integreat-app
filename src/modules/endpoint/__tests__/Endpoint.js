import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import lolex from 'lolex'

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

  const expectActions = (dispatchResult, store, expectedActions) => {
    const storeResponse = store.dispatch(dispatchResult)
    return storeResponse.promise.then(() => {
      expect(store.getActions()).toEqual(expectedActions)
      return storeResponse
    })
  }

  test('should have corrent names', () => {
    const endpoint = createEndpoint({name: 'endpoint'})

    expect(endpoint.stateName).toBe('endpoint')
    expect(endpoint.payloadName).toBe('endpointPayload')
  })

  describe('Store interaction', () => {
    let clock
    const mockedTime = 0

    beforeEach(() => {
      clock = lolex.install({now: mockedTime, toFake: []})
    })

    afterEach(() => {
      fetch.resetMocks()
      clock.uninstall()
    })

    describe('Reducer', () => {
      test('should return the initial state', () => {
        const reducer = createEndpoint({}).createReducer()
        expect(reducer(undefined, {})).toEqual(new Payload(false))
      })

      test('should handle startFetchAction', () => {
        const endpoint = createEndpoint({})
        const reducer = endpoint.createReducer()
        expect(reducer({}, endpoint.startFetchAction()))
          .toEqual(new Payload(true))
      })

      test('should handle finishFetchAction if data was received', () => {
        const endpoint = createEndpoint({})
        const reducer = endpoint.createReducer()
        const json = { data: 'test' }
        const url = 'https://someurl/api.json'
        expect(reducer({}, endpoint.finishFetchAction(json, null, url)))
          .toEqual(new Payload(false, json, null, url, 0))
      })

      test('should handle finishFetchAction if error occured', () => {
        const endpoint = createEndpoint({})
        const reducer = endpoint.createReducer()
        const error = 'error'
        const url = 'https://someurl/api.json'
        expect(reducer({}, endpoint.finishFetchAction(null, error, url)))
          .toEqual(new Payload(false, null, error, url, 0))
      })
    })

    test('should fetch correctly', () => {
      const endpoint = createEndpoint({
        name: 'endpoint',
        jsonMapper: (json) => json,
        fetchUrl: 'https://weird-endpoint/{var1}/{var2}/api.json'
      })
      const store = mockStore({[endpoint.stateName]: new Payload(false)})
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
            mockedTime
          )
        }
      ]

      return expectActions(endpoint.requestAction(urlParams), store, expectedActions)
    })

    test('should fail if json is malformatted', () => {
      const endpoint = createEndpoint({
        name: 'endpoint',
        jsonMapper: (json) => json,
        fetchUrl: 'https://weird-endpoint/{var1}/{var2}/api.json'
      })
      const store = mockStore({[endpoint.stateName]: new Payload(false)})
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
            mockedTime
          )
        }
      ]

      return expectActions(endpoint.requestAction(urlParams), store, expectedActions)
    })

    test('should fail if json transform is malformatted', () => {
      const errorMessage = 'Let the world burn!'
      const endpoint = createEndpoint({
        name: 'endpoint',
        jsonMapper: () => { throw new Error(errorMessage) },
        fetchUrl: 'https://weird-endpoint/{var1}/{var2}/api.json'
      })
      const store = mockStore({[endpoint.stateName]: new Payload(false)})
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
            mockedTime
          )
        }
      ]

      return expectActions(endpoint.requestAction(urlParams), store, expectedActions)
    })

    test('should not refetch if there is a recent one', () => {
      const endpoint = createEndpoint({
        name: 'endpoint',
        jsonMapper: (json) => json,
        fetchUrl: 'https://weird-endpoint/{var1}/{var2}/api.json'
      })
      const json = {test: 'random'}
      const store = mockStore({
        [endpoint.stateName]: new Payload(
          false,
          json,
          null,
          'https://weird-endpoint/a/b/api.json',
          mockedTime)
      })

      return expectActions(endpoint.requestAction(urlParams), store, [])
        .then((storeResponse) => expect(storeResponse.dataAvailable).toBe(true))
    })

    test('should not fetch while fetching', () => {
      const endpoint = createEndpoint({})
      const store = mockStore({
        [endpoint.stateName]: new Payload(true)
      })

      return expectActions(endpoint.requestAction(urlParams), store, [])
        .then((storeResponse) => expect(storeResponse.dataAvailable).toBe(false))
    })
  })
})
