// @flow

import * as React from 'react'

import styled from 'styled-components'
import CleanLink from '../../../modules/common/components/CleanLink'
import CleanAnchor from '../../../modules/common/components/CleanAnchor'

const Link = styled(CleanLink)`
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
  height: 100%;
  min-width: 1px; /* needed to enable line breaks for too long words, exact value doesn't matter */
  flex-grow: 1;
  margin-left: 15px;
  padding: 15px 0 5px;
  word-wrap: break-word;
  
  > * {
    padding-bottom: 10px;
  }
`

const Title = styled.div`
  font-weight: 700;
`

type PropsType = {|
  thumbnail: string,
  path: string,
  title: string,
  isExternalLink: boolean,
  children?: Array<React.Node>
|}

/**
 * Display a element of the EventList
 */
class ListElement extends React.Component<PropsType> {
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
    const {path, isExternalLink} = this.props

    if(isExternalLink) {
      return (
        <CleanAnchor href={path}>
          {this.renderContent()}
        </CleanAnchor>
      )
    }
    return (
      <Link to={path}>
        {this.renderContent()}
      </Link>
    )
  }
}

export default ListElement
