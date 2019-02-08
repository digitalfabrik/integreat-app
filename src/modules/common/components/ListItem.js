// @flow

import * as React from 'react'
import styled from 'styled-components'
import FastImage from 'react-native-fast-image'

const ListItemView = styled.View`
  flex: 1;
  flex-direction: row;
  padding: 15px 5px 0;
`

const StyledTouchableOpacity = styled.TouchableOpacity`
  flex: 1;
  flex-direction: column;
  padding-bottom: 10px;
  border-bottom-width: 2px;
  border-bottom-color: ${props => props.theme.colors.themeColor};
`

const Thumbnail = styled(FastImage)`
  width: 75px;
  height: 75px;
  flex-shrink: 0;
`

const Description = styled.View`
  flex: 1;
  height: 100%;
  flex-direction: column;
  flex-grow: 1;
  padding: 0 10px;
`

const Title = styled.Text`
  font-weight: 700;
`

type PropsType = {|
  thumbnail?: {uri: string} | string,
  title: string,
  children?: React.Node,
  navigateTo: () => void
|}

class ListItem extends React.PureComponent<PropsType> {
  render () {
    const {title, thumbnail, children} = this.props
    return (
      <StyledTouchableOpacity onPress={this.props.navigateTo}>
        <ListItemView>
          {thumbnail && <Thumbnail source={thumbnail} />}
          <Description>
            <Title>{title}</Title>
            {children}
          </Description>
        </ListItemView>
      </StyledTouchableOpacity>
    )
  }
}

export default ListItem
