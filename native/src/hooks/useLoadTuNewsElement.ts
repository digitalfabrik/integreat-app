import { useCallback } from 'react'

import { createTuNewsElementEndpoint, ReturnType, TuNewsModel, useLoadAsync } from 'shared/api'

import { tuNewsApiUrl } from '../constants/endpoint'

type UseLoadTuNewsElementProps = {
  newsId: number
}

const useLoadTuNewsElement = ({ newsId }: UseLoadTuNewsElementProps): ReturnType<TuNewsModel> => {
  const load = useCallback(async () => {
    const payload = await createTuNewsElementEndpoint(tuNewsApiUrl).request({ id: newsId })
    if (!payload.data) {
      throw new Error('Data missing!')
    }
    return payload.data
  }, [newsId])

  return useLoadAsync(load)
}

export default useLoadTuNewsElement
