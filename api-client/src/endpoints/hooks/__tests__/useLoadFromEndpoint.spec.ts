import { Payload } from 'api-client'
import { loadFromEndpoint } from '../useLoadFromEndpoint'

describe('loadFromEndpoint', () => {
  const apiUrl = 'https://my-cust.om/api-url'
  const setData = jest.fn()
  const setError = jest.fn()
  const setLoading = jest.fn()

  const createPayload = ({ error, data }: { error?: Error; data?: string }) =>
    new Payload(false, apiUrl, data || null, error || null)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should set everything correctly if loading from endpoint succeeds', async () => {
    const request = jest.fn(() =>
      Promise.resolve(
        createPayload({
          data: 'myData'
        })
      )
    )
    await loadFromEndpoint(request, setData, setError, setLoading)
    expect(setLoading).toHaveBeenCalledTimes(2)
    expect(setLoading).toHaveBeenNthCalledWith(1, true)
    expect(setLoading).toHaveBeenNthCalledWith(2, false)
    expect(setError).toHaveBeenCalledTimes(1)
    expect(setError).toHaveBeenCalledWith(null)
    expect(setData).toHaveBeenCalledTimes(1)
    expect(setData).toHaveBeenCalledWith('myData')
  })

  it('should set everything correctly if loading from endpoint fails', async () => {
    const error = new Error('myError')
    const request = jest.fn(() =>
      Promise.resolve(
        createPayload({
          error
        })
      )
    )
    await loadFromEndpoint(request, setData, setError, setLoading)
    expect(setLoading).toHaveBeenCalledTimes(2)
    expect(setLoading).toHaveBeenNthCalledWith(1, true)
    expect(setLoading).toHaveBeenNthCalledWith(2, false)
    expect(setError).toHaveBeenCalledTimes(1)
    expect(setError).toHaveBeenCalledWith(error)
    expect(setData).toHaveBeenCalledTimes(1)
    expect(setData).toHaveBeenCalledWith(null)
  })

  it('should set everything correctly if loading from endpoint throws an error', async () => {
    const error = new Error('myError')
    const request = jest.fn(() => Promise.reject(error))
    await loadFromEndpoint(request, setData, setError, setLoading)
    expect(setLoading).toHaveBeenCalledTimes(2)
    expect(setLoading).toHaveBeenNthCalledWith(1, true)
    expect(setLoading).toHaveBeenNthCalledWith(2, false)
    expect(setError).toHaveBeenCalledTimes(1)
    expect(setError).toHaveBeenCalledWith(error)
    expect(setData).toHaveBeenCalledTimes(1)
    expect(setData).toHaveBeenCalledWith(null)
  })
})
