import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import lolex from 'lolex'

import Endpoint from '../Endpoint'
import Payload from '../Payload'

describe('Endpoint', () => {
  const mockStore = configureMockStore([thunk])

  const defaultMapStateToUrl = state => `https://weird-endpoint/${state.var1}/${state.var2}/api.json`
  const defaultJsonMapper = json => json

  const createEndpoint = ({name = 'endpoint', mapStateToUrl = defaultMapStateToUrl, jsonMapper = defaultJsonMapper, responseOverride, errorOverride}) => {
    return new Endpoint(name, mapStateToUrl, jsonMapper, responseOverride, errorOverride)
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

  it('should throw if needed state params are undefined', () => {
    const endpoint = createEndpoint({name: 'endpoint'})

    const dipatch = () => {}
    const getState = () => ({endpoint: new Payload(false), var1: 'a'})
    expect(() => endpoint.requestAction()(dipatch, getState)).toThrowErrorMatchingSnapshot()
    expect(() => endpoint.requestAction()(dipatch, getState)).toThrowErrorMatchingSnapshot()
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
    let prevError

    beforeEach(() => {
      clock = lolex.install({now: mockedTime, toFake: []})
      prevError = console.error // todo: Find better way of allowing console.error
      console.error = error => console.log(`Some expected error was thrown: ${error}`)
    })

    afterEach(() => {
      fetch.resetMocks()
      clock.uninstall()
      console.error = prevError
    })

    it('should fetch correctly', () => {
      const endpoint = createEndpoint({
        name: 'endpoint',
        jsonMapper: json => json
      })
      const store = mockStore({[endpoint.stateName]: new Payload(false), var1: 'a', var2: 'b'})
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

      return expectActions(endpoint.requestAction(), store, expectedActions)
    })

    it('should fail if json is malformatted', () => {
      const endpoint = createEndpoint({
        name: 'endpoint',
        jsonMapper: json => json,
        fetchUrl: 'https://weird-endpoint/{var1}/{var2}/api.json'
      })
      const store = mockStore({[endpoint.stateName]: new Payload(false), var1: 'a', var2: 'b'})
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

      return expectActions(endpoint.requestAction(), store, expectedActions)
    })

    it('should fail if json transform is malformatted', () => {
      const errorMessage = 'Let the world burn!'
      const endpoint = createEndpoint({
        name: 'endpoint',
        jsonMapper: () => { throw new Error(errorMessage) },
        fetchUrl: 'https://weird-endpoint/{var1}/{var2}/api.json'
      })
      const store = mockStore({[endpoint.stateName]: new Payload(false), var1: 'a', var2: 'b'})
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

      return expectActions(endpoint.requestAction(), store, expectedActions)
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
          mockedTime),
        var1: 'a',
        var2: 'b'
      })

      return expectActions(endpoint.requestAction(), store, [])
        .then(storeResponse => expect(storeResponse.dataAvailable).toBe(true))
    })

    it('should not fetch while fetching', () => {
      const endpoint = createEndpoint({})
      const store = mockStore({
        [endpoint.stateName]: new Payload(true), var1: 'a', var2: 'b'
      })

      return expectActions(endpoint.requestAction(), store, [])
        .then(storeResponse => expect(storeResponse.dataAvailable).toBe(false))
    })

    it('should use overrideResponse correctly', () => {
      const json = {test: 'random'}

      const endpoint = createEndpoint({
        name: 'endpoint',
        jsonMapper: json => json,
        fetchUrl: 'https://weird-endpoint/{var1}/{var2}/api.json',
        responseOverride: json
      })
      const store = mockStore({[endpoint.stateName]: new Payload(false), var1: 'a', var2: 'b'})
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

      return expectActions(endpoint.requestAction(), store, expectedActions)
    })

    it('should use overrideError correctly', () => {
      const error = 'Error No. 5'

      const endpoint = createEndpoint({
        name: 'endpoint',
        jsonMapper: json => json,
        fetchUrl: 'https://weird-endpoint/{var1}/{var2}/api.json',
        errorOverride: error
      })
      const store = mockStore({[endpoint.stateName]: new Payload(false), var1: 'a', var2: 'b'})
      const expectedActions = [
        {
          type: 'START_FETCH_DATA_ENDPOINT',
          payload: new Payload(true)
        },
        {
          type: 'FINISH_FETCH_DATA_ENDPOINT',
          payload: new Payload(false,
            null,
            error,
            'https://weird-endpoint/a/b/api.json',
            mockedTime
          )
        }
      ]

      return expectActions(endpoint.requestAction(), store, expectedActions)
    })
  })
})
