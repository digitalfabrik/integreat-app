// @flow

import lolex from 'lolex'

import startFetchAction from '../../app/actions/startFetchAction'
import finishFetchAction from '../../app/actions/finishFetchAction'
import { CityModel, EndpointBuilder, MappingError, Payload } from '@integreat-app/integreat-api-client'
import fetchData from '../fetchData'

describe('fetchData', () => {
  const defaultName = 'endpoint'
  const defaultMapParamsToUrl = params => `https://weird-endpoint/${params.var1}/${params.var2}/api.json`
  const defaultJsonMapper = json => json
  const endpoint = new EndpointBuilder(defaultName)
    .withParamsToUrlMapper(defaultMapParamsToUrl)
    .withMapper(defaultJsonMapper)
    .build()

  let clock
  const mockedTime = 0

  beforeEach(() => {
    clock = lolex.install({ now: mockedTime, toFake: [] })
  })

  afterEach(() => {
    // $FlowFixMe
    fetch.resetMocks()
    clock.uninstall()
  })

  it('should fetch correctly if the data has not been fetched yet', async () => {
    const json = []
    const dispatch = jest.fn()
    const oldPayload = new Payload(false)
    const params = { var1: 'a', var2: 'b' }
    // $FlowFixMe
    fetch.mockResponse(JSON.stringify(json))

    const data = await fetchData(endpoint, dispatch, oldPayload, params)
    const payload = new Payload<Array<CityModel>>(false, defaultMapParamsToUrl(params), json, null)

    expect(data).toEqual(payload)
    expect(dispatch).toHaveBeenCalledTimes(2)
    expect(dispatch).toHaveBeenCalledWith(startFetchAction(defaultName, defaultMapParamsToUrl(params), params))
    expect(dispatch).toHaveBeenCalledWith(finishFetchAction(defaultName, payload, params))
  })

  it('should fetch correctly if the fetched data is outdated', async () => {
    const json = []
    const dispatch = jest.fn()
    const oldPayload = new Payload<CityModel[]>(false, 'https://weird-endpoint/old-url/api.json', [], null)
    const params = { var1: 'a', var2: 'b' }
    // $FlowFixMe
    fetch.mockResponse(JSON.stringify(json))

    const data = await fetchData(endpoint, dispatch, oldPayload, params)
    const payload = new Payload<Array<CityModel>>(false, defaultMapParamsToUrl(params), json, null)

    expect(data).toEqual(payload)
    expect(dispatch).toHaveBeenCalledTimes(2)
    expect(dispatch).toHaveBeenCalledWith(startFetchAction(defaultName, defaultMapParamsToUrl(params), params))
    expect(dispatch).toHaveBeenCalledWith(finishFetchAction(defaultName, payload, params))
  })

  it('should fail if json is malformed', async () => {
    const malformedJSON = 'I\'m so mean!'
    const dispatch = jest.fn()
    const oldPayload = new Payload<CityModel[]>(false, 'https://weird-endpoint/old-url/api.json', [], null)
    const params = { var1: 'a', var2: 'b' }
    // $FlowFixMe
    fetch.mockResponse(malformedJSON)

    const data = await fetchData(endpoint, dispatch, oldPayload, params)
    const mappingError = new MappingError(
      defaultName,
      'invalid json response body at  reason: Unexpected token I in JSON at position 0'
    )
    const payload = new Payload(false, defaultMapParamsToUrl(params), null, mappingError)

    expect(data).toEqual(payload)
    expect(dispatch).toHaveBeenCalledTimes(2)
    expect(dispatch).toHaveBeenCalledWith(startFetchAction(defaultName, defaultMapParamsToUrl(params), params))
    expect(dispatch).toHaveBeenCalledWith(finishFetchAction(defaultName, payload, params))
  })

  it('should not fetch if data has already been fetched', async () => {
    const dispatch = jest.fn()
    const params = { var1: 'a', var2: 'b' }
    const oldPayload = new Payload(false, defaultMapParamsToUrl(params), [], null)

    const data = await fetchData(endpoint, dispatch, oldPayload, params)

    expect(data).toEqual(oldPayload)
    expect(dispatch).not.toHaveBeenCalled()
  })

  it('should use overrideResponse correctly', async () => {
    const json = []
    const endpoint = new EndpointBuilder<*, CityModel[]>(defaultName)
      .withParamsToUrlMapper(defaultMapParamsToUrl)
      .withMapper(defaultJsonMapper)
      .withResponseOverride(json)
      .build()

    const dispatch = jest.fn()
    const oldPayload = new Payload<CityModel[]>(false)
    const params = { var1: 'a', var2: 'b' }

    const data = await fetchData(endpoint, dispatch, oldPayload, params)
    const payload = new Payload<CityModel[]>(false, defaultMapParamsToUrl(params), data.data, null)

    expect(data).toEqual(payload)
    expect(dispatch).toHaveBeenCalledTimes(2)
    expect(dispatch).toHaveBeenCalledWith(startFetchAction(defaultName, defaultMapParamsToUrl(params), params))
    expect(dispatch).toHaveBeenCalledWith(finishFetchAction(defaultName, payload, params))
  })

  it('should use overrideError correctly', async () => {
    const error = new Error('fake news')
    const endpoint = new EndpointBuilder<*, CityModel[]>(defaultName)
      .withParamsToUrlMapper(defaultMapParamsToUrl)
      .withMapper(defaultJsonMapper)
      .withResponseOverride([])
      .withErrorOverride(error)
      .build()

    const dispatch = jest.fn()
    const oldPayload = new Payload<CityModel[]>(false)
    const params = { var1: 'a', var2: 'b' }

    const data = await fetchData(endpoint, dispatch, oldPayload, params)
    const payload = new Payload(false, defaultMapParamsToUrl(params), null, error)

    expect(data).toEqual(payload)
    expect(dispatch).toHaveBeenCalledTimes(2)
    expect(dispatch).toHaveBeenCalledWith(startFetchAction(defaultName, defaultMapParamsToUrl(params), params))
    expect(dispatch).toHaveBeenCalledWith(finishFetchAction(defaultName, payload, params))
  })
})
