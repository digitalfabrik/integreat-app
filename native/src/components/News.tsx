import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'

import { NEWS_ROUTE, NewsRouteType, replaceLinks } from 'shared'
import { ErrorCodes, fromError, LOCAL_NEWS_SOURCE, NewsModel, PaginatedReturnType } from 'shared/api'

import { NavigationProps } from '../constants/NavigationTypes'
import { contentAlignmentRTLText } from '../constants/contentDirection'
import useNavigate from '../hooks/useNavigate'
import useSetRouteTitle from '../hooks/useSetRouteTitle'
import useTtsPlayer from '../hooks/useTtsPlayer'
import Caption from './Caption'
import Failure from './Failure'
import List from './List'
import LoadingSpinner from './LoadingSpinner'
import NewsListItem from './NewsListItem'
import Page from './Page'
import TimeStamp from './TimeStamp'
import Text from './base/Text'

type NewsProps = {
  response: PaginatedReturnType<NewsModel>
  news: NewsModel[]
  id: number | null
  regionCode: string
  languageCode: string
}

const News = ({ response, news, id, languageCode, regionCode }: NewsProps): ReactElement => {
  const selectedNewsItem = news.find(item => item.id === id)
  const { navigateTo } = useNavigate()
  const { t } = useTranslation('news')
  useTtsPlayer(selectedNewsItem)

  const navigation = useNavigate().navigation as NavigationProps<NewsRouteType>
  useSetRouteTitle({ navigation, title: selectedNewsItem?.title ?? t('news') })

  const rendersNewsListItem = ({ item }: { item: NewsModel }) => (
    <NewsListItem
      key={item.id}
      newsItem={item}
      navigateToNews={() => navigateTo({ route: NEWS_ROUTE, regionCode, languageCode, id: item.id })}
    />
  )

  if (selectedNewsItem) {
    return (
      <ScrollView>
        <Page
          title={selectedNewsItem.title}
          content={
            selectedNewsItem.source === LOCAL_NEWS_SOURCE
              ? replaceLinks(selectedNewsItem.content)
              : selectedNewsItem.content
          }
          language={languageCode}
          footer={
            selectedNewsItem.source === LOCAL_NEWS_SOURCE && (
              <Text
                style={{
                  paddingVertical: 16,
                  textAlign: contentAlignmentRTLText(selectedNewsItem.title),
                  alignSelf: 'center',
                }}>
                <TimeStamp lastUpdate={selectedNewsItem.lastUpdate} showText={false} />
              </Text>
            )
          }
        />
      </ScrollView>
    )
  }

  if (id !== null) {
    return <Failure code={ErrorCodes.PageNotFound} retry={response.refresh} />
  }

  const paginationError = response.error ? (
    <Failure retry={response.refresh} code={fromError(response.error)} />
  ) : undefined

  return (
    <>
      <Caption title={t('news')} />
      <List
        items={news}
        onEndReached={response.loadMore}
        noItemsMessage={t('currentlyNoNews')}
        footer={response.loadingMore ? <LoadingSpinner testID='loadingSpinner' /> : paginationError}
        renderItem={rendersNewsListItem}
        refresh={response.refresh}
      />
    </>
  )
}

export default News
