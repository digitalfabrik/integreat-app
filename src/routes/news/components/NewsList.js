// @flow

import * as React from 'react'
import {
  View,
  TouchableWithoutFeedback,
  ActivityIndicator
} from 'react-native'
import type { TFunction } from 'react-i18next'
import {
  CityModel,
  NewsModel,
  PAGE_FEEDBACK_TYPE,
  TECHNICAL_FEEDBACK_CATEGORY
} from '@integreat-app/integreat-api-client'
import Page from '../../../modules/common/components/Page'
import ContentNotFoundError from '../../../modules/error/ContentNotFoundError'
import PageDetail from '../../../modules/common/components/PageDetail'
import List from './List'
import Caption from '../../../modules/common/components/Caption'
import Failure from '../../../modules/error/components/Failure'
import type { ThemeType } from '../../../modules/theme/constants/theme'
import type { LanguageResourceCacheStateType } from '../../../modules/app/StateType'
import { NavigationScreenProp, Header } from 'react-navigation'
import type { NavigateToEventParamsType } from '../../../modules/app/createNavigateToEvent'
import type { NavigateToIntegreatUrlParamsType } from '../../../modules/app/createNavigateToIntegreatUrl'
import FeedbackVariant from '../../feedback/FeedbackVariant'
import SiteHelpfulBox from '../../../modules/common/components/SiteHelpfulBox'
import SpaceBetween from '../../../modules/common/components/SpaceBetween'
import type {
  FeedbackCategoryType,
  FeedbackType
} from '@integreat-app/integreat-api-client/endpoints/createFeedbackEndpoint'
import ErrorCodes from '../../../modules/error/ErrorCodes'
import NewsListItem, { Title, Content } from './NewsListItem'
import createNavigateToNews from '../../../modules/app/createNavigateToNews'
import headerImage from '../assets/header.png'
import thumbnailImage from '../assets/thumbnail.jpg'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import moment from 'moment'
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
  createNavigateToNews: (NavigateToEventParamsType) => void,
  navigateToIntegreatUrl: (NavigateToIntegreatUrlParamsType) => void
|}

/**
 * Displays a list of events or a single event, matching the route /<location>/<language>/events(/<id>)
 */
class NewsList extends React.Component<PropsType> {
  listRef = null;

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
    return <Content theme={theme}>{t('currentlyNoNews')}</Content>
  };

  setListRef = ref => {
    this.listRef = ref
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

  async componentDidMount () {
    this.listRef &&
      this.listRef.scrollToOffset({ animated: true, offest: { x: 0, y: 0 } })
  }

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
      fetchNews
    } = this.props
    if (path) {
      const selectedNewsItem = newsList && newsList[0]
      if (selectedNewsItem) {
        const content = selectedNewsItem.content || ''
        const contentExtraInfo = content.substring(content.indexOf('tünews'))
        const splittedContent = content.split(contentExtraInfo)[0]

        return (
          <>
            <HeaderImage resizeMode='cover' source={headerImage} />
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
            setRef={this.setListRef}
            renderNotItemsComponent={this.renderNotItemsComponent} // TODO: needs to add to locale
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
