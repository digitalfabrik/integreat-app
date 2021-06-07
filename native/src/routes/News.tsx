import React, { useCallback } from 'react'
import { View } from 'react-native'
import { withTranslation, TFunction } from 'react-i18next'
import {
  CityModel,
  LOCAL_NEWS_TYPE,
  LocalNewsModel,
  NotFoundError,
  TunewsModel,
  NEWS_ROUTE,
  TU_NEWS_TYPE,
  NewsType,
  RouteInformationType
} from 'api-client'
import NewsList from '../components/NewsList'
import { ThemeType } from 'build-configs'
import { NewsModelsType } from '../redux/StateType'
import withTheme from '../hocs/withTheme'
import { fromError } from '../constants/ErrorCodes'
import NewsListItem from '../components/NewsListItem'
import styled from 'styled-components/native'
import NewsDetail from '../components/NewsDetail'
import FailureContainer from '../components/FailureContainer'

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
  theme: ThemeType
  t: TFunction
  selectedNewsType: NewsType
  isFetchingMore: boolean
  fetchMoreNews: () => void
  navigateTo: (arg0: RouteInformationType) => void
  navigateToLink: (url: string, language: string, shareUrl: string) => void
  routeKey: string
}

const News = (props: PropsType) => {
  const { news, newsId, language, fetchMoreNews, isFetchingMore, selectedNewsType, theme, t, routeKey } = props
  const { navigateTo, navigateToLink, cityModel } = props

  const renderNoItemsComponent = (): React.ReactElement => {
    return <NoNews theme={theme}>{t('currentlyNoNews')}</NoNews>
  }

  const rendersNewsListItem = useCallback(
    (cityCode: string, language: string) => ({ item }: { item: LocalNewsModel | TunewsModel }) => {
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
          key={item.id}
          newsItem={item}
          language={language}
          theme={theme}
          isTunews={selectedNewsType === TU_NEWS_TYPE}
          navigateToNews={navigateToNews}
          t={t}
        />
      )
    },
    [selectedNewsType, theme, t, navigateTo]
  )

  if (selectedNewsType === LOCAL_NEWS_TYPE ? !cityModel.pushNotificationsEnabled : !cityModel.tunewsEnabled) {
    const error = new NotFoundError({
      type: 'category',
      id: selectedNewsType,
      city: cityModel.code,
      language
    })
    return <FailureContainer code={fromError(error)} />
  }

  if (newsId) {
    const selectedNewsItem = news.find(_newsItem => _newsItem.id.toString() === newsId)

    if (selectedNewsItem) {
      return (
        <NewsDetail newsItem={selectedNewsItem} theme={theme} language={language} navigateToLink={navigateToLink} />
      )
    } else {
      const error = new NotFoundError({
        type: selectedNewsType,
        id: newsId,
        city: cityModel.code,
        language
      })
      return <FailureContainer code={fromError(error)} />
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

const TranslatedWithThemeNewsList = withTranslation('news')(withTheme<PropsType>(News))
export default TranslatedWithThemeNewsList
