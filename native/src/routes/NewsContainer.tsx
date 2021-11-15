import React, { ReactElement, useState } from 'react'
import { View } from 'react-native'

import { LOCAL_NEWS_TYPE, NEWS_ROUTE, NewsRouteType, NewsType } from 'api-client'

import NewsHeader from '../components/NewsHeader'
import { NavigationPropType, RoutePropType } from '../constants/NavigationTypes'
import useCities from '../hooks/useCities'
import useStateRoute from '../hooks/useStateRoute'
import LocalNews from './LocalNews'
import TuNews from './TuNews'

type NavigationPropsType = {
  route: RoutePropType<NewsRouteType>
  navigation: NavigationPropType<NewsRouteType>
}

const NewsContainer = ({ route: { key } }: NavigationPropsType): ReactElement => {
  const [selectedNewsType, setSelectedNewsType] = useState<NewsType | null>(null)
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null)
  const route = useStateRoute(key, NEWS_ROUTE)
  const cities = useCities()

  const cityModel = route && cities?.find(model => model.code === route.city)

  // TODO language change/unavailable languages

  // TODO handle back navigation

  if (!cityModel || !route) {
    return <></>
  }

  const { language, type: routeNewsType, newsId: routeNewsId } = route

  const newsId = selectedNewsId ?? routeNewsId
  const newsType = selectedNewsType ?? routeNewsType
  const isLocalNews = newsType === LOCAL_NEWS_TYPE

  const navigateToNews = (newsType: NewsType) => {
    setSelectedNewsId(null)
    setSelectedNewsType(newsType)
  }

  return (
    <View
      style={{
        flex: 1
      }}>
      <NewsHeader selectedNewsType={newsType} cityModel={cityModel} navigateToNews={navigateToNews} />
      {isLocalNews ? (
        <LocalNews
          newsId={newsId}
          selectNews={setSelectedNewsId}
          cityModel={cityModel}
          language={language}
        />
      ) : (
        <TuNews
          newsId={newsId}
          selectNews={setSelectedNewsId}
          cityModel={cityModel}
          language={language}
        />
      )}
    </View>
  )
}

export default NewsContainer
