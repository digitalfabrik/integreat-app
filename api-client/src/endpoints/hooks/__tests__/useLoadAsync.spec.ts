import { loadAsync } from '../useLoadAsync'

describe('loadAsync', () => {
  const setData = jest.fn()
  const setError = jest.fn()
  const setLoading = jest.fn()

  it('should set everything correctly if loading succeeds', async () => {
    const request = async (): Promise<string> => 'myData'

    await loadAsync(request, setData, setError, setLoading)

    expect(setError).toHaveBeenCalledTimes(1)
    expect(setError).toHaveBeenCalledWith(null)
    expect(setData).toHaveBeenCalledTimes(1)
    expect(setData).toHaveBeenCalledWith('myData')
  })

  it('should set everything correctly if loading throws an error', async () => {
    const error = new Error('myError')
    const request = async (): Promise<void> => Promise.reject(error)
    await loadAsync(request, setData, setError, setLoading)
    expect(setError).toHaveBeenCalledTimes(1)
    expect(setError).toHaveBeenCalledWith(error)
    expect(setData).toHaveBeenCalledTimes(1)
    expect(setData).toHaveBeenCalledWith(null)
  })
})
