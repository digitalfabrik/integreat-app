// @flow

import React, { useCallback } from 'react'
import { View } from 'react-native'
import { TFunction, withTranslation } from 'react-i18next'
import { LocalNewsModel, NotFoundError, TunewsModel } from 'api-client'
import NewsList from './NewsList'
import Failure from '../../../modules/error/components/Failure'
import type { ThemeType } from 'build-configs/ThemeType'
import type { NewsModelsType } from '../../../modules/app/StateType'
import withTheme from '../../../modules/theme/hocs/withTheme'
import ErrorCodes from '../../../modules/error/ErrorCodes'
import NewsListItem from './NewsListItem'
import styled from 'styled-components/native'
import type { StyledComponent } from 'styled-components'
import NewsDetail from './NewsDetail'
import { NEWS_ROUTE, TU_NEWS_TYPE } from 'api-client/src/routes'
import type { RouteInformationType } from 'api-client/src/routes/RouteInformationTypes'
import type { NewsType } from 'api-client/src/routes'

const NoNews: StyledComponent<{||}, ThemeType, *> = styled.Text`
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.contentFontRegular};
  align-self: center;
  margin-top: 20px;
`

export type PropsType = {|
  newsId: ?string,
  news: NewsModelsType,
  cityCode: string,
  language: string,
  theme: ThemeType,
  t: TFunction,
  selectedNewsType: NewsType,
  isFetchingMore: boolean,
  fetchMoreNews: () => void,
  navigateTo: RouteInformationType => void,
  navigateToLink: (url: string, language: string, shareUrl: string) => void
|}

const News = (props: PropsType) => {
  const { news, newsId, cityCode, language, fetchMoreNews, isFetchingMore, selectedNewsType, theme, t } = props
  const { navigateTo, navigateToLink } = props

  const navigateToNews = useCallback((cityCode: string, language: string, newsId: string) => () => {
    navigateTo({
      route: NEWS_ROUTE,
      cityCode,
      languageCode: language,
      newsId,
      newsType: selectedNewsType
    })
  }, [selectedNewsType, navigateTo])

  const renderNoItemsComponent = useCallback(() => {
    return <NoNews theme={theme}>{t('currentlyNoNews')}</NoNews>
  }, [theme, t])

  const rendersNewsListItem = useCallback((cityCode: string, language: string) =>
    ({ item }: { item: LocalNewsModel | TunewsModel, ... }) => {
      return (
      <NewsListItem
        key={item.id}
        newsItem={item}
        language={language}
        theme={theme}
        isTunews={selectedNewsType === TU_NEWS_TYPE}
        navigateToNews={navigateToNews(cityCode, language, item.id.toString())}
        t={t}
      />
      )
    }, [selectedNewsType, navigateToNews, theme, t])

  if (newsId) {
    const selectedNewsItem = news.find(_newsItem => _newsItem.id.toString() === newsId)
    if (selectedNewsItem) {
      return (
          <NewsDetail
            newsItem={selectedNewsItem}
            theme={theme}
            language={language}
            navigateToLink={navigateToLink}
          />
      )
    } else {
      const error = new NotFoundError({ type: selectedNewsType, id: newsId, city: cityCode, language })
      return (
          <Failure
            errorMessage={error.message}
            code={ErrorCodes.PageNotFound}
            t={t}
            theme={theme}
          />
      )
    }
  }

  return (
      <View style={{ flex: 1 }}>
        <NewsList
          renderNoItemsComponent={renderNoItemsComponent}
          items={news}
          isFetchingMore={isFetchingMore}
          fetchMoreItems={fetchMoreNews}
          renderItem={rendersNewsListItem(cityCode, language)}
        />
      </View>
  )
}

const TranslatedWithThemeNewsList = withTranslation('news')(
  withTheme(News)
)
export default TranslatedWithThemeNewsList
