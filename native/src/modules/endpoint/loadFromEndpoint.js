// @flow

import determineApiUrl from './determineApiUrl'
import { Payload } from 'api-client'

const loadFromEndpoint = async <T>(
  request: (apiUrl: string) => Promise<Payload<T>>,
  setData: ?T => void,
  setError: ?Error => void,
  setLoading: boolean => void
) => {
  setLoading(true)

  try {
    const apiUrl = await determineApiUrl()
    const payload: Payload<T> = await request(apiUrl)

    if (payload.error) {
      setError(payload.error)
      setData(null)
    } else {
      setData(payload.data)
      setError(null)
    }
  } catch (e) {
    setError(e)
    setData(null)
  } finally {
    setLoading(false)
  }
}

export default loadFromEndpoint
