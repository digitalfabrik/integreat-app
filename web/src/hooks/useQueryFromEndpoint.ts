import { useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query'

import { Endpoint, loadFromEndpoint } from 'shared/api'

// staleTime is 5 minutes
// eslint-disable-next-line no-magic-numbers
const defaultStaleTime = 5 * 60 * 1000

export type UseQueryFromEndpointReturn<T extends object> = UseQueryResult<T> & {
  setData: (data: T | null) => void
}

const useQueryFromEndpoint = <T extends object, P>(
  createEndpoint: (baseUrl: string) => Endpoint<P, T>,
  baseUrl: string,
  params: P,
  { cached = true, enabled = true }: { cached?: boolean; enabled?: boolean } = {},
): UseQueryFromEndpointReturn<T> => {
  const queryClient = useQueryClient()

  const endpoint = createEndpoint(baseUrl)
  const queryKey = [endpoint.stateName, params]

  return {
    ...useQuery({
      queryKey,
      queryFn: async () => loadFromEndpoint(createEndpoint, baseUrl, params),
      staleTime: cached ? defaultStaleTime : 0,
      enabled,
    }),
    setData: data => queryClient.setQueryData(queryKey, data),
  }
}

export default useQueryFromEndpoint
