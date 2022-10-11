import React, { ReactElement } from 'react'

import { CityModel, LOCAL_NEWS_TYPE } from 'api-client'

import News from '../components/News'
import useLoadLocalNews from '../hooks/useLoadLocalNews'

export type LocalNewsPropsType = {
  newsId: string | null | undefined
  cityModel: CityModel
  language: string
  selectNews: (newsId: string | null) => void
}

const LocalNews = ({ language, cityModel, newsId, selectNews }: LocalNewsPropsType): ReactElement => {
  const response = useLoadLocalNews({ city: cityModel.code, language })
  return (
    <News
      newsId={newsId}
      cityModel={cityModel}
      language={language}
      selectedNewsType={LOCAL_NEWS_TYPE}
      selectNews={selectNews}
      {...response}
    />
  )
}

export default LocalNews
