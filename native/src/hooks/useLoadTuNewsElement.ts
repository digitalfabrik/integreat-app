import { useCallback } from 'react'

import { createTunewsElementEndpoint, ReturnType, TunewsModel, useLoadAsync } from 'api-client'

import { tunewsApiUrl } from '../constants/endpoint'

type UseLoadTuNewsElementProps = {
  newsId: string
}

const useLoadTuNewsElement = ({ newsId }: UseLoadTuNewsElementProps): ReturnType<TunewsModel> => {
  const load = useCallback(async () => {
    const payload = await createTunewsElementEndpoint(tunewsApiUrl).request({ id: parseInt(newsId, 10) })
    if (!payload.data) {
      throw new Error('Data missing!')
    }
    return payload.data
  }, [newsId])

  return useLoadAsync(load)
}

export default useLoadTuNewsElement
