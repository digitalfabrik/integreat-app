// @flow

import * as React from 'react'

import styled from 'styled-components'
import CleanLink from './CleanLink'
import CleanAnchor from './CleanAnchor'

const Link = styled(CleanLink)`
  display: flex;
  border-bottom: 2px solid ${props => props.theme.colors.themeColor};
`

const Anchor = styled(CleanAnchor)`
  display: flex;
  border-bottom: 2px solid ${props => props.theme.colors.themeColor};
`

const Thumbnail = styled.img`
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  padding: 15px 5px;
  object-fit: contain;
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
`

type PropsType = {|
  thumbnail?: string,
  path: string,
  title: string,
  isExternalUrl: boolean,
  children?: React.Node
|}

class ListItem extends React.Component<PropsType> {
  static defaultProps = {
    isExternalUrl: false
  }

  renderContent (): React.Node {
    const {title, thumbnail, children} = this.props

    return (
      <>
        {thumbnail && <Thumbnail src={thumbnail} />}
        <Description>
          <Title>{title}</Title>
          {children}
        </Description>
      </>
    )
  }

  render () {
    const {path, isExternalUrl} = this.props

    if (isExternalUrl) {
      return (
        <Anchor href={path}>
          {this.renderContent()}
        </Anchor>
      )
    }
    return (
      <Link to={path}>
        {this.renderContent()}
      </Link>
    )
  }
}

export default ListItem
