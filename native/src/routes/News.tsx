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
  TU_NEWS_TYPE,
  NewsType
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
  selectNews: (newsId: string | null) => void
  newsId: string | null | undefined
  news: NewsModelsType | null
  cityModel: CityModel
  language: string
  selectedNewsType: NewsType
  isFetchingMore: boolean
  fetchMoreNews?: () => void
  refresh: () => void
}

const News = (props: PropsType): ReactElement => {
  const { news, newsId, language, fetchMoreNews, isFetchingMore, selectedNewsType, refresh, selectNews } = props
  const { cityModel } = props
  const { t } = useTranslation('news')

  const renderNoItemsComponent = (): React.ReactElement => <NoNews>{t('currentlyNoNews')}</NoNews>

  const rendersNewsListItem = useCallback(
    (cityCode: string, language: string) => ({
      item,
      index
    }: {
      item: LocalNewsModel | TunewsModel
      index: number
    }) => {
      const navigateToNews = () => selectNews(item.id.toString())

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
    [selectedNewsType, selectNews]
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

  if (!news) {
    return <></>
  }

  if (newsId) {
    const selectedNewsItem = news.find(_newsItem => _newsItem.id.toString() === newsId)

    if (selectedNewsItem) {
      return <NewsDetail newsItem={selectedNewsItem} language={language} />
    }
    const error = new NotFoundError({
      type: selectedNewsType,
      id: newsId,
      city: cityModel.code,
      language
    })
    return <Failure code={fromError(error)} />
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
        refresh={refresh}
      />
    </View>
  )
}

export default News
