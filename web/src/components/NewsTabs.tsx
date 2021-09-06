import React, { ReactNode, ReactElement } from 'react'
import styled from 'styled-components'
import { TFunction } from 'react-i18next'
import NewsTab from './NewsTab'
import { LOCAL_NEWS_TYPE, NewsType, TU_NEWS_TYPE } from 'api-client'
import { createPath, LOCAL_NEWS_ROUTE, TU_NEWS_ROUTE } from '../routes'
import Caption from './Caption'

const StyledTabs = styled.div`
  display: flex;
  padding-bottom: 40px;
  justify-content: center;
`

type PropsType = {
  type: NewsType
  children: ReactNode
  city: string
  localNewsEnabled: boolean
  tunewsEnabled: boolean
  language: string
  t: TFunction<'news'>
}

const NewsTabs = ({ children, language, city, localNewsEnabled, tunewsEnabled, t, type }: PropsType): ReactElement => {
  const localNewsPath = createPath(LOCAL_NEWS_ROUTE, { cityCode: city, languageCode: language })
  const tunewsPath = createPath(TU_NEWS_ROUTE, { cityCode: city, languageCode: language })

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
