// @flow

import * as React from 'react'
import { View } from 'react-native'
import { TFunction, withTranslation } from 'react-i18next'
import { LocalNewsModel, NotFoundError, TunewsModel } from 'api-client'
import List from './List'
import Failure from '../../../modules/error/components/Failure'
import type { ThemeType } from 'build-configs/ThemeType'
import type { NewsModelsType } from '../../../modules/app/StateType'
import withTheme from '../../../modules/theme/hocs/withTheme'
import ErrorCodes from '../../../modules/error/ErrorCodes'
import NewsListItem from './NewsListItem'
import styled from 'styled-components/native'
import type { StyledComponent } from 'styled-components'
import NewsItemsDetails from './NewsItemDetails'
import openExternalUrl from '../../../modules/common/openExternalUrl'
import { NEWS_ROUTE, TU_NEWS_TYPE } from 'api-client/src/routes'
import type { RouteInformationType } from 'api-client/src/routes/RouteInformationTypes'
import type { NewsType } from 'api-client/src/routes'
import { tunewsWebsiteUrl } from '../../../modules/endpoint/constants'

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
  navigateTo: RouteInformationType => void
|}

class NewsList extends React.PureComponent<PropsType> {
  navigateToNews = (
    cityCode: string,
    language: string,
    newsId: string
  ) => () => {
    const { selectedNewsType } = this.props
    this.props.navigateTo({
      route: NEWS_ROUTE,
      cityCode,
      languageCode: language,
      newsId,
      newsType: selectedNewsType
    })
  }

  openTunewsLink = async () => {
    openExternalUrl(tunewsWebsiteUrl)
  }

  renderNoItemsComponent = () => {
    const { t, theme } = this.props
    return <NoNews theme={theme}>{t('currentlyNoNews')}</NoNews>
  }

  rendersNewsListItem = (cityCode: string, language: string) => ({ item: newsItem }) => {
    const { theme, selectedNewsType } = this.props
    const isTunews = selectedNewsType === TU_NEWS_TYPE
    return (
      <NewsListItem
        key={newsItem.id}
        newsItem={newsItem}
        language={language}
        theme={theme}
        isTunews={isTunews}
        navigateToNews={this.navigateToNews(
          cityCode,
          language,
          newsItem.id.toString()
        )}
      />
    )
  }

  render () {
    const {
      news,
      newsId,
      cityCode,
      language,
      theme,
      t,
      fetchMoreNews,
      isFetchingMore,
      selectedNewsType
    } = this.props

    const isTunews = selectedNewsType === TU_NEWS_TYPE
    if (newsId) {
      const selectedNewsItem: TunewsModel | LocalNewsModel | void = news.find(
        _newsItem => _newsItem.id.toString() === newsId
      )
      if (selectedNewsItem) {
        return (
          <NewsItemsDetails
            selectedNewsItem={selectedNewsItem}
            theme={theme}
            isTunews={isTunews}
            language={language}
            openTunewsLink={this.openTunewsLink}
          />
        )
      } else {
        const error = new NotFoundError({
          type: isTunews ? 'tunews' : 'localNews',
          id: newsId,
          city: cityCode,
          language
        })
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
        <List
          renderNoItemsComponent={this.renderNoItemsComponent}
          items={news}
          isFetchingMore={isFetchingMore}
          fetchMoreItems={fetchMoreNews}
          renderItem={this.rendersNewsListItem(cityCode, language)}
        />
      </View>
    )
  }
}

const TranslatedWithThemeNewsList = withTranslation('news')(
  withTheme(NewsList)
)
export default TranslatedWithThemeNewsList
