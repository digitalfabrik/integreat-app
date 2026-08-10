import { useSearchParams } from 'react-router'

import { parseQueryParams, VisibilityQueryParams, toQueryParams } from 'shared'

type UseQueryParamVisibilityReturn<T extends keyof VisibilityQueryParams> = {
  open: (value?: VisibilityQueryParams[T]) => void
  close: () => void
  openUrl: (url: string | null, value?: VisibilityQueryParams[T]) => string | null
  visible: boolean
  value: VisibilityQueryParams[T]
}

const toParamValue = (value: unknown) => (typeof value === 'string' ? value : 'true')

const useQueryParamVisibility = <T extends keyof VisibilityQueryParams>(key: T): UseQueryParamVisibilityReturn<T> => {
  const [queryParams, setQueryParams] = useSearchParams()
  const value = parseQueryParams(queryParams)[key]
  const visible = queryParams.has(key) && queryParams.get(key) !== 'false'

  const open = (value?: VisibilityQueryParams[T]) => {
    // The query params of the current location must not be mutated with new URLSearchParams, as they are memoized by react-router
    const newQueryParams = new URLSearchParams(queryParams)
    newQueryParams.set(key, toParamValue(value))
    setQueryParams(newQueryParams)
  }

  const close = () => {
    const newQueryParams = new URLSearchParams(queryParams)
    newQueryParams.delete(key)
    setQueryParams(newQueryParams)
  }

  const openUrl = (url: string | null, value?: VisibilityQueryParams[T]) =>
    url ? `${url}?${toQueryParams({ [key]: toParamValue(value) }).toString()}` : null

  return { open, close, openUrl, visible, value }
}

export default useQueryParamVisibility
