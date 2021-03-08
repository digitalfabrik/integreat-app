// @flow

import * as React from 'react'
import styled, { type StyledComponent } from 'styled-components'
import type Moment from 'moment'
import CleanLink from '../../../modules/common/components/CleanLink'
import LastUpdateInfo from '../../../modules/common/components/LastUpdateInfo'
import { Description } from '../../../modules/common/components/ListItem'
import { type TFunction } from 'react-i18next'
import textTruncator from '../../../modules/common/utils/textTruncator'
import { LOCAL_NEWS } from '../constants'
import type { NewsType } from '../constants'
import DateFormatter from 'api-client/src/i18n/DateFormatter'
import type { ThemeType } from 'build-configs/ThemeType'
import { Parser } from 'htmlparser2'

export const NUM_OF_WORDS_ALLOWED = 30

const Link: StyledComponent<{||}, ThemeType, *> = styled(CleanLink)`
  display: flex;
  background-color: ${({ theme }) => (theme.colors.backgroundColor)};
`
const ReadMoreLink: StyledComponent<{||}, ThemeType, *> = styled(({ type, ...props }) => <Link {...props} />)`
  align-self: flex-end;
  color: ${({ theme, type }) => type === LOCAL_NEWS ? theme.colors.themeColor : theme.colors.tunewsThemeColor};
  color: ${({ theme, type }) => type === LOCAL_NEWS ? theme.colors.themeColor : theme.colors.tunewsThemeColor};
  font-weight: 600;
`

const Title: StyledComponent<{||}, ThemeType, *> = styled.h3`
  margin-bottom: 0;
  font-family: Raleway;
  font-size: 18px;
  font-weight: 700;
`
const Body: StyledComponent<{||}, ThemeType, *> = styled.p`
  font-size: 16px;
  line-height: 1.38;
`

const StyledNewsListItem: StyledComponent<{||}, ThemeType, *> = styled.div`
  padding-bottom: 2px;
  background: linear-gradient(to left, rgba(168, 168, 168, 0.2), #bebebe 51%, rgba(168, 168, 168, 0.2));
`

const StyledContainer: StyledComponent<{||}, ThemeType, *> = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`

type PropsType = {|
  title: string,
  content: string,
  timestamp: Moment,
  formatter: DateFormatter,
  link: string,
  type: NewsType,
  t: TFunction
|}

const NewsListItem = ({ title, content, timestamp, formatter, t, type, link }: PropsType) => {
  // Decode html entities
  let decodedContent = ''
  const parser = new Parser({ ontext (data: string) { decodedContent += data } }, { decodeEntities: true })
  parser.write(content)
  parser.end()

  return (
    <StyledNewsListItem>
      <Link to={link}>
        <Description>
          <Title>{title}</Title>
          <Body>{textTruncator(decodedContent, NUM_OF_WORDS_ALLOWED)}</Body>
          <StyledContainer>
            <LastUpdateInfo lastUpdate={timestamp} formatter={formatter} withText={false} />
            <ReadMoreLink to={link} type={type}>{t('readMore')} ></ReadMoreLink>
          </StyledContainer>
        </Description>
      </Link>
    </StyledNewsListItem>
  )
}

export default NewsListItem
