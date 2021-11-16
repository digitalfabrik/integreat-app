import React, { ReactElement, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { LOCAL_NEWS_TYPE, NewsRouteType, NewsType } from 'api-client'

import LayoutContainer from '../components/LayoutContainer'
import NewsHeader from '../components/NewsHeader'
import { NavigationPropType, RoutePropType } from '../constants/NavigationTypes'
import useCities from '../hooks/useCities'
import LocalNews from './LocalNews'
import TuNews from './TuNews'

type NavigationPropsType = {
  route: RoutePropType<NewsRouteType>
  navigation: NavigationPropType<NewsRouteType>
}

const NewsContainer = ({ route: { params }, navigation }: NavigationPropsType): ReactElement => {
  const { cityCode, languageCode, newsType, newsId } = params
  const [selectedNewsType, setSelectedNewsType] = useState<NewsType>(newsType)
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(newsId)
  const [selectedLanguage, setSelectedLanguage] = useState<string>(languageCode)
  const cities = useCities()
  const dispatch = useDispatch()
  const isLocalNews = newsType === LOCAL_NEWS_TYPE

  const cityModel = cities?.find(model => model.code === cityCode)

  useEffect(
    // Handle back navigation: If we are at a news detail screen navigate back to overview instead of closing the route
    () =>
      navigation.addListener('beforeRemove', e => {
        if (selectedNewsId) {
          e.preventDefault()
          setSelectedNewsId(null)
        }
      }),
    [navigation, selectedNewsId]
  )

  if (!cityModel) {
    return <LayoutContainer />
  }

  const navigateToNews = (newsType: NewsType) => {
    setSelectedNewsId(null)
    setSelectedNewsType(newsType)
  }

  const changeUnavailableLanguage = (newLanguage: string) => {
    // We don't support language change between single news as we don't now whether they are translated and with what id
    setSelectedNewsId(null)
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
      <NewsHeader selectedNewsType={selectedNewsType} cityModel={cityModel} navigateToNews={navigateToNews} />
      {isLocalNews ? (
        <LocalNews newsId={newsId} selectNews={setSelectedNewsId} cityModel={cityModel} language={selectedLanguage} />
      ) : (
        <TuNews
          newsId={selectedNewsId}
          selectNews={setSelectedNewsId}
          cityModel={cityModel}
          language={selectedLanguage}
          changeUnavailableLanguage={changeUnavailableLanguage}
        />
      )}
    </LayoutContainer>
  )
}

export default NewsContainer
