import { TFunction } from 'i18next'
import { DateTime } from 'luxon'
import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { getExcerpt, LOCAL_NEWS_TYPE, NewsType } from 'api-client'

import { EXCERPT_MAX_CHARS } from '../constants'
import CleanLink from './CleanLink'
import LastUpdateInfo from './LastUpdateInfo'
import { Description } from './ListItem'

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
  margin-block-end: 0;
  font-family: ${props => props.theme.fonts.web.decorativeFont};
  font-size: ${props => props.theme.fonts.subTitleFontSize};
  font-weight: 700;
`
const Body = styled.p`
  font-size: 16px;
  line-height: 1.38;
  white-space: pre-line;
`

const StyledNewsListItem = styled.article`
  padding-block-end: 2px;
  border-block-end: 1px solid ${({ theme }) => theme.colors.textSecondaryColor};
`

const StyledContainer = styled.div`
  display: flex;
  inline-size: 100%;
  justify-content: space-between;
`

type NewsListItemProps = {
  title: string
  content: string
  timestamp: DateTime
  link: string
  type: NewsType
  t: TFunction<'news'>
}

const NewsListItem = ({ title, content, timestamp, t, type, link }: NewsListItemProps): ReactElement => {
  const readMoreLinkText = `${t('readMore')} >`
  const excerpt = getExcerpt(content, { maxChars: EXCERPT_MAX_CHARS, replaceLineBreaks: false })

  return (
    <StyledNewsListItem>
      <Link to={link}>
        <Description>
          <Title dir='auto'>{title}</Title>
          <Body dir='auto'>{excerpt}</Body>
          <StyledContainer>
            <LastUpdateInfo lastUpdate={timestamp} withText={false} />
            <ReadMore $type={type}>{readMoreLinkText}</ReadMore>
          </StyledContainer>
        </Description>
      </Link>
    </StyledNewsListItem>
  )
}

export default NewsListItem
