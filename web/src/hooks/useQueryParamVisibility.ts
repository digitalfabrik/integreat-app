import { useSearchParams } from 'react-router'

import { parseQueryParams, VisibilityQueryParams, toQueryParams } from 'shared'

type UseQueryParamVisibilityReturn = {
  open: () => void
  close: () => void
  openUrl: (url: string | null) => string | null
  visible: boolean
}

const useQueryParamVisibility = (key: keyof VisibilityQueryParams): UseQueryParamVisibilityReturn => {
  const [queryParams, setQueryParams] = useSearchParams()
  const visible = parseQueryParams(queryParams)[key] ?? false

  const open = () => {
    const newQueryParams = queryParams
    newQueryParams.set(key, 'true')
    setQueryParams(newQueryParams)
  }

  const close = () => {
    const newQueryParams = queryParams
    newQueryParams.delete(key)
    setQueryParams(newQueryParams)
  }

  const openUrl = (url: string | null) => (url ? `${url}?${toQueryParams({ [key]: true }).toString()}` : null)

  return { open, close, openUrl, visible }
}

export default useQueryParamVisibility
