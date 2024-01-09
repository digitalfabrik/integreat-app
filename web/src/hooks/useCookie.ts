import { DateTime } from 'luxon'
import { useState, useCallback } from 'react'

import Cookie from '../utils/Cookie'

type UseCookieReturnType<T> = {
  value: T
  updateCookie: (newValue: T, expires?: DateTime, domain?: string, path?: string) => void
  deleteCookie: (path?: string, domain?: string) => void
}
const useCookie = <T>(name: string): UseCookieReturnType<T> => {
  const [value, setValue] = useState<string | null>(Cookie.get(name))

  const updateCookie = useCallback(
    (newValue: T, expires?: DateTime, domain = window.location.hostname, path = '/') => {
      Cookie.set(name, JSON.stringify(newValue), path, domain, expires)
      setValue(JSON.stringify(newValue))
    },
    [name],
  )

  const deleteCookie = useCallback(
    (path = '/', domain = window.location.hostname) => {
      Cookie.remove(name, path, domain)
      setValue('')
    },
    [name],
  )

  return { value: value ? JSON.parse(value) : {}, updateCookie, deleteCookie }
}

export default useCookie
