import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, ScrollView, View } from 'react-native'
import styled from 'styled-components/native'

import {
  NEWS_ROUTE,
  NEWS_SOURCE_FILTERS,
  NewsRouteType,
  NewsSourceFilter as NewsSourceFilterType,
  replaceLinks,
} from 'shared'
import { AMAL_NEWS_SOURCE, ErrorCodes, fromError, LOCAL_NEWS_SOURCE, NewsModel, PaginatedReturnType } from 'shared/api'

import { AmalNewsLogo, TuNewsIcon } from '../assets'
import { NavigationProps } from '../constants/NavigationTypes'
import { contentAlignmentRTLText } from '../constants/contentDirection'
import useNavigate from '../hooks/useNavigate'
import useSetRouteTitle from '../hooks/useSetRouteTitle'
import useSnackbar from '../hooks/useSnackbar'
import useTtsPlayer from '../hooks/useTtsPlayer'
import openExternalUrl from '../utils/openExternalUrl'
import Caption from './Caption'
import Failure from './Failure'
import List from './List'
import LoadingSpinner from './LoadingSpinner'
import NewsListItem from './NewsListItem'
import Page from './Page'
import TimeStamp from './TimeStamp'
import ToggleTextButtonGroup from './ToggleTextButtonGroup'
import Icon from './base/Icon'
import Text from './base/Text'

const NewsSourceLogo = styled(Icon)`
  width: 100%;
  height: 64px;
`

const NewsSourceLink = styled(Pressable)`
  padding-top: 16px;
`

const ListHeaderContainer = styled(View)`
  padding-inline: 16px;
  padding-bottom: 16px;
  gap: 8px;
`

type NewsProps = {
  response: PaginatedReturnType<NewsModel>
  news: NewsModel[]
  id: number | null
  regionCode: string
  languageCode: string
  newsSource: NewsSourceFilterType
  setNewsSource: (value: NewsSourceFilterType) => void
}

const News = ({ response, news, id, languageCode, regionCode, newsSource, setNewsSource }: NewsProps): ReactElement => {
  const selectedNewsItem = news.find(item => item.id === id)
  const { navigateTo } = useNavigate()
  const { t } = useTranslation('news')
  const showSnackbar = useSnackbar()
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
        {selectedNewsItem.source !== LOCAL_NEWS_SOURCE && (
          <NewsSourceLink onPress={() => openExternalUrl(selectedNewsItem.externalUrl, showSnackbar)} role='link'>
            <NewsSourceLogo icon={selectedNewsItem.source === AMAL_NEWS_SOURCE ? AmalNewsLogo : TuNewsIcon} />
          </NewsSourceLink>
        )}
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
    <List
      items={news}
      onEndReached={response.loadMore}
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
      footer={response.loadingMore ? <LoadingSpinner testID='loadingSpinner' /> : paginationError}
      renderItem={rendersNewsListItem}
      refresh={response.refresh}
    />
  )
}

export default News
