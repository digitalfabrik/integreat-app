import React, { ReactElement } from 'react'

import {
  CityModel,
  TU_NEWS_TYPE
} from 'api-client'

import useLoadTuNews from '../hooks/useLoadTuNews'
import News from './News'

export type PropsType = {
  newsId: string | null | undefined
  cityModel: CityModel
  language: string
  selectNews: (newsId: string | null) => void
}

const TuNewsNews = ({ language, cityModel, selectNews, newsId }: PropsType): ReactElement => {
  const { data, refresh, loading, loadMore } = useLoadTuNews({ city: cityModel.code, language, newsId })

  return (
    <News
      newsId={newsId}
      news={data}
      cityModel={cityModel}
      language={language}
      selectedNewsType={TU_NEWS_TYPE}
      fetchMoreNews={loadMore}
      isFetchingMore={loading}
      refresh={refresh}
      selectNews={selectNews}
    />
  )
}

export default TuNewsNews
