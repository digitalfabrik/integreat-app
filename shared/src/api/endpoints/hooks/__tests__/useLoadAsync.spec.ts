import { act, renderHook, waitFor } from '@testing-library/react'

import { loadAsync, useLoadAsync } from '../useLoadAsync.ts'

describe('loadAsync', () => {
  const setData = jest.fn()
  const setError = jest.fn()
  const setLoading = jest.fn()

  beforeEach(jest.resetAllMocks)

  it('should set everything correctly if loading succeeds', async () => {
    const request = async (): Promise<string> => 'myData'

    await loadAsync(request, { setData, setError, setLoading })

    expect(setError).toHaveBeenCalledTimes(1)
    expect(setError).toHaveBeenCalledWith(null)
    expect(setData).toHaveBeenCalledTimes(1)
    expect(setData).toHaveBeenCalledWith('myData')
  })

  it('should set everything correctly if loading throws an error', async () => {
    const error = new Error('myError')
    const request = async (): Promise<void> => Promise.reject(error)
    await loadAsync(request, { setData, setError, setLoading })
    expect(setError).toHaveBeenCalledTimes(1)
    expect(setError).toHaveBeenCalledWith(error)
    expect(setData).toHaveBeenCalledTimes(1)
    expect(setData).toHaveBeenCalledWith(null)
  })
})

describe('useLoadAsync', () => {
  type Resolvers = { resolve: (data: string) => void; reject: (error: Error) => void }

  // Creates a request whose loads only finish once resolved manually
  const createControlledRequest = () => {
    const loads: Resolvers[] = []
    const request = jest.fn(
      () =>
        new Promise<string | null>((resolve, reject) => {
          loads.push({ resolve, reject })
        }),
    )
    return { request, loads }
  }

  it('should load the data', async () => {
    const { request, loads } = createControlledRequest()
    const { result } = renderHook(() => useLoadAsync(request))

    expect(result.current).toEqual(expect.objectContaining({ data: null, error: null, loading: true }))

    act(() => loads[0]!.resolve('myData'))

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.data).toBe('myData')
    expect(result.current.error).toBeNull()
    expect(request).toHaveBeenCalledWith(false)
  })

  it('should return the error if loading fails', async () => {
    const { request, loads } = createControlledRequest()
    const error = new Error('myError')
    const { result } = renderHook(() => useLoadAsync(request))

    act(() => loads[0]!.reject(error))

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toBe(error)
    expect(result.current.data).toBeNull()
  })

  it('should immediately return loading without data if the request changes', async () => {
    const first = createControlledRequest()
    const second = createControlledRequest()
    const renders: { data: string | null; loading: boolean }[] = []
    const { result, rerender } = renderHook(
      ({ request }) => {
        const response = useLoadAsync(request)
        renders.push({ data: response.data, loading: response.loading })
        return response
      },
      { initialProps: { request: first.request } },
    )

    act(() => first.loads[0]!.resolve('firstData'))
    await waitFor(() => expect(result.current.data).toBe('firstData'))

    renders.length = 0
    rerender({ request: second.request })

    // Not even a single render with the outdated data
    expect(renders[0]).toEqual({ data: null, loading: true })
    expect(renders).not.toContainEqual(expect.objectContaining({ data: 'firstData' }))

    act(() => second.loads[0]!.resolve('secondData'))
    await waitFor(() => expect(result.current.data).toBe('secondData'))
    expect(result.current.loading).toBe(false)
  })

  it('should ignore responses of outdated requests', async () => {
    const first = createControlledRequest()
    const second = createControlledRequest()
    const { result, rerender } = renderHook(({ request }) => useLoadAsync(request), {
      initialProps: { request: first.request },
    })

    rerender({ request: second.request })
    act(() => second.loads[0]!.resolve('secondData'))
    await waitFor(() => expect(result.current.data).toBe('secondData'))

    await act(async () => first.loads[0]!.resolve('firstData'))

    expect(result.current.data).toBe('secondData')
    expect(result.current.loading).toBe(false)
  })

  it('should keep the data while refreshing', async () => {
    const { request, loads } = createControlledRequest()
    const { result } = renderHook(() => useLoadAsync(request))

    act(() => loads[0]!.resolve('myData'))
    await waitFor(() => expect(result.current.data).toBe('myData'))

    act(() => {
      result.current.refresh()
    })

    expect(result.current.loading).toBe(true)
    expect(result.current.data).toBe('myData')
    expect(request).toHaveBeenLastCalledWith(true)

    act(() => loads[1]!.resolve('refreshedData'))
    await waitFor(() => expect(result.current.data).toBe('refreshedData'))
    expect(result.current.loading).toBe(false)
  })

  it('should ignore responses of outdated refreshes', async () => {
    const { request, loads } = createControlledRequest()
    const { result } = renderHook(() => useLoadAsync(request))

    act(() => loads[0]!.resolve('myData'))
    await waitFor(() => expect(result.current.data).toBe('myData'))

    act(() => {
      result.current.refresh()
    })
    act(() => {
      result.current.refresh()
    })
    act(() => loads[2]!.resolve('latestData'))
    await waitFor(() => expect(result.current.data).toBe('latestData'))

    await act(async () => loads[1]!.resolve('outdatedData'))

    expect(result.current.data).toBe('latestData')
  })

  it('should set the data', async () => {
    const { request, loads } = createControlledRequest()
    const { result } = renderHook(() => useLoadAsync(request))

    act(() => loads[0]!.resolve('myData'))
    await waitFor(() => expect(result.current.data).toBe('myData'))

    act(() => result.current.setData('newData'))
    expect(result.current.data).toBe('newData')

    act(() => result.current.setData(previous => `${previous} updated`))
    expect(result.current.data).toBe('newData updated')
  })
})
