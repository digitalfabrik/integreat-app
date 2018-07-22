import lolex from 'lolex'

import Endpoint from '../Endpoint'
import Payload from '../Payload'
import startFetchAction from '../actions/startFetchAction'
import finishFetchAction from '../actions/finishFetchAction'

describe('Endpoint', () => {
  const stateName = 'endpoint'

  const defaultMapParamsToUrl = params => `https://weird-endpoint/${params.var1}/${params.var2}/api.json`
  const defaultJsonMapper = json => json

  const createEndpoint = ({name = stateName, mapParamsToUrl = defaultMapParamsToUrl, jsonMapper = defaultJsonMapper, responseOverride, errorOverride}) => {
    return new Endpoint(name, mapParamsToUrl, jsonMapper, responseOverride, errorOverride)
  }

  it('should have correct state name', () => {
    const endpoint = createEndpoint({name: 'endpoint'})

    expect(endpoint.stateName).toBe('endpoint')
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

    it('should fetch correctly if the data has not been fetched yet', async () => {
      const endpoint = createEndpoint({
        jsonMapper: json => json
      })
      const json = {test: 'random'}
      const dispatch = jest.fn()
      const oldPayload = new Payload(false)
      const params = {var1: 'a', var2: 'b'}
      fetch.mockResponse(JSON.stringify(json))

      const data = await endpoint.loadData(dispatch, oldPayload, params)
      const payload = new Payload(false, defaultMapParamsToUrl(params), json, null)

      expect(data).toEqual(payload)
      expect(dispatch).toHaveBeenCalledTimes(2)
      expect(dispatch).toHaveBeenCalledWith(startFetchAction(stateName, defaultMapParamsToUrl(params)))
      expect(dispatch).toHaveBeenCalledWith(finishFetchAction(stateName, payload))
    })

    it('should fetch correctly if the fetched data is outdated', async () => {
      const endpoint = createEndpoint({
        jsonMapper: json => json
      })
      const json = {test: 'random'}
      const dispatch = jest.fn()
      const oldPayload = new Payload(false, 'https://weird-endpoint/old-url/api.json', {}, null)
      const params = {var1: 'a', var2: 'b'}
      fetch.mockResponse(JSON.stringify(json))

      const data = await endpoint.loadData(dispatch, oldPayload, params)
      const payload = new Payload(false, defaultMapParamsToUrl(params), json, null)

      expect(data).toEqual(payload)
      expect(dispatch).toHaveBeenCalledTimes(2)
      expect(dispatch).toHaveBeenCalledWith(startFetchAction(stateName, defaultMapParamsToUrl(params)))
      expect(dispatch).toHaveBeenCalledWith(finishFetchAction(stateName, payload))
    })

    // it('should fail if json is malformed', async () => {
    //   const endpoint = createEndpoint({
    //     jsonMapper: json => json
    //   })
    //   const malformedJSON = 'I\'m so mean!'
    //   const dispatch = jest.fn()
    //   const oldPayload = new Payload(false, 'https://weird-endpoint/old-url/api.json', {}, null)
    //   const params = {var1: 'a', var2: 'b'}
    //   fetch.mockResponse(malformedJSON)
    //
    //   const data = await endpoint.loadData(dispatch, oldPayload, params)
    //   const mappingError = new MappingError(
    //     stateName, 'invalid json response body at undefined reason: Unexpected token I in JSON at position 0'
    //   )
    //   const payload = new Payload(false, defaultMapParamsToUrl(params), null,
    //     new LoadingError(endpoint.stateName, mappingError.message)
    //   )
    //
    //   expect(data).toEqual(payload)
    //   expect(dispatch).toHaveBeenCalledTimes(2)
    //   expect(dispatch).toHaveBeenCalledWith(startFetchAction(stateName, defaultMapParamsToUrl(params)))
    //   expect(dispatch).toHaveBeenCalledWith(finishFetchAction(stateName, payload))
    // })

    it('should not fetch if data has already been fetched', async () => {
      const endpoint = createEndpoint({
        jsonMapper: json => json
      })
      const dispatch = jest.fn()
      const params = {var1: 'a', var2: 'b'}
      const oldPayload = new Payload(false, defaultMapParamsToUrl(params), {}, null)

      const data = await endpoint.loadData(dispatch, oldPayload, params)

      expect(data).toEqual(oldPayload)
      expect(dispatch).not.toHaveBeenCalled()
    })

    it('should use overrideResponse correctly', async () => {
      const json = {test: 'random'}

      const endpoint = createEndpoint({
        jsonMapper: json => json,
        responseOverride: json
      })
      const dispatch = jest.fn()
      const oldPayload = new Payload(false)
      const params = {var1: 'a', var2: 'b'}

      const data = await endpoint.loadData(dispatch, oldPayload, params)
      const payload = new Payload(false, defaultMapParamsToUrl(params), json, null)

      expect(data).toEqual(payload)
      expect(dispatch).toHaveBeenCalledTimes(2)
      expect(dispatch).toHaveBeenCalledWith(startFetchAction(stateName, defaultMapParamsToUrl(params)))
      expect(dispatch).toHaveBeenCalledWith(finishFetchAction(stateName, payload))
    })

    it('should use overrideError correctly', async () => {
      const error = 'fake news'

      const endpoint = createEndpoint({
        jsonMapper: json => json,
        errorOverride: error
      })
      const dispatch = jest.fn()
      const oldPayload = new Payload(false)
      const params = {var1: 'a', var2: 'b'}

      const data = await endpoint.loadData(dispatch, oldPayload, params)
      const payload = new Payload(false, defaultMapParamsToUrl(params), null, error)

      expect(data).toEqual(payload)
      expect(dispatch).toHaveBeenCalledTimes(2)
      expect(dispatch).toHaveBeenCalledWith(startFetchAction(stateName, defaultMapParamsToUrl(params)))
      expect(dispatch).toHaveBeenCalledWith(finishFetchAction(stateName, payload))
    })
  })
})
