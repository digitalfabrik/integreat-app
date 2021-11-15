import React, { ReactElement } from 'react'

import { CityModel, TU_NEWS_TYPE } from 'api-client'

import LanguageNotAvailableContainer from '../components/LanguageNotAvailableContainer'
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
  const { availableLanguages, ...response } = useLoadTuNews({ city: cityModel.code, language, newsId })

  if (availableLanguages && !availableLanguages.find(model => model.code === language)) {
    return <LanguageNotAvailableContainer languages={availableLanguages} changeLanguage={changeUnavailableLanguage} />
  }

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
