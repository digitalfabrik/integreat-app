// @flow

import * as React from 'react'
import { View, ScrollView } from 'react-native'
import { TFunction, withTranslation } from 'react-i18next'
import {
  LocalNewsModel,
  TunewsModel
} from '@integreat-app/integreat-api-client'
import ContentNotFoundError from '../../../modules/error/ContentNotFoundError'
import List from './List'
import Failure from '../../../modules/error/components/Failure'
import type { ThemeType } from '../../../modules/theme/constants/theme'
import type { LanguageResourceCacheStateType } from '../../../modules/app/StateType'
import type { NavigateToNewsParamsType } from '../../../modules/app/createNavigateToNews'
import withTheme from '../../../modules/theme/hocs/withTheme'
import SpaceBetween from '../../../modules/common/components/SpaceBetween'
import ErrorCodes from '../../../modules/error/ErrorCodes'
import NewsListItem from './NewsListItem'
import headerImage from '../assets/tu-news-header-details-icon.svg'
import styled from 'styled-components/native'
import type { StyledComponent } from 'styled-components'
import { TUNEWS } from '../containers/WithCustomNewsProvider'
import { contentAlignment } from '../../../modules/i18n/contentDirection'

const Container: StyledComponent<{}, {}, *> = styled.View`
  align-items: center;
  margin-horizontal: 3%;
  flex: 1;
`

const HeaderImageWrapper: StyledComponent<{}, {}, *> = styled.View`
  width: 95%;
  align-self: center;
  align-items: flex-start;
  margin-top: 19px;
  border-radius: 5px;
  background-color: rgba(2, 121, 166, 0.4);
`
const HeaderImage: StyledComponent<{}, {}, *> = styled.Image`
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
`

const Row: StyledComponent<{}, ThemeType, *> = styled.View`
  flex-direction: row;
  border-radius: 5px;
  width: 95%;
  align-self: center;
  background-color: ${props => props.theme.colors.tunewsColor};
`

const ExtraInfo: StyledComponent<{}, ThemeType, *> = styled.Text`
  font-family: ${props => props.theme.fonts.decorativeFontBold};
  font-size: 12px;
  color: white;
  padding: 5px;
`

const NoNews: StyledComponent<{}, ThemeType, *> = styled.Text`
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.contentFontRegular};
  align-self: center;
  margin-top: 20px;
`

const NewsDetailsTitle: StyledComponent<{}, ThemeType, *> = styled.Text`
  font-weight: 700;
  font-family: ${props => props.theme.fonts.decorativeFontBold};
  color: ${props => props.theme.colors.textColor};
  font-size: 18px;
  margin-top: 18px;
  margin-bottom: 15px;
`

const NewsDetailsContent: StyledComponent<
  { language: string },
  ThemeType,
  *
> = styled.Text`
  font-family: ${props => props.theme.fonts.decorativeFontRegular};
  font-size: 16px;
  letter-spacing: 0.5px;
  line-height: 24px;
  text-align: ${props => contentAlignment(props.language)};
  color: ${props => props.theme.colors.textColor};
`
export type PropsType = {|
  path: ?string,
  newsList: Array<LocalNewsModel | TunewsModel>,
  cityCode: string,
  language: string,
  resourceCache: LanguageResourceCacheStateType,
  theme: ThemeType,
  t: TFunction,
  selectedNewsType: string,
  status: "ready" | "loadingMore",
  isFetchingMore: boolean,
  type: string,
  fetchMoreNews: () => void,
  fetchNews: () => void,
  navigateToNews: (navigationOptions: NavigateToNewsParamsType) => void,
  createNavigateToNews: (NavigateToNewsParamsType) => void
|}

/**
 * Displays a list of news or a single news item, matching the route <id>)
 */
class NewsList extends React.PureComponent<PropsType> {
  navigateToNews = (cityCode: string, language: string, path: string) => () => {
    const { selectedNewsType } = this.props
    this.props.navigateToNews({
      cityCode,
      language,
      path,
      type: selectedNewsType
    })
  };

  renderNoItemsComponent = () => {
    const { t, theme } = this.props
    return <NoNews theme={theme}>{t('currentlyNoNews')}</NoNews>
  };

  rendersNewsListItem = (cityCode: string, language: string) => ({
    item: newsItem
  }) => {
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
          `${newsItem.id}`
        )}
      />
    )
  };

  render () {
    const {
      newsList,
      path,
      cityCode,
      language,
      theme,
      t,
      fetchMoreNews,
      fetchNews,
      isFetchingMore,
      selectedNewsType
    } = this.props

    const isTunews = selectedNewsType === TUNEWS

    if (path) {
      const selectedNewsItem: LocalNewsModel | TunewsModel = newsList.find(
        _newsItem => `${_newsItem.id}` === path
      )

      if (selectedNewsItem) {
        const content = selectedNewsItem.content || ''
        const contentFooterIndex = content.indexOf('tünews')
        const contentExtraInfo = content.substring(contentFooterIndex)
        const splittedContent = content.split(contentExtraInfo)[0]

        return (
          <View style={{ flex: 1 }}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                flexGrow: 1,
                marginBottom: 10,
                paddingHorizontal: '5%'
              }}>
              {isTunews && (
                <HeaderImageWrapper>
                  <HeaderImage source={headerImage} />
                </HeaderImageWrapper>
              )}
              <Container>
                <NewsDetailsTitle theme={theme}>
                  {selectedNewsItem.title}
                </NewsDetailsTitle>
                <NewsDetailsContent theme={theme} language={language}>
                  {splittedContent || selectedNewsItem.message}
                </NewsDetailsContent>
              </Container>
              <Row theme={theme}>
                {contentExtraInfo ? (
                  <ExtraInfo theme={theme}>{contentExtraInfo}</ExtraInfo>
                ) : null}
              </Row>
            </ScrollView>
          </View>
        )
      }

      const error = new ContentNotFoundError({
        type: 'news',
        id: path,
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

    return (
      <SpaceBetween>
        <View style={{ flex: 1 }}>
          <List
            renderNoItemsComponent={this.renderNoItemsComponent}
            items={newsList}
            isFetchingMore={isFetchingMore}
            getMoreItems={fetchMoreNews}
            fetchItems={fetchNews}
            renderItem={this.rendersNewsListItem(cityCode, language)}
          />
        </View>
      </SpaceBetween>
    )
  }
}

const TranslatedWithThemeNewsList = withTranslation('news')(
  withTheme(props => props.language)(NewsList)
)
export default TranslatedWithThemeNewsList
