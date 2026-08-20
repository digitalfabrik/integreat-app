import { NavigateOptions, useSearchParams } from 'react-router'

import { parseQueryParams, QueryParams, toQueryParams } from 'shared'

type UseQueryParamReturn<T extends keyof QueryParams> = [
  value: QueryParams[T],
  setValue: (value: QueryParams[T]) => void,
]

const useQueryParam = <T extends keyof QueryParams>(
  key: T,
  navigateOptions?: NavigateOptions,
): UseQueryParamReturn<T> => {
  const [queryParams, setQueryParams] = useSearchParams()
  const value = parseQueryParams(queryParams)[key]

  const setValue = (value: QueryParams[T] | undefined) => {
    const newQueryParams = new URLSearchParams(queryParams)
    const stringifiedValue = toQueryParams({ [key]: value }).get(key)
    if (stringifiedValue) {
      newQueryParams.set(key, stringifiedValue)
    } else {
      newQueryParams.delete(key)
    }
    setQueryParams(newQueryParams, navigateOptions)
  }

  return [value, setValue]
}

export default useQueryParam
