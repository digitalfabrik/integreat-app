import React, { ReactNode, ReactElement } from 'react'
import { TFunction } from 'react-i18next'
import styled from 'styled-components'

import { LOCAL_NEWS_TYPE, NEWS_ROUTE, NewsType, pathnameFromRouteInformation, TU_NEWS_TYPE } from 'api-client'

import Caption from './Caption'
import NewsTab from './NewsTab'

const StyledTabs = styled.div`
  display: flex;
  padding-bottom: 40px;
  justify-content: center;
`

type NewsTabsPropsType = {
  type: NewsType
  children: ReactNode
  city: string
  localNewsEnabled: boolean
  tunewsEnabled: boolean
  language: string
  t: TFunction<'news'>
}

const NewsTabs = ({ children, language, city, localNewsEnabled, tunewsEnabled, t, type }: NewsTabsPropsType): ReactElement => {
  const params = { route: NEWS_ROUTE, cityCode: city, languageCode: language }
  const localNewsPath = pathnameFromRouteInformation({ ...params, newsType: LOCAL_NEWS_TYPE })
  const tunewsPath = pathnameFromRouteInformation({ ...params, newsType: TU_NEWS_TYPE })

  return (
    <>
      <Caption title={t('news')} />
      {localNewsEnabled && tunewsEnabled && (
        <StyledTabs>
          <NewsTab active={type === LOCAL_NEWS_TYPE} type={LOCAL_NEWS_TYPE} destination={localNewsPath} t={t} />
          <NewsTab active={type === TU_NEWS_TYPE} type={TU_NEWS_TYPE} destination={tunewsPath} t={t} />
        </StyledTabs>
      )}
      {children}
    </>
  )
}

export default NewsTabs
