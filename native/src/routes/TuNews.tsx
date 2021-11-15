import React, { ReactElement, useState } from 'react'

import {
  CityModel,
  TU_NEWS_TYPE
} from 'api-client'

import useLoadTuNews, { FIRST_PAGE_INDEX } from '../hooks/useLoadTuNews'
import News from './News'

export type PropsType = {
  newsId: string | null | undefined
  cityModel: CityModel
  language: string
  selectNews: (newsId: string | null) => void
}

const TuNewsNews = ({ language, cityModel, selectNews, newsId }: PropsType): ReactElement => {
  const [page, setPage] = useState<number>(FIRST_PAGE_INDEX)
  const { data, refresh, loading } = useLoadTuNews({ city: cityModel.code, language, page, newsId })

  const fetchMore = () => setPage(previousPage => previousPage + 1)

  return (
    <News
      newsId={newsId}
      news={data}
      cityModel={cityModel}
      language={language}
      selectedNewsType={TU_NEWS_TYPE}
      fetchMoreNews={fetchMore}
      isFetchingMore={loading}
      refresh={refresh}
      selectNews={selectNews}
    />
  )
}

export default TuNewsNews
