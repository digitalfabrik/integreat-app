import { Moment } from 'moment'
import React, { ReactElement } from 'react'
import { TFunction } from 'react-i18next'
import styled from 'styled-components'

import { DateFormatter, LOCAL_NEWS_TYPE, NewsType } from 'api-client'

import { textTruncator } from '../utils/stringUtils'
import CleanLink from './CleanLink'
import LastUpdateInfo from './LastUpdateInfo'
import { Description } from './ListItem'
import RemoteContent from './RemoteContent'

export const NUM_OF_CHARS_ALLOWED = 220

const Link = styled(CleanLink)`
  display: flex;
  background-color: ${({ theme }) => theme.colors.backgroundColor};
`
const ReadMore = styled.div<{ $type: NewsType }>`
  align-self: flex-end;
  color: ${({ theme, $type }) => ($type === LOCAL_NEWS_TYPE ? theme.colors.themeColor : theme.colors.tunewsThemeColor)};
  font-weight: 600;
`

const Title = styled.h3`
  margin-bottom: 0;
  font-family: Raleway;
  font-size: 18px;
  font-weight: 700;
`
const StyledNewsListItem = styled.div`
  padding-bottom: 2px;
`

const StyledContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`

type PropsType = {
  title: string
  content: string
  timestamp: Moment
  formatter: DateFormatter
  link: string
  type: NewsType
  t: TFunction<'news'>
}

const NewsListItem = ({ title, content, timestamp, formatter, t, type, link }: PropsType): ReactElement => {
  const readMoreLinkText = `${t('readMore')} >`

  return (
    <StyledNewsListItem>
      <Link to={link}>
        <Description>
          <Title>{title}</Title>
          <RemoteContent
            html={textTruncator(content, NUM_OF_CHARS_ALLOWED, true)}
            // we don't need onInternalLinkClick here
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            onInternalLinkClick={(_s: string) => {}}
          />
          <StyledContainer>
            <LastUpdateInfo lastUpdate={timestamp} formatter={formatter} withText={false} />
            <ReadMore $type={type}>{readMoreLinkText}</ReadMore>
          </StyledContainer>
        </Description>
      </Link>
    </StyledNewsListItem>
  )
}

export default NewsListItem
