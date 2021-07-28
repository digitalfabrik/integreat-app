import { useLoadFromEndpoint } from 'api-client'
import { mocked } from 'ts-jest/utils'

const mockData = (data: unknown): typeof useLoadFromEndpoint => {
  return (() => ({
    data: data,
    loading: false,
    error: null,
    refresh: () => null
  })) as typeof useLoadFromEndpoint
}

export function mockUseLoadFromEndpointWitData<T>(data: T): void {
  mocked(useLoadFromEndpoint).mockImplementation(mockData(data))
}

export function mockUseLoadFromEndpointOnceWitData<T>(data: T): void {
  mocked(useLoadFromEndpoint).mockImplementationOnce(mockData(data))
}

export function mockUseLoadFromEndpointLoading(): void {
  const useLoadFromEndpointMock = (() => ({
    data: null,
    loading: true,
    error: null,
    refresh: () => null
  })) as typeof useLoadFromEndpoint
  mocked(useLoadFromEndpoint).mockImplementationOnce(useLoadFromEndpointMock)
}

export function mockUseLoadFromEndpointWithError(error: string): void {
  const useLoadFromEndpointMock = (() => ({
    data: null,
    loading: false,
    error: new Error(error),
    refresh: () => null
  })) as typeof useLoadFromEndpoint
  mocked(useLoadFromEndpoint).mockImplementationOnce(useLoadFromEndpointMock)
}
