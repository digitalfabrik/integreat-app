import React, { ReactElement } from 'react'

import { CityModel, LOCAL_NEWS_TYPE } from 'api-client'

import useLoadLocalNews from '../hooks/useLoadLocalNews'
import News from './News'

export type PropsType = {
  newsId: string | null | undefined
  cityModel: CityModel
  language: string
  selectNews: (newsId: string | null) => void
}

const LocalNews = ({ language, cityModel, newsId, selectNews }: PropsType): ReactElement => {
  const { data, refresh } = useLoadLocalNews({ city: cityModel.code, language })
  return (
    <News
      newsId={newsId}
      news={data}
      cityModel={cityModel}
      language={language}
      selectedNewsType={LOCAL_NEWS_TYPE}
      isFetchingMore={false}
      refresh={refresh}
      selectNews={selectNews}
    />
  )
}

export default LocalNews
