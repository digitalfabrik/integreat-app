import { mocked } from 'ts-jest/utils'

import { useLoadFromEndpoint } from 'api-client'

const mockData = (data: unknown): typeof useLoadFromEndpoint =>
  (() => ({
    data: data,
    loading: false,
    error: null,
    refresh: () => null
  })) as typeof useLoadFromEndpoint

export const mockUseLoadFromEndpointWithData = <T>(data: T): void => {
  mocked(useLoadFromEndpoint).mockImplementation(mockData(data))
}

export const mockUseLoadFromEndpointOnceWithData = <T>(data: T): void => {
  mocked(useLoadFromEndpoint).mockImplementationOnce(mockData(data))
}

export const mockUseLoadFromEndpointLoading = ({ data, error }: { data?: unknown; error?: string } = {}): void => {
  const useLoadFromEndpointMock = (() => ({
    data: data || null,
    loading: true,
    error: error ? new Error(error) : null,
    refresh: () => null
  })) as typeof useLoadFromEndpoint
  mocked(useLoadFromEndpoint).mockImplementationOnce(useLoadFromEndpointMock)
}

export const mockUseLoadFromEndpointWithError = (error: string): void => {
  const useLoadFromEndpointMock = (() => ({
    data: null,
    loading: false,
    error: new Error(error),
    refresh: () => null
  })) as typeof useLoadFromEndpoint
  mocked(useLoadFromEndpoint).mockImplementationOnce(useLoadFromEndpointMock)
}
