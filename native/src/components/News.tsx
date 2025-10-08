import { TFunction } from 'i18next'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { NewsRouteType, NewsType, TU_NEWS_TYPE, replaceLinks, tunewsLabel } from 'shared'
import { LocalNewsModel, TunewsModel, ErrorCode } from 'shared/api'

import { NavigationProps } from '../constants/NavigationTypes'
import { contentAlignment } from '../constants/contentDirection'
import useNavigate from '../hooks/useNavigate'
import useSetRouteTitle from '../hooks/useSetRouteTitle'
import useTtsPlayer from '../hooks/useTtsPlayer'
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
const getPageTitle = (
  selectedNewsType: NewsType,
  selectedNewsItem: LocalNewsModel | TunewsModel | null | undefined,
  t: TFunction,
): string => {
  if (selectedNewsItem?.title) {
    return selectedNewsItem.title
  }
  if (selectedNewsType === TU_NEWS_TYPE) {
    return tunewsLabel
  }
  return t('localNews.pageTitle')
}

type NewsModelsType = (LocalNewsModel | TunewsModel)[]

type NewsProps = {
  news: NewsModelsType
  navigateToNews: (newsId: number) => void
  newsId: number | null
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
  const selectedNewsItem = news.find(_newsItem => _newsItem.id === newsId)
  const { t } = useTranslation('news')
  useTtsPlayer(selectedNewsItem)

  const navigation = useNavigate().navigation as NavigationProps<NewsRouteType>
  useSetRouteTitle({ navigation, title: getPageTitle(selectedNewsType, selectedNewsItem, t) })

  const rendersNewsListItem = ({ item, index }: { item: LocalNewsModel | TunewsModel; index: number }) => {
    const navigateToNewsDetail = () => navigateToNews(item.id)

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

  if (selectedNewsItem) {
    return (
      <ScrollView>
        <Page
          title={selectedNewsItem.title}
          content={
            selectedNewsItem instanceof LocalNewsModel
              ? replaceLinks(selectedNewsItem.content)
              : selectedNewsItem.content
          }
          language={languageCode}
          accessible
          Footer={
            selectedNewsItem instanceof LocalNewsModel && (
              <TimeStampContent language={languageCode}>
                <TimeStamp lastUpdate={selectedNewsItem.timestamp} showText={false} />
              </TimeStampContent>
            )
          }
        />
      </ScrollView>
    )
  }

  if (newsId !== null) {
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
