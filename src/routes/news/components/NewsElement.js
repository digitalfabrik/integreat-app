// @flow

import * as React from 'react'
import styled from 'styled-components'
import { LocalNewsModel } from '@integreat-app/integreat-api-client'
import CleanLink from '../../../modules/common/components/CleanLink'
import LastUpdateInfo from './../../../modules/common/components/LastUpdateInfo'
import type { TFunction } from 'react-i18next'
import { textTruncator } from './../../../modules/theme/constants/helpers'

const TRUNCATE_LETTERS_COUNT = 30

const Link = styled(CleanLink)`
  display: flex;
  background-color: white;
`

const ReadMoreLink = styled(CleanLink)`
  align-self: flex-end;
  color: ${({ theme }) => (theme.colors.themeColor)};
  font-weight: 600;
`

const Description = styled.div`
  display: flex;
  height: 100%;
  min-width: 1px; /* needed to enable line breaks for too long words, exact value doesn't matter */
  flex-direction: column;
  flex-grow: 1;
  padding: 15px 10px 0;
  word-wrap: break-word;

  > * {
    padding-bottom: 10px;
  }
`

const Title = styled.h3`
  font-weight: 700;
  font-family: Raleway;
  font-size: 18px;
  font-weight: bold;
  color: ${({ theme }) => (theme.colors.headlineTextColor)};
  margin-bottom: 0;
`
const Body = styled.p`
  font-size: 16px;
  line-height: 1.38;
  color: ${({ theme }) => (theme.colors.headlineTextColor)};
`

const StyledNewsElement = styled.div`
  background: linear-gradient(to left, rgba(168, 168, 168, 0.2), #bebebe 51%, rgba(168, 168, 168, 0.2));
  padding-bottom: 2px;
`

const StyledContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`

const StyledDate = styled(LastUpdateInfo)`
  font-size: 12px;
  color: ${({ theme }) => (theme.colors.headlineTextColor)};
`

type PropsType = {|
  newsItem: LocalNewsModel,
  path: string,
  language: string,
  t: TFunction
|}

class NewsElement extends React.PureComponent<PropsType> {
  renderContent (itemPath: string): React.Node {
    const { newsItem, language, t } = this.props
    return (
      <>
        <Description>
          <Title>{newsItem.title}</Title>
          <Body>{newsItem && textTruncator(newsItem.message, TRUNCATE_LETTERS_COUNT)}</Body>
          <StyledContainer>
            <StyledDate lastUpdate={newsItem.timestamp} language={language} />
            <ReadMoreLink to={itemPath}>{t('readMore')}</ReadMoreLink>
          </StyledContainer>
        </Description>
      </>
    )
  }

  render () {
    const { path, newsItem } = this.props
    const itemPath = `${path}/${newsItem.id}`

    return (
      <StyledNewsElement>
        <Link to={itemPath}>
          {!!newsItem.title && this.renderContent(itemPath)}
        </Link>
      </StyledNewsElement>
    )
  }
}

export default NewsElement
