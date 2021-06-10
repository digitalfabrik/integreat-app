import React, { ReactElement } from 'react'
import styled from 'styled-components'
import { Moment } from 'moment'
import CleanLink from './CleanLink'
import LastUpdateInfo from './LastUpdateInfo'
import { Description } from './ListItem'
import { TFunction } from 'react-i18next'
import textTruncator from '../services/textTruncator'
import { DateFormatter, LOCAL_NEWS_TYPE, NewsType } from 'api-client'
import { Parser } from 'htmlparser2'

export const NUM_OF_WORDS_ALLOWED = 30

const Link = styled(CleanLink)`
  display: flex;
  background-color: ${({ theme }) => theme.colors.backgroundColor};
`
const ReadMoreLink = styled(Link)<{ $type: NewsType }>`
  align-self: flex-end;
  color: ${({ theme, $type }) => ($type === LOCAL_NEWS_TYPE ? theme.colors.themeColor : theme.colors.tunewsThemeColor)};
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
`

const StyledNewsListItem = styled.div`
  padding-bottom: 2px;
  background: linear-gradient(to left, rgba(168, 168, 168, 0.2), #bebebe 51%, rgba(168, 168, 168, 0.2));
`

const StyledContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`

type PropsType = {
  title: string,
  content: string,
  timestamp: Moment,
  formatter: DateFormatter,
  link: string,
  type: NewsType,
  t: TFunction<'news'>
}

const NewsListItem = ({ title, content, timestamp, formatter, t, type, link }: PropsType): ReactElement => {
  // Decode html entities
  let decodedContent = ''
  const parser = new Parser(
    {
      ontext(data: string) {
        decodedContent += data
      }
    },
    { decodeEntities: true }
  )
  parser.write(content)
  parser.end()

  const readMoreLinkText = `${t('readMore')} >`

  return (
    <StyledNewsListItem>
      <Link to={link}>
        <Description>
          <Title>{title}</Title>
          <Body>{textTruncator(decodedContent, NUM_OF_WORDS_ALLOWED)}</Body>
          <StyledContainer>
            <LastUpdateInfo lastUpdate={timestamp} formatter={formatter} withText={false} />
            <ReadMoreLink to={link} $type={type}>
              {readMoreLinkText}
            </ReadMoreLink>
          </StyledContainer>
        </Description>
      </Link>
    </StyledNewsListItem>
  )
}

export default NewsListItem
