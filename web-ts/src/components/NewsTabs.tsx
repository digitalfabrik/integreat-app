import React, { ReactNode, ReactElement} from 'react'
import styled from 'styled-components'
import { TFunction } from 'react-i18next'
import NewsTab from './NewsTab'
import { LOCAL_NEWS_TYPE, NewsType, TU_NEWS_TYPE } from 'api-client'

const StyledTabs = styled.div`
  display: flex;
  padding-top: 45px;
  padding-bottom: 40px;
`

type PropsType = {
  type: NewsType,
  children: ReactNode,
  city: string,
  localNewsEnabled: boolean,
  tunewsEnabled: boolean,
  language: string,
  t: TFunction
}

const NewsTabs = ({ children, language, city, localNewsEnabled, tunewsEnabled, t, type }: PropsType): ReactElement => {
  // TODO
  const localNewsPath = '/'
  const tunewsPath = '/'

  return (
    <>
      <StyledTabs>
        {localNewsEnabled && <NewsTab active={type === LOCAL_NEWS_TYPE} type={LOCAL_NEWS_TYPE} destination={localNewsPath} t={t} />}
        {tunewsEnabled && <NewsTab active={type === TU_NEWS_TYPE} type={TU_NEWS_TYPE} destination={tunewsPath} t={t} />}
      </StyledTabs>
      {children}
    </>
  )
}

export default NewsTabs
