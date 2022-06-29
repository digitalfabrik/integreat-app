import { mocked } from 'jest-mock'

import Endpoint from '../Endpoint'
import Payload from '../Payload'
import FetchError from '../errors/FetchError'
import ResponseError from '../errors/ResponseError'
import { setJpalTrackingCode } from '../request'

describe('Endpoint', () => {
  const defaultMapParamsToUrl = (params: { var1: string; var2: string }) =>
    `https://weird-endpoint/${params.var1}/${params.var2}/api.json`
  const params = { var1: 'var1', var2: 'var2' }
  const url = defaultMapParamsToUrl(params)

  const defaultJsonMapper = (json: string, params: { var1: string; var2: string }) =>
    `${json.substring(5)}${params.var1}${params.var2}`

  const body: FormData = {
    append: jest.fn(),
    delete: jest.fn(),
    get: jest.fn(),
    getAll: jest.fn(),
    has: jest.fn(),
    set: jest.fn(),
    forEach: jest.fn()
  }
  const defaultMapParamsToBody = () => body

  const responseJson = 'I really like me some json'
  const mappedResponseJson = defaultJsonMapper(responseJson, params)
  const mockedFetch = mocked(fetch)

  const headers: Headers = {
    append: jest.fn(),
    delete: jest.fn(),
    get: jest.fn(),
    has: jest.fn(),
    set: jest.fn(),
    forEach: jest.fn()
  }

  const responseBody: Body = {
    body: null,
    bodyUsed: false,
    arrayBuffer: jest.fn(),
    blob: jest.fn(),
    formData: jest.fn(),
    json: jest.fn(async () => responseJson),
    text: jest.fn()
  }

  const responseOk: Response = {
    headers,
    ok: true,
    redirected: false,
    status: 200,
    statusText: 'ok',
    type: 'default',
    url: 'https://example.com',
    clone: jest.fn(),
    ...responseBody
  }

  const responseNotOk: Response = {
    ...responseOk,
    status: 400,
    statusText: 'not ok',
    ok: false
  }

  beforeEach(() => {
    jest.clearAllMocks()
    setJpalTrackingCode(null)
  })

  it('should have correct state name', () => {
    const endpoint = new Endpoint('endpoint', defaultMapParamsToUrl, null, defaultJsonMapper)
    expect(endpoint.stateName).toBe('endpoint')
  })

  it('should throw error override', async () => {
    const errorOverride = new Error('error')
    const endpoint = new Endpoint('endpoint', defaultMapParamsToUrl, null, defaultJsonMapper, null, errorOverride)
    await expect(endpoint.request(params)).rejects.toThrow(errorOverride)
  })

  it('should return response override', async () => {
    const responseOverride = 'my custom response'
    const endpoint = new Endpoint('endpoint', defaultMapParamsToUrl, null, defaultJsonMapper, responseOverride)
    const response = await endpoint.request(params)
    expect(response.data).toEqual(responseOverride)
  })

  it('should use url override', async () => {
    const overrideUrl = 'https://example.com'
    mockedFetch.mockImplementation(async () => responseOk)
    const endpoint = new Endpoint('endpoint', defaultMapParamsToUrl, null, defaultJsonMapper)
    const response = await endpoint.request(params, overrideUrl)

    expect(response.requestUrl).toEqual(`${overrideUrl}/`)
    expect(mockedFetch).toHaveBeenCalledTimes(1)
    expect(mockedFetch).toHaveBeenCalledWith(overrideUrl, { method: 'GET' })
  })

  it('should fetch with GET from mapped url and return data', async () => {
    mockedFetch.mockImplementation(async () => responseOk)
    const endpoint = new Endpoint('endpoint', defaultMapParamsToUrl, null, defaultJsonMapper)
    const response = await endpoint.request(params)

    expect(response).toBeInstanceOf(Payload)
    expect(response.data).toEqual(mappedResponseJson)
    expect(response.requestUrl).toEqual(url)
    expect(response.error).toBeNull()
    expect(response.isFetching).toBe(false)
    expect(mockedFetch).toHaveBeenCalledTimes(1)
    expect(mockedFetch).toHaveBeenCalledWith(url, { method: 'GET' })
  })

  it('should include jpal tracking code if set', async () => {
    const trackingCode = 'my-tracking-code'
    setJpalTrackingCode(trackingCode)
    mockedFetch.mockImplementation(async () => responseOk)
    const mapParamsToUrl = () => 'https://example.com/?test=1234'
    const endpoint = new Endpoint('endpoint', mapParamsToUrl, null, defaultJsonMapper)
    const response = await endpoint.request(params)

    expect(response).toBeInstanceOf(Payload)
    expect(response.requestUrl).toEqual(`https://example.com/?test=1234&jpal_tracking_code=${trackingCode}`)
  })

  it('should fetch with POST from mapped url and return data', async () => {
    mockedFetch.mockImplementation(async () => responseOk)
    const endpoint = new Endpoint('endpoint', defaultMapParamsToUrl, defaultMapParamsToBody, defaultJsonMapper)
    const response = await endpoint.request(params)

    expect(response).toBeInstanceOf(Payload)
    expect(response.data).toEqual(mappedResponseJson)
    expect(response.requestUrl).toEqual(url)
    expect(response.error).toBeNull()
    expect(response.isFetching).toBe(false)
    expect(mockedFetch).toHaveBeenCalledTimes(1)
    expect(mockedFetch).toHaveBeenCalledWith(url, { method: 'POST', body })
  })

  it('should throw fetch error if fetch throws', async () => {
    const error = new Error('network connection failed')
    mockedFetch.mockRejectedValue(error)
    const endpoint = new Endpoint('endpoint', defaultMapParamsToUrl, null, defaultJsonMapper)
    await expect(endpoint.request(params)).rejects.toThrow(
      new FetchError({ endpointName: 'endpoint', innerError: error, url, requestOptions: { method: 'GET' } })
    )
  })

  it('should throw response error if response is not ok', async () => {
    mockedFetch.mockImplementation(async () => responseNotOk)
    const endpoint = new Endpoint('endpoint', defaultMapParamsToUrl, null, defaultJsonMapper)
    await expect(endpoint.request(params)).rejects.toThrow(
      new ResponseError({ endpointName: 'endpoint', response: responseNotOk, url, requestOptions: { method: 'GET' } })
    )
  })

  it('should throw fetch error if response.json throws', async () => {
    const error = new Error('cancelled')
    const responseFailingJson: Response = {
      ...responseOk,
      json: async () => {
        throw error
      }
    }
    mockedFetch.mockImplementation(async () => responseFailingJson)
    const endpoint = new Endpoint('endpoint', defaultMapParamsToUrl, null, defaultJsonMapper)
    await expect(endpoint.request(params)).rejects.toThrow(
      new FetchError({ endpointName: 'endpoint', innerError: error, url, requestOptions: { method: 'GET' } })
    )
  })
})
