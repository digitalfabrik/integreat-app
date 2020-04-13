// @flow

import * as React from 'react'
import styled from 'styled-components'
import { LocalNewsModel } from '@integreat-app/integreat-api-client'
import CleanLink from '../../../modules/common/components/CleanLink'
import LastUpdateInfo from '../../../modules/common/components/LastUpdateInfo'

const LOCAL_NEWS = 'local'

const Link = styled(CleanLink)`
  display: flex;
  background-color: white;
`

const ReadMoreLink = styled(CleanLink)`
  align-self: flex-end;
  color: ${({ type }) => (type === LOCAL_NEWS ? '#efd22b' : '#0279a6')};
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

type PropsType = {|
  newsItem: Array<LocalNewsModel>,
  path: string,
  title: string,
  type: string,
  children?: React.Node
|}

class ListItem extends React.PureComponent<PropsType> {
  renderContent (itemPath: string): React.Node {
    const { newsItem, type, language } = this.props

    return (
      <>
        <Description>
          <Title>{newsItem.title}</Title>
          <Body>{newsItem && newsItem.message}</Body>
          {newsItem.timestamp && <LastUpdateInfo lastUpdate={newsItem.timestamp} language={language} />}
          <ReadMoreLink to={itemPath} type={type}>Read more</ReadMoreLink>
        </Description>
      </>
    )
  }

  render () {
    const { path, newsItem } = this.props
    const itemPath = `${path}/${newsItem.title}`

    return (
      <StyledNewsElement>
        <Link to={itemPath}>
          {!!newsItem.title && this.renderContent(itemPath)}
        </Link>
      </StyledNewsElement>
    )
  }
}

export default ListItem
