import useQueryFromEndpoint from '../hooks/useQueryFromEndpoint'

const { mocked } = jest

export const mockUseQueryFromEndpointWithData = <T>(data: T): void => {
  mocked(useQueryFromEndpoint).mockImplementation(() => ({ data, error: null, isPending: false }) as never)
}

export const mockUseQueryFromEndpointOnceWithData = <T>(data: T): void => {
  mocked(useQueryFromEndpoint).mockImplementationOnce(() => ({ data, error: null, isPending: false }) as never)
}

export const mockUseQueryFromEndpointWithError = (error: string): void => {
  mocked(useQueryFromEndpoint).mockImplementation(
    () => ({ data: undefined, error: new Error(error), isPending: false }) as never,
  )
}

export const mockUseQueryFromEndpointLoading = <T>({ data }: { data?: T } = {}): void => {
  mocked(useQueryFromEndpoint).mockImplementationOnce(() => ({ data, error: null, isPending: true }) as never)
}
