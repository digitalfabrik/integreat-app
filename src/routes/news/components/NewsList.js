// @flow

import * as React from 'react'
import {
  View,
  ActivityIndicator
} from 'react-native'
import type { TFunction } from 'react-i18next'
import {
  CityModel,
  NewsModel
} from '@integreat-app/integreat-api-client'
import ContentNotFoundError from '../../../modules/error/ContentNotFoundError'
import List from './List'
import Failure from '../../../modules/error/components/Failure'
import type { ThemeType } from '../../../modules/theme/constants/theme'
import type { LanguageResourceCacheStateType } from '../../../modules/app/StateType'
import { NavigationScreenProp } from 'react-navigation'
import type { NavigateToNewsParamsType } from '../../../modules/app/createNavigateToNews'
import SpaceBetween from '../../../modules/common/components/SpaceBetween'
import ErrorCodes from '../../../modules/error/ErrorCodes'
import NewsListItem, { Title, Content } from './NewsListItem'
import headerImage from '../assets/header.png'
import thumbnailImage from '../assets/thumbnail.jpg'
import styled from 'styled-components/native'
import ListItem from '../../../modules/common/components/ListItem'
import { INTERNATIONAL } from '../containers/NewsContainer'

const Container = styled.View`
  align-items: center;
  margin-horizontal: 26px;
`
const HeaderImage = styled.Image`
  width: 95%;
  height: 50px;
  margin-horizontal: 10px;
  align-self: center;
`
const Thumbnail = styled.Image`
  width: 100%;
  height: 150px;
  margin-bottom: 15px;
  margin-top: 10px;
`
const Row = styled.View`
  flex-direction: row;
  border-radius: 5px;
  background-color: ${props => props.theme.colors.tuNewsColor};
`

const ExtraInfo = styled.Text`
  font-family: ${props => props.theme.fonts.decorativeFontBold};
  font-size: 11px;
  color: white;
  padding: 5px;
`

const Description = styled.Text`
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.contentFontRegular};
`

const NoNews = styled.Text`
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.contentFontRegular};
  align-self: center;
  margin-top: 20px;
`

export type PropsType = {|
  path: ?string,
  newsList: Array<NewsModel | any>,
  cities: Array<CityModel>,
  cityCode: string,
  language: string,
  resourceCache: LanguageResourceCacheStateType,
  theme: ThemeType,
  t: TFunction,
  navigation: NavigationScreenProp<*>,
  createNavigateToNews: (NavigateToNewsParamsType) => void
|}

/**
 * Displays a list of events or a single event, matching the route /<location>/<language>/events(/<id>)
 */
class NewsList extends React.Component<PropsType> {
  navigateToNews = (cityCode: string, language: string, path: string) => () => {
    const { selectedNewsType } = this.props
    this.props.navigateToNews({
      cityCode,
      language,
      path,
      type: selectedNewsType
    })
  };

  renderNotItemsComponent = () => {
    const { t, theme } = this.props
    return <NoNews theme={theme}>{t('currentlyNoNews')}</NoNews>
  };

  rendersNewsListItem = (cityCode: string, language: string) => ({
    item: newsItem
  }) => {
    const { theme, selectedNewsType } = this.props

    return selectedNewsType === INTERNATIONAL ? (
      <NewsListItem
        key={newsItem.id || newsItem.timestap}
        newsItem={newsItem}
        language={language}
        theme={theme}
        navigateToNews={this.navigateToNews(
          cityCode,
          language,
          `${newsItem.id}`
        )}
      />
    ) : (
      <ListItem
        title={newsItem.title}
        language={language}
        navigateTo={this.navigateToNews(cityCode, language, `${newsItem.id}`)}
        theme={theme}>
        <Description theme={theme}>{newsItem.message}</Description>
      </ListItem>
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
      contentLanguage,
      status,
      fetchMoreNews,
      selectedNewsType,
      fetchNews
    } = this.props

    if (path) {
      const selectedNewsItem = newsList && newsList[0]
      const isTuNews = selectedNewsType === INTERNATIONAL

      if (selectedNewsItem) {
        const content = selectedNewsItem.content || ''
        const contentExtraInfo = content.substring(content.indexOf('tünews'))
        const splittedContent = content.split(contentExtraInfo)[0]

        return (
          <>
            {isTuNews && <HeaderImage resizeMode='cover' source={headerImage} />}
            <Container>
              <Title theme={theme}>{selectedNewsItem.title}</Title>
              <Thumbnail resizeMode='cover' source={thumbnailImage} />
              <Content theme={theme}>
                {splittedContent || selectedNewsItem.message}
              </Content>
              <Row theme={theme}>
                {contentExtraInfo ? (
                  <ExtraInfo theme={theme}>{contentExtraInfo}</ExtraInfo>
                ) : null}
              </Row>
            </Container>
          </>
        )
      }
      if (status === 'loading') {
        return <ActivityIndicator style={{ marginTop: 20 }} />
      }

      const error = new ContentNotFoundError({
        type: 'newsItem',
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
            setRef={this.props.setFlatListRef}
            renderNotItemsComponent={this.renderNotItemsComponent}
            items={newsList}
            isFetchingMore={status === 'loadingMore'}
            isFetching={status === 'loading'}
            getMoreItems={fetchMoreNews}
            fetchItems={fetchNews}
            renderItem={this.rendersNewsListItem(cityCode, contentLanguage)}
            theme={theme}
            status={status}
          />
        </View>
      </SpaceBetween>
    )
  }
}

export default NewsList
