import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { ErrorCode, LocalNewsModel, NewsRouteType, NewsType, TU_NEWS_TYPE, TunewsModel } from 'api-client'

import { NavigationProps } from '../constants/NavigationTypes'
import { contentAlignment } from '../constants/contentDirection'
import DateFormatterContext from '../contexts/DateFormatterContext'
import useNavigate from '../hooks/useNavigate'
import useSetRouteTitle from '../hooks/useSetRouteTitle'
import Failure from './Failure'
import List from './List'
import LoadingSpinner from './LoadingSpinner'
import NewsListItem from './NewsListItem'
import Page from './Page'
import TimeStamp from './TimeStamp'

const TimeStampContent = styled.Text<{ language: string }>`
  padding: 17px 0;
  text-align: ${props => contentAlignment(props.language)};
  align-self: center;
`

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
  const selectedNewsItem = newsId ? news.find(_newsItem => _newsItem.id.toString() === newsId) : null
  const formatter = useContext(DateFormatterContext)
  const { t } = useTranslation('news')

  const navigation = useNavigate().navigation as NavigationProps<NewsRouteType>
  useSetRouteTitle({ navigation, title: selectedNewsItem?.title })

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
    if (selectedNewsItem) {
      return (
        <ScrollView>
          <Page
            title={selectedNewsItem.title}
            content={`<div>${selectedNewsItem.content}</div>`}
            language={languageCode}
            AfterContent={
              selectedNewsItem instanceof LocalNewsModel && (
                <TimeStampContent language={languageCode}>
                  <TimeStamp
                    formatter={formatter}
                    lastUpdate={selectedNewsItem.timestamp}
                    showText={false}
                    format='LLL'
                  />
                </TimeStampContent>
              )
            }
          />
        </ScrollView>
      )
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
