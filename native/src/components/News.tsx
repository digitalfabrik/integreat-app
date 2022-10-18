import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import {
  CityModel,
  fromError,
  LOCAL_NEWS_TYPE,
  LocalNewsModel,
  NewsType,
  NotFoundError,
  ReturnType,
  TU_NEWS_TYPE,
  TunewsModel,
} from 'api-client'

import Failure from './Failure'
import List from './List'
import LoadingSpinner from './LoadingSpinner'
import NewsDetail from './NewsDetail'
import NewsListItem from './NewsListItem'

type NewsModelsType = Array<LocalNewsModel | TunewsModel>

export type NewsProps = ReturnType<NewsModelsType> & {
  selectNews: (newsId: string | null) => void
  newsId: string | null | undefined
  cityModel: CityModel
  language: string
  selectedNewsType: NewsType
  loadMore?: () => void
  loadingMore?: boolean
}

const News = (props: NewsProps): ReactElement => {
  const { data, loading, loadMore, error, newsId, language, selectedNewsType, refresh, selectNews, cityModel } = props
  const { loadingMore } = props
  const { t } = useTranslation('news')

  const rendersNewsListItem = ({ item, index }: { item: LocalNewsModel | TunewsModel; index: number }) => {
    const navigateToNews = () => selectNews(item.id.toString())

    return (
      <NewsListItem
        index={index}
        key={item.id}
        newsItem={item}
        isTunews={selectedNewsType === TU_NEWS_TYPE}
        navigateToNews={navigateToNews}
      />
    )
  }

  const isDisabled = selectedNewsType === LOCAL_NEWS_TYPE ? !cityModel.localNewsEnabled : !cityModel.tunewsEnabled
  const errorToShow = isDisabled
    ? new NotFoundError({
        type: 'category',
        id: selectedNewsType,
        city: cityModel.code,
        language,
      })
    : error

  if (errorToShow) {
    return <Failure code={fromError(errorToShow)} />
  }

  if (loading) {
    return <LoadingSpinner testID='loadingSpinner' />
  }

  const news = data ?? []

  if (newsId) {
    const selectedNewsItem = news.find(_newsItem => _newsItem.id.toString() === newsId)

    if (selectedNewsItem) {
      return <NewsDetail newsItem={selectedNewsItem} language={language} />
    }
    const error = new NotFoundError({
      type: selectedNewsType,
      id: newsId,
      city: cityModel.code,
      language,
    })
    return <Failure code={fromError(error)} />
  }

  return (
    <List
      items={news}
      onEndReached={loadMore}
      noItemsMessage={t('currentlyNoNews')}
      Footer={loadingMore ? <LoadingSpinner testID='loadingSpinner' /> : undefined}
      renderItem={rendersNewsListItem}
      refresh={refresh}
    />
  )
}

export default News
