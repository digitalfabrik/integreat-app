// @flow

import * as React from 'react'
import { View, Linking } from 'react-native'
import { TFunction, withTranslation } from 'react-i18next'
import { LocalNewsModel, NotFoundError, TunewsModel } from 'api-client'
import List from './List'
import Failure from '../../../modules/error/components/Failure'
import type { ThemeType } from '../../../modules/theme/constants'
import type {
  LanguageResourceCacheStateType,
  NewsModelsType,
  NewsType
} from '../../../modules/app/StateType'
import type { NavigateToNewsParamsType } from '../../../modules/app/createNavigateToNews'
import withTheme from '../../../modules/theme/hocs/withTheme'
import ErrorCodes from '../../../modules/error/ErrorCodes'
import NewsListItem from './NewsListItem'
import styled from 'styled-components/native'
import type { StyledComponent } from 'styled-components'
import NewsItemsDetails from './NewsItemDetails'
import { TUNEWS } from '../../../modules/endpoint/constants'

const tunewsWebsiteUrl = 'https://tunewsinternational.com'

const NoNews: StyledComponent<{}, ThemeType, *> = styled.Text`
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
  resourceCache: LanguageResourceCacheStateType,
  theme: ThemeType,
  t: TFunction,
  selectedNewsType: NewsType,
  isFetchingMore: boolean,
  fetchMoreNews: () => void,
  navigateToNews: (navigationOptions: NavigateToNewsParamsType) => void,
  createNavigateToNews: (NavigateToNewsParamsType) => void
|}

/* Displays a list of news or a single news item, matching the route <id>)
 */

class NewsList extends React.PureComponent<PropsType> {
  navigateToNews = (
    cityCode: string,
    language: string,
    newsId: string
  ) => () => {
    const { selectedNewsType } = this.props
    this.props.navigateToNews({
      cityCode,
      language,
      newsId,
      type: selectedNewsType
    })
  }

  openTunewsLink = async () => {
    const supported = await Linking.canOpenURL(tunewsWebsiteUrl)
    if (supported) {
      await Linking.openURL(tunewsWebsiteUrl)
    }
  }

  renderNoItemsComponent = () => {
    const { t, theme } = this.props
    return <NoNews theme={theme}>{t('currentlyNoNews')}</NoNews>
  }

  rendersNewsListItem = (cityCode: string, language: string) => ({ item: newsItem }) => {
    const { theme, selectedNewsType } = this.props
    const isTunews = selectedNewsType === TUNEWS
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

    const isTunews = selectedNewsType === TUNEWS
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
