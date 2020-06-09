// @flow

import * as React from 'react'
import { View, ScrollView, Linking } from 'react-native'
import { TFunction, withTranslation } from 'react-i18next'
import {
  LocalNewsModel,
  TunewsModel
} from '@integreat-app/integreat-api-client'
import ContentNotFoundError from '../../../modules/error/ContentNotFoundError'
import List from './List'
import Failure from '../../../modules/error/components/Failure'
import type { ThemeType } from '../../../modules/theme/constants/theme'
import type {
  LanguageResourceCacheStateType,
  NewsModelsType,
  NewsType
} from '../../../modules/app/StateType'
import type { NavigateToNewsParamsType } from '../../../modules/app/createNavigateToNews'
import withTheme from '../../../modules/theme/hocs/withTheme'
import SpaceBetween from '../../../modules/common/components/SpaceBetween'
import ErrorCodes from '../../../modules/error/ErrorCodes'
import NewsListItem from './NewsListItem'
import headerImage from '../assets/tu-news-header-details-icon.svg'
import styled from 'styled-components/native'
import type { StyledComponent } from 'styled-components'
import { TUNEWS } from '../containers/WithCustomNewsProvider'
import {
  contentAlignment,
  contentDirection
} from '../../../modules/i18n/contentDirection'
import MomentContext from '../../../modules/i18n/context/MomentContext'
const tunewsWebsiteUrl = 'https://tunewsinternational.com'

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

const Row: StyledComponent<{ language: string }, ThemeType, *> = styled.View`
  flex-direction: ${props => contentDirection(props.language)};
  border-radius: 5px;
  width: 95%;
  flex-wrap: wrap;
  align-self: center;
  padding: 5px;
  background-color: ${props => props.theme.colors.tunewsThemeColor};
`

const TunewsFooter: StyledComponent<
  { underlined?: boolean, rightMargin: number },
  ThemeType,
  *
> = styled.Text`
  font-family: ${props => props.theme.fonts.decorativeFontBold};
  font-size: 12px;
  color: white;
  margin-right: ${props => props.rightMargin || 0}px;
  text-decoration-line: ${props => (props.underlined ? 'underline' : 'none')};
`

const NoNews: StyledComponent<{}, ThemeType, *> = styled.Text`
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.contentFontRegular};
  align-self: center;
  margin-top: 20px;
`

const NewsHeadLine: StyledComponent<{}, ThemeType, *> = styled.Text`
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
  newsId: ?string,
  news: NewsModelsType,
  cityCode: string,
  language: string,
  resourceCache: LanguageResourceCacheStateType,
  theme: ThemeType,
  t: TFunction,
  selectedNewsType: NewsType,
  status: "ready" | "loadingMore",
  isFetchingMore: boolean,
  fetchMoreNews: () => void,
  navigateToNews: (navigationOptions: NavigateToNewsParamsType) => void,
  createNavigateToNews: (NavigateToNewsParamsType) => void
|}

/**
 * Displays a list of news or a single news item, matching the route <id>)
 */
class NewsList extends React.PureComponent<PropsType> {
  navigateToNews = (cityCode: string, language: string, newsId: string) => () => {
    const { selectedNewsType } = this.props
    this.props.navigateToNews({
      cityCode,
      language,
      newsId,
      type: selectedNewsType
    })
  };

  openTunewsLink = async () => {
    const supported = await Linking.canOpenURL(tunewsWebsiteUrl)
    if (supported) {
      await Linking.openURL(tunewsWebsiteUrl)
    }
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
        navigateToNews={this.navigateToNews(cityCode, language, newsItem.id.toString())}
      />
    )
  };

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
      const selectedNewsItem: LocalNewsModel | TunewsModel | typeof undefined = news.find(
        _newsItem => _newsItem.id.toString() === newsId
      )

      if (selectedNewsItem) {
        const isInstanceOfTunews = selectedNewsItem instanceof TunewsModel
        let content, eNewsNo
        if (selectedNewsItem.content) { content = selectedNewsItem.content }
        if (selectedNewsItem.message) { content = selectedNewsItem.message }
        if (selectedNewsItem.eNewsNo) { eNewsNo = selectedNewsItem.eNewsNo }

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
                <NewsHeadLine theme={theme}>
                  {selectedNewsItem.title}
                </NewsHeadLine>
                <NewsDetailsContent theme={theme} language={language}>
                  {content}
                </NewsDetailsContent>
              </Container>
                {isTunews && (
              <Row theme={theme} language={language}>
                {eNewsNo && typeof eNewsNo === 'string' && <TunewsFooter theme={theme} rightMargin={3}>
                  {`${t('eNewsNo')}: ${eNewsNo}`}
                </TunewsFooter>}
                <TunewsFooter
                  rightMargin={3}
                  onPress={this.openTunewsLink}
                  theme={theme}
                  underlined>
                  tünews INTERNATIONAL
                </TunewsFooter>
                {isInstanceOfTunews && <MomentContext.Consumer>
                    {formatter => (
                      <TunewsFooter theme={theme} rightMargin={3}>
                        {/* $FlowFixMe this keeps failing no matter the fix is */}
                        {formatter(selectedNewsItem.date, { format: 'LL', locale: language })}
                      </TunewsFooter>
                    )}
                  </MomentContext.Consumer>}
              </Row>
                )}
            </ScrollView>
          </View>
        )
      }

      const error = new ContentNotFoundError({
        type: 'news',
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

    return (
      <SpaceBetween>
        <View style={{ flex: 1 }}>
          <List
            renderNoItemsComponent={this.renderNoItemsComponent}
            items={news}
            isFetchingMore={isFetchingMore}
            fetchMoreItems={fetchMoreNews}
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
