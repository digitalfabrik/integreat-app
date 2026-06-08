import { useSearchParams } from 'react-router'

import { parseQueryParams, VisibilityQueryParams, toQueryParams } from 'shared'

type UseQueryParamVisibilityReturn = {
  open: (value?: string) => void
  close: () => void
  openUrl: (url: string | null, value?: string) => string | null
  visible: boolean
}

const useQueryParamVisibility = (key: keyof VisibilityQueryParams): UseQueryParamVisibilityReturn => {
  const [queryParams, setQueryParams] = useSearchParams()
  const paramValue = parseQueryParams(queryParams)[key]
  const visible = typeof paramValue === 'boolean' ? paramValue : paramValue !== undefined

  const open = (value?: string) => {
    const newQueryParams = queryParams
    newQueryParams.set(key, typeof value === 'string' ? value : 'true')
    setQueryParams(newQueryParams)
  }

  const close = () => {
    const newQueryParams = queryParams
    newQueryParams.delete(key)
    setQueryParams(newQueryParams)
  }

  const openUrl = (url: string | null, value?: string) =>
    url ? `${url}?${toQueryParams({ [key]: value ?? 'true' }).toString()}` : null

  return { open, close, openUrl, visible }
}

export default useQueryParamVisibility
