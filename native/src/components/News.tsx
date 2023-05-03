import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { ErrorCode, LocalNewsModel, NewsType, TU_NEWS_TYPE, TunewsModel } from 'api-client'

import Failure from './Failure'
import List from './List'
import LoadingSpinner from './LoadingSpinner'
import NewsDetail from './NewsDetail'
import NewsListItem from './NewsListItem'

type NewsModelsType = Array<LocalNewsModel | TunewsModel>

export type NewsProps = {
  news: NewsModelsType
  navigateToNews: (newsId: string) => void
  newsId: string | null | undefined
  languageCode: string
  selectedNewsType: NewsType
  loadMore?: () => void
  loadingMore?: boolean
  refresh: () => void
}

const News = ({
  news,
  loadMore,
  newsId,
  languageCode,
  selectedNewsType,
  navigateToNews,
  refresh,
  loadingMore,
}: NewsProps): ReactElement => {
  const { t } = useTranslation('news')

  const rendersNewsListItem = ({ item, index }: { item: LocalNewsModel | TunewsModel; index: number }) => {
    const navigateToNewsDetail = () => navigateToNews(item.id.toString())

    return (
      <NewsListItem
        index={index}
        key={item.id}
        newsItem={item}
        isTunews={selectedNewsType === TU_NEWS_TYPE}
        navigateToNews={navigateToNewsDetail}
      />
    )
  }

  if (newsId) {
    const selectedNewsItem = news.find(_newsItem => _newsItem.id.toString() === newsId)

    if (selectedNewsItem) {
      return <NewsDetail newsItem={selectedNewsItem} language={languageCode} />
    }
    return <Failure code={ErrorCode.PageNotFound} />
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
