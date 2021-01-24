// @flow

import * as React from 'react'
import styled from 'styled-components'
import type Moment from 'moment'
import CleanLink from '../../../modules/common/components/CleanLink'
import LastUpdateInfo from './../../../modules/common/components/LastUpdateInfo'
import { Description } from '../../../modules/common/components/ListItem'
import type { TFunction } from 'react-i18next'
import textTruncator from './../../../modules/common/utils/textTruncator'
import { LOCAL_NEWS } from '../constants'
import type { NewsType } from '../constants'
import DateFormatter from 'api-client/src/i18n/DateFormatter'

export const NUM_OF_WORDS_ALLOWED = 30

const Link = styled(CleanLink)`
  display: flex;
  background-color: ${({ theme }) => (theme.colors.backgroundColor)};
`
const ReadMoreLink = styled(({ type, ...props }) => <Link {...props} />)`
  align-self: flex-end;
  color: ${({ theme, type }) => type === LOCAL_NEWS ? theme.colors.themeColor : theme.colors.tunewsThemeColor};
  color: ${({ theme, type }) => type === LOCAL_NEWS ? theme.colors.themeColor : theme.colors.tunewsThemeColor};
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

const StyledNewsElement = styled.div`
  padding-bottom: 2px;
  background: linear-gradient(to left, rgba(168, 168, 168, 0.2), #bebebe 51%, rgba(168, 168, 168, 0.2));
`

const StyledContainer = styled.div`
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

class NewsElement extends React.PureComponent<PropsType> {
  renderContent (): React.Node {
    const { title, content, timestamp, formatter, t, type, link } = this.props
    return (
      <Description>
        <Title>{title}</Title>
        <Body>{textTruncator(content, NUM_OF_WORDS_ALLOWED)}</Body>
        <StyledContainer>
          <LastUpdateInfo lastUpdate={timestamp} formatter={formatter} />
          <ReadMoreLink to={link} type={type}>{t('readMore')} ></ReadMoreLink>
        </StyledContainer>
      </Description>
    )
  }

  render () {
    const { link } = this.props

    return (
      <StyledNewsElement>
        <Link to={link}>
          {this.renderContent()}
        </Link>
      </StyledNewsElement>
    )
  }
}

export default NewsElement
