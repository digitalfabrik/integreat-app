import { request, setUserAgent } from '../request'

describe('request', () => {
  const url = 'https://example.com'
  const bodyObject = { property1: 'property1' }
  const body = JSON.stringify(bodyObject)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should call fetch correctly', async () => {
    const requestOptions = { method: 'POST', body: JSON.stringify(body) }
    await request(url, requestOptions)
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledWith(url, requestOptions)

    const requestOptions2 = { method: 'GET' }
    const url2 = 'https://example.com/another-url'
    await request(url2, requestOptions2)
    expect(fetch).toHaveBeenCalledTimes(2)
    expect(fetch).toHaveBeenCalledWith(url2, requestOptions2)
  })

  it('should set user agent correctly', async () => {
    setUserAgent('my-user-agent')
    const requestOptions = { method: 'POST', body: JSON.stringify(body) }
    await request(url, { ...requestOptions, headers: { custom: 'custom' } })
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledWith(url, {
      headers: {
        custom: 'custom',
        'User-Agent': 'my-user-agent',
      },
      ...requestOptions,
    })

    const requestOptions2 = { method: 'GET' }
    const url2 = 'https://example.com/another-url'
    await request(url2, { ...requestOptions2, headers: { 'User-Agent': 'another-user-agent' } })
    expect(fetch).toHaveBeenCalledTimes(2)
    expect(fetch).toHaveBeenCalledWith(url2, {
      headers: {
        'User-Agent': 'my-user-agent',
      },
      ...requestOptions2,
    })
  })
})
