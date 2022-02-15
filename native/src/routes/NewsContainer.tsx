import React, { ReactElement, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { LOCAL_NEWS_TYPE, NEWS_ROUTE, NewsRouteType, NewsType } from 'api-client'

import Layout from '../components/Layout'
import NewsHeader from '../components/NewsHeader'
import { NavigationPropType, RoutePropType } from '../constants/NavigationTypes'
import useCities from '../hooks/useCities'
import useSetShareUrl from '../hooks/useSetShareUrl'
import LocalNews from './LocalNews'
import TuNews from './TuNews'

type NavigationPropsType = {
  route: RoutePropType<NewsRouteType>
  navigation: NavigationPropType<NewsRouteType>
}

const NewsContainer = ({ route, navigation }: NavigationPropsType): ReactElement => {
  const { cityCode, languageCode, newsType: routeNewsType, newsId: routeNewsId } = route.params
  const [newsType, setNewsType] = useState<NewsType>(routeNewsType)
  const [newsId, setNewsId] = useState<string | null>(routeNewsId)
  const [selectedLanguage, setSelectedLanguage] = useState<string>(languageCode)
  const cities = useCities()
  const dispatch = useDispatch()
  const isLocalNews = newsType === LOCAL_NEWS_TYPE

  const cityModel = cities?.find(model => model.code === cityCode)

  const routeInformation = {
    route: NEWS_ROUTE,
    cityCode,
    languageCode: selectedLanguage,
    newsType,
    newsId: newsId ?? undefined
  }
  useSetShareUrl({ navigation, routeInformation, route })

  useEffect(
    // Handle back navigation: If we are at a news detail screen navigate back to overview instead of closing the route
    () =>
      navigation.addListener('beforeRemove', e => {
        if (newsId) {
          e.preventDefault()
          setNewsId(null)
        }
      }),
    [navigation, newsId]
  )

  if (!cityModel) {
    return <Layout />
  }

  const navigateToNews = (newsType: NewsType) => {
    setNewsId(null)
    setNewsType(newsType)
  }

  const changeUnavailableLanguage = (newLanguage: string) => {
    // We don't support language change between single news as we don't now whether they are translated and with what id
    setNewsId(null)
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
    <Layout>
      <NewsHeader selectedNewsType={newsType} cityModel={cityModel} navigateToNews={navigateToNews} />
      {isLocalNews ? (
        <LocalNews newsId={newsId} selectNews={setNewsId} cityModel={cityModel} language={selectedLanguage} />
      ) : (
        <TuNews
          newsId={newsId}
          selectNews={setNewsId}
          cityModel={cityModel}
          language={selectedLanguage}
          changeUnavailableLanguage={changeUnavailableLanguage}
        />
      )}
    </Layout>
  )
}

export default NewsContainer
