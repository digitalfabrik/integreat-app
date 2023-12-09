import { DateTime } from 'luxon'
import { useState, useCallback } from 'react'

import Cookie from '../utils/Cookie'

type UseCookieReturnType = {
  value: string | null
  updateCookie: (newValue: string, path: string, domain: string, expires?: DateTime) => void
  deleteCookie: (path: string, domain: string) => void
}
const useCookie = (name: string): UseCookieReturnType => {
  const [value, setValue] = useState<string | null>(Cookie.get(name))

  const updateCookie = useCallback(
    (newValue: string, path: string, domain: string, expires?: DateTime) => {
      Cookie.set(name, newValue, path, domain, expires)
      setValue(newValue)
    },
    [name],
  )

  const deleteCookie = useCallback(
    (path: string, domain: string) => {
      Cookie.remove(name, path, domain)
      setValue('')
    },
    [name],
  )

  return { value, updateCookie, deleteCookie }
}

export default useCookie
