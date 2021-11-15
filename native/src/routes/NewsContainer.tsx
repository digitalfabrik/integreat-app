import React, { ReactElement, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { LOCAL_NEWS_TYPE, NEWS_ROUTE, NewsRouteType, NewsType } from 'api-client'

import LayoutContainer from '../components/LayoutContainer'
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

const NewsContainer = ({ route: { key }, navigation }: NavigationPropsType): ReactElement => {
  const [selectedNewsType, setSelectedNewsType] = useState<NewsType | null>(null)
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null)
  const route = useStateRoute(key, NEWS_ROUTE)
  const cities = useCities()
  const dispatch = useDispatch()

  const cityModel = route && cities?.find(model => model.code === route.city)
  useEffect(
    () =>
      navigation.addListener('beforeRemove', e => {
        if (selectedNewsId) {
          e.preventDefault()
          setSelectedNewsId(null)
        }
      }),
    [navigation, selectedNewsId]
  )

  if (!cityModel || !route) {
    return <LayoutContainer />
  }

  const { language: routeLanguage, type: routeNewsType, newsId: routeNewsId } = route

  const language = selectedLanguage ?? routeLanguage
  const newsId = selectedNewsId ?? routeNewsId
  const newsType = selectedNewsType ?? routeNewsType
  const isLocalNews = newsType === LOCAL_NEWS_TYPE

  const navigateToNews = (newsType: NewsType) => {
    setSelectedNewsId(null)
    setSelectedNewsType(newsType)
  }

  const changeUnavailableLanguage = (newLanguage: string) => {
    setSelectedLanguage(newLanguage)
    dispatch({
      type: 'SWITCH_CONTENT_LANGUAGE',
      params: {
        newLanguage,
        city: cityModel.code
      }
    })
  }

  return (
    <LayoutContainer>
      <NewsHeader selectedNewsType={newsType} cityModel={cityModel} navigateToNews={navigateToNews} />
      {isLocalNews ? (
        <LocalNews newsId={newsId} selectNews={setSelectedNewsId} cityModel={cityModel} language={language} />
      ) : (
        <TuNews
          newsId={newsId}
          selectNews={setSelectedNewsId}
          cityModel={cityModel}
          language={language}
          changeUnavailableLanguage={changeUnavailableLanguage}
        />
      )}
    </LayoutContainer>
  )
}

export default NewsContainer
