import React, { ReactElement, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import styled from 'styled-components/native'

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
import LoadingSpinner from './LoadingSpinner'
import NewsDetail from './NewsDetail'
import NewsList from './NewsList'
import NewsListItem from './NewsListItem'

type NewsModelsType = Array<LocalNewsModel | TunewsModel>

const NoNews = styled.Text`
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.contentFontRegular};
  align-self: center;
  margin-top: 20px;
`
export type PropsType = ReturnType<NewsModelsType> & {
  selectNews: (newsId: string | null) => void
  newsId: string | null | undefined
  cityModel: CityModel
  language: string
  selectedNewsType: NewsType
  loadMore?: () => void
  loadingMore?: boolean
}

const News = (props: PropsType): ReactElement => {
  const { data, loading, loadMore, error, newsId, language, selectedNewsType, refresh, selectNews, cityModel } = props
  const { loadingMore } = props
  const { t } = useTranslation('news')

  const renderNoItemsComponent = (): React.ReactElement => <NoNews>{t('currentlyNoNews')}</NoNews>

  const rendersNewsListItem = useCallback(
    (params: { item: LocalNewsModel | TunewsModel; index: number }) => {
      const { item, index } = params
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
    [selectedNewsType, selectNews, language]
  )

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
    <View
      style={{
        flex: 1,
      }}>
      <NewsList
        renderNoItemsComponent={renderNoItemsComponent}
        items={news}
        isFetchingMore={loadingMore ?? false}
        fetchMoreItems={loadMore}
        renderItem={rendersNewsListItem}
        refresh={refresh}
      />
    </View>
  )
}

export default News
