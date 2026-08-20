import { useSearchParams } from 'react-router'

import { parseQueryParams, QueryParams, toQueryParams } from 'shared'

type UseQueryParamReturn<T extends keyof QueryParams> = {
  set: (value?: QueryParams[T]) => void
  unset: () => void
  url: (url: string | null, value?: QueryParams[T]) => string | null
  isSet: boolean
  value: QueryParams[T]
}

const toParamValue = (value: unknown) => (typeof value === 'string' ? value : 'true')

const useQueryParam = <T extends keyof QueryParams>(key: T): UseQueryParamReturn<T> => {
  const [queryParams, setQueryParams] = useSearchParams()
  const value = parseQueryParams(queryParams)[key]
  const visible = queryParams.has(key) && queryParams.get(key) !== 'false'

  const set = (value?: QueryParams[T]) => {
    const newQueryParams = new URLSearchParams(queryParams)
    newQueryParams.set(key, toParamValue(value))
    setQueryParams(newQueryParams)
  }

  const unset = () => {
    const newQueryParams = new URLSearchParams(queryParams)
    newQueryParams.delete(key)
    setQueryParams(newQueryParams)
  }

  const url = (url: string | null, value?: QueryParams[T]) =>
    url ? `${url}?${toQueryParams({ [key]: toParamValue(value) }).toString()}` : null

  return { set, unset, url, isSet: visible, value }
}

export default useQueryParam
