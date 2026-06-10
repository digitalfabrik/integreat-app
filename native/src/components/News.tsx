import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, View } from 'react-native'
import styled from 'styled-components/native'

import {
  NEWS_ROUTE,
  NEWS_SOURCE_FILTERS,
  NewsRouteType,
  NewsSourceFilter as NewsSourceFilterType,
  replaceLinks,
} from 'shared'
import { ErrorCodes, LOCAL_NEWS_SOURCE, NewsModel } from 'shared/api'

import { NavigationProps } from '../constants/NavigationTypes'
import { contentAlignmentRTLText } from '../constants/contentDirection'
import useNavigate from '../hooks/useNavigate'
import useSetRouteTitle from '../hooks/useSetRouteTitle'
import useTtsPlayer from '../hooks/useTtsPlayer'
import Caption from './Caption'
import Failure from './Failure'
import List from './List'
import NewsListItem from './NewsListItem'
import Page from './Page'
import TimeStamp from './TimeStamp'
import ToggleTextButtonGroup from './ToggleTextButtonGroup'
import Text from './base/Text'

const ListHeaderContainer = styled(View)`
  padding-inline: 16px;
  padding-bottom: 16px;
  gap: 8px;
`

type NewsProps = {
  news: NewsModel[]
  id: number | null
  regionCode: string
  languageCode: string
  refresh: () => void
  newsSource: NewsSourceFilterType
  setNewsSource: (value: NewsSourceFilterType) => void
}

const News = ({ news, id, languageCode, regionCode, refresh, newsSource, setNewsSource }: NewsProps): ReactElement => {
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
    return <Failure code={ErrorCodes.PageNotFound} retry={refresh} />
  }

  return (
    <List
      items={news}
      noItemsMessage={t('currentlyNoNews')}
      header={
        <ListHeaderContainer>
          <Caption title={t('news')} />
          <ToggleTextButtonGroup
            setValue={setNewsSource}
            value={newsSource}
            options={NEWS_SOURCE_FILTERS}
            getLabel={t}
          />
        </ListHeaderContainer>
      }
      renderItem={rendersNewsListItem}
      refresh={refresh}
    />
  )
}

export default News
