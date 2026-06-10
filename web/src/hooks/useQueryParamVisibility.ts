import { useSearchParams } from 'react-router'

import { parseQueryParams, VisibilityQueryParams, toQueryParams } from 'shared'

type UseQueryParamVisibilityReturn<T extends keyof VisibilityQueryParams> = {
  open: (value?: string) => void
  close: () => void
  openUrl: (url: string | null, value?: string) => string | null
  visible: boolean
  value: VisibilityQueryParams[T]
}

const useQueryParamVisibility = <T extends keyof VisibilityQueryParams>(key: T): UseQueryParamVisibilityReturn<T> => {
  const [queryParams, setQueryParams] = useSearchParams()
  const value = parseQueryParams(queryParams)[key]
  const visible = Boolean(value)

  const open = (value?: string) => {
    const newQueryParams = queryParams
    newQueryParams.set(key, value ?? 'true')
    setQueryParams(newQueryParams)
  }

  const close = () => {
    const newQueryParams = queryParams
    newQueryParams.delete(key)
    setQueryParams(newQueryParams)
  }

  const openUrl = (url: string | null, value?: string) =>
    url ? `${url}?${toQueryParams({ [key]: value ?? 'true' }).toString()}` : null

  return { open, close, openUrl, visible, value }
}

export default useQueryParamVisibility
