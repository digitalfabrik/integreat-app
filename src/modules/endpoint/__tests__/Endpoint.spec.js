import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import lolex from 'lolex'

import Endpoint from '../Endpoint'
import Payload from '../Payload'

describe('Endpoint', () => {
  const mockStore = configureMockStore([thunk])

  const state = {var1: 'a', var2: 'b'}
  const defaultMapStateToUrl = (state) => `https://weird-endpoint/${state.var1}/${state.var2}/api.json`
  const defaultJsonMapper = (json) => json

  const createEndpoint = (
    {name = 'endpoint', mapStateToUrl = defaultMapStateToUrl, jsonMapper = defaultJsonMapper, responseOverride}) => {
    return new Endpoint(name, mapStateToUrl, jsonMapper, false, responseOverride)
  }

  const expectActions = (dispatchResult, store, expectedActions) => {
    const storeResponse = store.dispatch(dispatchResult)
    return storeResponse.promise.then(() => {
      expect(store.getActions()).toEqual(expectedActions)
      return storeResponse
    })
  }

  it('should have correct names', () => {
    const endpoint = createEndpoint({name: 'endpoint'})

    expect(endpoint.stateName).toBe('endpoint')
    expect(endpoint.payloadName).toBe('endpointPayload')
  })

  test('should throw if needed state params are undefined', () => {
    const endpoint = createEndpoint({name: 'endpoint'})

    expect(endpoint.requestAction(undefined)).toThrow()
    expect(endpoint.requestAction({var1: 'a'})).toThrow()
  })

  describe('Reducer', () => {
    let clock
    const mockedTime = 0

    beforeEach(() => {
      clock = lolex.install({now: mockedTime, toFake: []})
    })

    afterEach(() => {
      clock.uninstall()
    })

    it('should return the initial state', () => {
      const reducer = createEndpoint({}).createReducer()
      expect(reducer(undefined, {})).toEqual(new Payload(false))
    })

    it('should handle startFetchAction', () => {
      const endpoint = createEndpoint({})
      const reducer = endpoint.createReducer()
      expect(reducer({}, endpoint.startFetchAction()))
        .toEqual(new Payload(true))
    })

    it('should handle finishFetchAction if data was received', () => {
      const endpoint = createEndpoint({})
      const reducer = endpoint.createReducer()
      const json = {data: 'test'}
      const url = 'https://someurl/api.json'
      expect(reducer({}, endpoint.finishFetchAction(json, null, url)))
        .toEqual(new Payload(false, json, null, url, mockedTime))
    })

    it('should handle finishFetchAction if error occurred', () => {
      const endpoint = createEndpoint({})
      const reducer = endpoint.createReducer()
      const error = 'error'
      const url = 'https://someurl/api.json'
      expect(reducer({}, endpoint.finishFetchAction(null, error, url)))
        .toEqual(new Payload(false, null, error, url, mockedTime))
    })
  })

  describe('Actions', () => {
    let clock
    const mockedTime = 0

    beforeEach(() => {
      clock = lolex.install({now: mockedTime, toFake: []})
    })

    afterEach(() => {
      fetch.resetMocks()
      clock.uninstall()
    })

    it('should fetch correctly', () => {
      const endpoint = createEndpoint({
        name: 'endpoint',
        jsonMapper: (json) => json
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

      return expectActions(endpoint.requestAction(state), store, expectedActions)
    })

    it('should fail if json is malformatted', () => {
      const endpoint = createEndpoint({
        name: 'endpoint',
        jsonMapper: json => json,
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

      return expectActions(endpoint.requestAction(state), store, expectedActions)
    })

    it('should fail if json transform is malformatted', () => {
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
            'endpoint:page.loadingFailed',
            'https://weird-endpoint/a/b/api.json',
            mockedTime
          )
        }
      ]

      return expectActions(endpoint.requestAction(state), store, expectedActions)
    })

    it('should not refetch if there is a recent one', () => {
      const endpoint = createEndpoint({
        name: 'endpoint',
        jsonMapper: json => json,
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

      return expectActions(endpoint.requestAction(state), store, [])
        .then((storeResponse) => expect(storeResponse.dataAvailable).toBe(true))
    })

    test('should not fetch while fetching', () => {
      const endpoint = createEndpoint({})
      const store = mockStore({
        [endpoint.stateName]: new Payload(true)
      })

      return expectActions(endpoint.requestAction(state), store, [])
        .then((storeResponse) => expect(storeResponse.dataAvailable).toBe(false))
    })

    it('should use override correctly', () => {
      const json = {test: 'random'}

      const endpoint = createEndpoint({
        name: 'endpoint',
        jsonMapper: json => json,
        fetchUrl: 'https://weird-endpoint/{var1}/{var2}/api.json',
        responseOverride: json
      })
      const store = mockStore({[endpoint.stateName]: new Payload(false)})
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

      return expectActions(endpoint.requestAction(state), store, expectedActions)
    })
  })
})
