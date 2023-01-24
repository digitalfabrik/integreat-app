import { useCallback } from 'react'

import Endpoint from '../../Endpoint'
import useLoadAsync, { Return } from './useLoadAsync'

export const loadFromEndpoint = async <T, P>(
  createEndpoint: (baseUrl: string) => Endpoint<P, T>,
  baseUrl: string | (() => Promise<string>),
  params: P
): Promise<T> => {
  const apiUrl = typeof baseUrl === 'string' ? baseUrl : await baseUrl()
  const { data } = await createEndpoint(apiUrl).request(params)

  if (!data) {
    throw new Error('Data missing!')
  }

  return data
}

const useLoadFromEndpoint = <T, P>(
  createEndpoint: (baseUrl: string) => Endpoint<P, T>,
  baseUrl: string | (() => Promise<string>),
  params: P
): Return<T> =>
  useLoadAsync(
    useCallback(
      () => loadFromEndpoint(createEndpoint, baseUrl, params),
      // Normally using params as dependency triggers infinite re-renders
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [createEndpoint, baseUrl, JSON.stringify(params)]
    )
  )

export default useLoadFromEndpoint
