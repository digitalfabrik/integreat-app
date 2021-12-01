import React, { ReactElement, useCallback } from 'react'

import {
  CityModel,
  createTunewsElementEndpoint,
  Payload,
  TU_NEWS_TYPE,
  TunewsModel,
  useLoadFromEndpoint
} from 'api-client'

import LanguageNotAvailableContainer from '../components/LanguageNotAvailableContainer'
import { tunewsApiUrl } from '../constants/endpoint'
import useLoadTuNews from '../hooks/useLoadTuNews'
import News from './News'

export type PropsType = {
  newsId: string | null | undefined
  cityModel: CityModel
  language: string
  selectNews: (newsId: string | null) => void
  changeUnavailableLanguage: (newLanguage: string) => void
}

const TuNewsNews = ({
  language,
  cityModel,
  selectNews,
  newsId,
  changeUnavailableLanguage
}: PropsType): ReactElement => {
  const { availableLanguages, ...tuNewsResponse } = useLoadTuNews({ language })

  const requestTuNewsElement = useCallback(async () => {
    if (newsId) {
      return createTunewsElementEndpoint(tunewsApiUrl).request({ id: parseInt(newsId, 10) })
    }
    return new Payload<TunewsModel>(false)
  }, [newsId])
  const {
    data: tuNewsElementData,
    loading: tuNewsElementLoading,
    error: tuNewsElementError,
    refresh: tuNewsElementRefresh
  } = useLoadFromEndpoint(requestTuNewsElement)

  if (availableLanguages && !availableLanguages.find(model => model.code === language)) {
    return <LanguageNotAvailableContainer languages={availableLanguages} changeLanguage={changeUnavailableLanguage} />
  }

  const response = newsId
    ? {
        refresh: tuNewsElementRefresh,
        error: tuNewsElementError,
        data: tuNewsElementData ? [tuNewsElementData] : null,
        // Prevent flickering (if newsId is freshly set it takes one rerender for loading to be set to true)
        loading: tuNewsElementLoading || (!tuNewsElementError && !tuNewsElementData)
      }
    : tuNewsResponse

  return (
    <News
      newsId={newsId}
      cityModel={cityModel}
      language={language}
      selectedNewsType={TU_NEWS_TYPE}
      selectNews={selectNews}
      {...response}
    />
  )
}

export default TuNewsNews
