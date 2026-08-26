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
import { AMAL_NEWS_SOURCE, ErrorCodes, LOCAL_NEWS_SOURCE, NewsModel, RegionModel } from 'shared/api'

import { AmalNewsLogo, TuNewsIcon } from '../assets'
import { NavigationProps } from '../constants/NavigationTypes'
import { contentAlignmentRTLText } from '../constants/contentDirection'
import useNavigate from '../hooks/useNavigate'
import useSetRouteTitle from '../hooks/useSetRouteTitle'
import useTtsPlayer from '../hooks/useTtsPlayer'
import useOpenExternalUrl from '../utils/openExternalUrl'
import Caption from './Caption'
import Failure from './Failure'
import List from './List'
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
  news: NewsModel[]
  id: string | null
  region: RegionModel
  languageCode: string
  refresh: () => void
  sourceFilter: NewsSourceFilterType
  setSourceFilter: (value: NewsSourceFilterType) => void
}

const News = ({ news, id, languageCode, region, refresh, sourceFilter, setSourceFilter }: NewsProps): ReactElement => {
  const selectedNewsItem = news.find(item => item.id === id)
  const { navigateTo } = useNavigate()
  const { t } = useTranslation(['news'])
  const openExternalUrl = useOpenExternalUrl()
  useTtsPlayer(selectedNewsItem)

  const navigation = useNavigate().navigation as NavigationProps<NewsRouteType>
  useSetRouteTitle({ navigation, title: selectedNewsItem?.title ?? t($ => $.news.news) })

  const rendersNewsListItem = ({ item }: { item: NewsModel }) => (
    <NewsListItem
      key={item.id}
      newsItem={item}
      navigateToNews={() => navigateTo({ route: NEWS_ROUTE, regionCode: region.code, languageCode, id: item.id })}
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
            <View>
              <Text style={{ paddingVertical: 16, textAlign: contentAlignmentRTLText(selectedNewsItem.title) }}>
                <TimeStamp lastUpdate={selectedNewsItem.lastUpdate} showText={false} />
              </Text>
              {selectedNewsItem.source !== LOCAL_NEWS_SOURCE && (
                <NewsSourceLink onPress={() => openExternalUrl(selectedNewsItem.externalUrl)} role='link'>
                  <NewsSourceLogo icon={selectedNewsItem.source === AMAL_NEWS_SOURCE ? AmalNewsLogo : TuNewsIcon} />
                </NewsSourceLink>
              )}
            </View>
          }
        />
      </ScrollView>
    )
  }

  if (id !== null) {
    return <Failure code={ErrorCodes.PageNotFound} retry={refresh} />
  }

  const showNewsSourceFilter = region.localNewsEnabled && region.externalNewsEnabled

  return (
    <List
      items={news}
      noItemsMessage={t($ => $.news.currentlyNoNews)}
      header={
        <ListHeaderContainer>
          <Caption title={t($ => $.news.news)} />
          {showNewsSourceFilter && (
            <ToggleTextButtonGroup
              setValue={setSourceFilter}
              value={sourceFilter}
              options={NEWS_SOURCE_FILTERS}
              getLabel={value => t($ => $.news[value])}
            />
          )}
        </ListHeaderContainer>
      }
      renderItem={rendersNewsListItem}
      refresh={refresh}
    />
  )
}

export default News
