import React, { ReactElement, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import styled from 'styled-components/native'

import {
  CityModel,
  fromError,
  LOCAL_NEWS_TYPE,
  LocalNewsModel,
  NotFoundError,
  TunewsModel,
  NEWS_ROUTE,
  TU_NEWS_TYPE,
  NewsType,
  RouteInformationType
} from 'api-client'

import Failure from '../components/Failure'
import NewsDetail from '../components/NewsDetail'
import NewsList from '../components/NewsList'
import NewsListItem from '../components/NewsListItem'
import { NewsModelsType } from '../redux/StateType'

const NoNews = styled.Text`
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.contentFontRegular};
  align-self: center;
  margin-top: 20px;
`
export type PropsType = {
  newsId: string | null | undefined
  news: NewsModelsType
  cityModel: CityModel
  language: string
  selectedNewsType: NewsType
  isFetchingMore: boolean
  fetchMoreNews: () => void
  navigateTo: (arg0: RouteInformationType) => void
  navigateToLink: (url: string, language: string, shareUrl: string) => Promise<void>
  routeKey: string
}

const News = (props: PropsType): ReactElement => {
  const { news, newsId, language, fetchMoreNews, isFetchingMore, selectedNewsType, routeKey } = props
  const { navigateTo, navigateToLink, cityModel } = props
  const { t } = useTranslation('news')

  const renderNoItemsComponent = (): React.ReactElement => {
    return <NoNews>{t('currentlyNoNews')}</NoNews>
  }

  const rendersNewsListItem = useCallback(
    (cityCode: string, language: string) => ({
      item,
      index
    }: {
      item: LocalNewsModel | TunewsModel
      index: number
    }) => {
      const navigateToNews = () => {
        navigateTo({
          route: NEWS_ROUTE,
          cityCode,
          languageCode: language,
          newsId: item.id.toString(),
          newsType: selectedNewsType
        })
      }

      return (
        <NewsListItem
          index={index}
          key={item.id}
          newsItem={item}
          language={language}
          isTunews={selectedNewsType === TU_NEWS_TYPE}
          navigateToNews={navigateToNews}
        />
      )
    },
    [selectedNewsType, navigateTo]
  )

  if (selectedNewsType === LOCAL_NEWS_TYPE ? !cityModel.pushNotificationsEnabled : !cityModel.tunewsEnabled) {
    const error = new NotFoundError({
      type: 'category',
      id: selectedNewsType,
      city: cityModel.code,
      language
    })
    return <Failure code={fromError(error)} />
  }

  if (newsId) {
    const selectedNewsItem = news.find(_newsItem => _newsItem.id.toString() === newsId)

    if (selectedNewsItem) {
      return <NewsDetail newsItem={selectedNewsItem} language={language} navigateToLink={navigateToLink} />
    } else {
      const error = new NotFoundError({
        type: selectedNewsType,
        id: newsId,
        city: cityModel.code,
        language
      })
      return <Failure code={fromError(error)} />
    }
  }

  return (
    <View
      style={{
        flex: 1
      }}>
      <NewsList
        renderNoItemsComponent={renderNoItemsComponent}
        items={news}
        isFetchingMore={isFetchingMore}
        fetchMoreItems={fetchMoreNews}
        renderItem={rendersNewsListItem(cityModel.code, language)}
        navigateTo={navigateTo}
        selectedNewsType={selectedNewsType}
        newsId={newsId}
        routeKey={routeKey}
        cityCode={cityModel.code}
        language={language}
      />
    </View>
  )
}

export default News
