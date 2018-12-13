// @flow

import * as React from 'react'
import styled from 'styled-components'

const StyledTouchableHighlight = styled.TouchableHighlight`
  display: flex;
  border-bottom: 2px solid ${props => props.theme.colors.themeColor};
`

const Thumbnail = styled.Image`
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  padding: 15px 5px;
  object-fit: contain;
`

const Description = styled.View`
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

const Title = styled.View`
  font-weight: 700;
`

type PropsType = {|
  thumbnail?: string,
  title: string,
  children?: React.Node,
  navigateTo: () => void
|}

class ListItem extends React.PureComponent<PropsType> {
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
    return (
      <StyledTouchableHighlight onPress={this.props.navigateTo}>
        {this.renderContent()}
      </StyledTouchableHighlight>
    )
  }
}

export default ListItem
