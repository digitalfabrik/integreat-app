import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import React from 'react'

import { loadFromEndpoint } from 'shared/api'

import useQueryFromEndpoint from '../useQueryFromEndpoint'

jest.mock('shared/api', () => ({
  ...jest.requireActual('shared/api'),
  loadFromEndpoint: jest.fn(),
}))

const { mocked } = jest

const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

const createEndpoint = jest.fn().mockReturnValue({ stateName: 'test-endpoint' })
const baseUrl = 'https://example.com'
const params = { region: 'augsburg', language: 'de' }

describe('useQueryFromEndpoint', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return data when the endpoint resolves', async () => {
    const data = { id: 1, title: 'Test' }
    mocked(loadFromEndpoint).mockResolvedValue(data)

    const { result } = renderHook(() => useQueryFromEndpoint(createEndpoint, baseUrl, params), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.data).toEqual(data))
    expect(result.current.error).toBeNull()
    expect(result.current.isPending).toBe(false)
  })

  it('should return an error when the endpoint rejects', async () => {
    const error = new Error('fetch failed')
    mocked(loadFromEndpoint).mockRejectedValue(error)

    const { result } = renderHook(() => useQueryFromEndpoint(createEndpoint, baseUrl, params), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.error).toEqual(error))
    expect(result.current.data).toBeUndefined()
  })

  it('should be pending initially', () => {
    mocked(loadFromEndpoint).mockResolvedValue({})

    const { result } = renderHook(() => useQueryFromEndpoint(createEndpoint, baseUrl, params), {
      wrapper: createWrapper(),
    })

    expect(result.current.isPending).toBe(true)
    expect(result.current.data).toBeUndefined()
  })

  it('should be immediately stale when cached is false', async () => {
    const data = { id: 1, title: 'Test' }
    mocked(loadFromEndpoint).mockResolvedValue(data)

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )

    const { result } = renderHook(() => useQueryFromEndpoint(createEndpoint, baseUrl, params, { cached: false }), {
      wrapper,
    })

    await waitFor(() => expect(result.current.data).toEqual(data))
    expect(result.current.isStale).toBe(true)
  })

  it('should use QueryClient staleTime when cached is true', async () => {
    const data = { id: 1, title: 'Test' }
    mocked(loadFromEndpoint).mockResolvedValue(data)

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )

    const { result } = renderHook(() => useQueryFromEndpoint(createEndpoint, baseUrl, params, { cached: true }), {
      wrapper,
    })

    await waitFor(() => expect(result.current.data).toEqual(data))
    expect(result.current.isStale).toBe(false)
  })

  it('should update cached data when setData is called', async () => {
    const initialData = { id: 1, title: 'Initial' }
    const updatedData = { id: 1, title: 'Updated' }
    mocked(loadFromEndpoint).mockResolvedValue(initialData)

    const { result } = renderHook(() => useQueryFromEndpoint(createEndpoint, baseUrl, params), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.data).toEqual(initialData))

    result.current.setData(updatedData)

    await waitFor(() => expect(result.current.data).toEqual(updatedData))
  })
})
