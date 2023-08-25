import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import { NEWS_ROUTE, NewsRouteType, TU_NEWS_TYPE } from 'api-client'

import { TuNewsActiveIcon } from '../assets'
import Page from '../components/Page'
import Icon from '../components/base/Icon'
import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import useHeader from '../hooks/useHeader'
import { CityContentData } from '../hooks/useLoadCityContent'
import useLoadTuNewsElement from '../hooks/useLoadTuNewsElement'
import urlFromRouteInformation from '../navigation/url'
import LoadingErrorHandler from './LoadingErrorHandler'

const HeaderImageWrapper = styled.View`
  margin: 20px 16px 0;
  border-radius: 8px;
  background-color: rgba(2, 121, 166, 0.4);
`
const StyledIcon = styled(Icon)`
  height: 34px;
  width: 100px;
`

type TuNewsProps = {
  route: RouteProps<NewsRouteType>
  navigation: NavigationProps<NewsRouteType>
  newsId: string
  data: CityContentData
}

const TuNewsDetail = ({ route, navigation, data, newsId }: TuNewsProps): ReactElement => {
  const cityCode = data.city.code
  const languageCode = data.language.code
  const { data: tuNews, ...response } = useLoadTuNewsElement({ newsId })

  const shareUrl = urlFromRouteInformation({
    route: NEWS_ROUTE,
    cityCode,
    languageCode,
    newsType: TU_NEWS_TYPE,
    newsId,
  })
  useHeader({ navigation, route, availableLanguages: [languageCode], data, shareUrl })

  return (
    <LoadingErrorHandler {...response} scrollView>
      {tuNews && (
        <>
          <HeaderImageWrapper>
            <StyledIcon Icon={TuNewsActiveIcon} />
          </HeaderImageWrapper>
          <Page title={tuNews.title} content={tuNews.content} language={languageCode} />
        </>
      )}
    </LoadingErrorHandler>
  )
}

export default TuNewsDetail
