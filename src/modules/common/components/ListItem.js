// @flow

import * as React from 'react'
import styled from 'styled-components'
import FastImage from 'react-native-fast-image'

const StyledTouchableOpacity = styled.TouchableOpacity`
  flex: 1;
  flex-direction: column;
  padding-bottom: 10px;
  border-bottom-width: 2px;
  border-bottom-color: ${props => props.theme.colors.themeColor};
`

const Thumbnail = styled(FastImage)`
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
`

const Title = styled.Text`
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
        {thumbnail && <Thumbnail src={{uri: thumbnail}} />}
        <Description>
          <Title>{title}</Title>
          {children}
        </Description>
      </>
    )
  }

  render () {
    return (
      <StyledTouchableOpacity onPress={this.props.navigateTo}>
        {this.renderContent()}
      </StyledTouchableOpacity>
    )
  }
}

export default ListItem
