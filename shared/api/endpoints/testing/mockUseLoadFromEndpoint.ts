import { mocked } from 'jest-mock'

import { useLoadFromEndpoint } from '../../index'

const mockData = (data: unknown): typeof useLoadFromEndpoint =>
  (() => ({
    data,
    loading: false,
    error: null,
    refresh: () => null,
    setData: jest.fn(),
  })) as typeof useLoadFromEndpoint

export const mockUseLoadFromEndpointWithData = <T>(data: T): void => {
  mocked(useLoadFromEndpoint).mockImplementation(mockData(data))
}

export const mockUseLoadFromEndpointOnceWithData = <T>(data: T): void => {
  mocked(useLoadFromEndpoint).mockImplementationOnce(mockData(data))
}

export const mockUseLoadFromEndpointLoading = <T>({ data, error }: { data?: T; error?: string } = {}): void => {
  const useLoadFromEndpointMock = (() => ({
    data: data ?? null,
    loading: true,
    error: error ? new Error(error) : null,
    refresh: () => null,
    setData: jest.fn(),
  })) as typeof useLoadFromEndpoint
  mocked(useLoadFromEndpoint).mockImplementationOnce(useLoadFromEndpointMock)
}

export const mockUseLoadFromEndpointWithError = (error: string): void => {
  const useLoadFromEndpointMock = (() => ({
    data: null,
    loading: false,
    error: new Error(error),
    refresh: () => null,
    setData: jest.fn(),
  })) as typeof useLoadFromEndpoint
  mocked(useLoadFromEndpoint).mockImplementation(useLoadFromEndpointMock)
}
