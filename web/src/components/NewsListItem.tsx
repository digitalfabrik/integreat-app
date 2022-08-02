import { Moment } from 'moment'
import React, { ReactElement } from 'react'
import { TFunction } from 'react-i18next'
import styled from 'styled-components'

import { DateFormatter, LOCAL_NEWS_TYPE, NewsType } from 'api-client'

import { textTruncator } from '../utils/stringUtils'
import CleanLink from './CleanLink'
import LastUpdateInfo from './LastUpdateInfo'
import { Description } from './ListItem'

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
const Body = styled.p`
  font-size: 16px;
  line-height: 1.38;
  white-space: pre-line;
`

const StyledNewsListItem = styled.article`
  padding-bottom: 2px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.textSecondaryColor};
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
          <Title dir='auto'>{title}</Title>
          <Body dir='auto'>{textTruncator(content.trim(), NUM_OF_CHARS_ALLOWED, false)}</Body>
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
