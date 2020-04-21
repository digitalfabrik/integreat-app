// @flow

import * as React from 'react'
import styled from 'styled-components'
import { TuNewsModel } from '@integreat-app/integreat-api-client'
import CleanLink from '../../../modules/common/components/CleanLink'

const LOCAL_NEWS = 'local'
const TU_NEWS = 'tu'

const Link = styled(CleanLink)`
  display: flex;
  background-color: white;
`

const ReadMoreLink = styled(CleanLink)`
  align-self: flex-end;
  color: #007aa8;
  font-weight: 600
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

const Title = styled.div`
  font-weight: 700;
  font-family: Raleway;
  font-size: 18px;
  font-weight: bold;
  color: #6f6f6e;
  margin-bottom: 0;
`
const Body = styled.div`
  font-size: 16px;
  line-height: 1.38;
  color: #6f6f6e;
`

const StyledNewsElement = styled.div`
  background: linear-gradient(to left, rgba(168, 168, 168, 0.2), #bebebe 51%, rgba(168, 168, 168, 0.2));
  padding-bottom: 2px;
`

const StyledDate = styled.div`
font-size: 12px;
color: #6f6f6e;
`

const StyledContainer = styled.div`
width: 100%;
display: flex;
justify-content: space-between;
`

type PropsType = {|
  newsItem: TuNewsModel,
    path: string,
      title: string,
        type: string,
          language: string,
            city: string,
          |}

class NewsElement extends React.PureComponent<PropsType> {
  renderContent(itemPath: string): React.Node {
    const { newsItem, t } = this.props
    return (
      <>
        <Description>
          <Title>{newsItem._title}</Title>
          {/* <Date>{newsItem.date}</Date> */}
          <Body>{newsItem._content}</Body>
          <StyledContainer>
            <StyledDate>April 21, 2020</StyledDate>
            <ReadMoreLink to={itemPath}>{t('readMore')}</ReadMoreLink>
          </StyledContainer>
        </Description>
      </>
    )
  }

  render() {
    const { path, newsItem, type, city, language } = this.props
    const itemPath = `/${city}/${language}/news/tu-news/${newsItem._id}`;

    return (
      <StyledNewsElement>
        <Link to={itemPath}>
          {this.renderContent(itemPath)}
        </Link>
      </StyledNewsElement>
    )
  }
}

export default NewsElement
