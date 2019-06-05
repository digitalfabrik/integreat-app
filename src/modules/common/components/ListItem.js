// @flow

import * as React from 'react'
import styled from 'styled-components/native'
import type { FastImageSource } from 'react-native-fast-image'
import FastImage from 'react-native-fast-image'
import type { ThemeType } from '../../theme/constants/theme'

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
  thumbnail?: FastImageSource | number,
  title: string,
  children?: React.Node,
  navigateTo: () => void,
  theme: ThemeType
|}

class ListItem extends React.PureComponent<PropsType> {
  render () {
    const {title, thumbnail, children, theme} = this.props
    return (
      <StyledTouchableOpacity onPress={this.props.navigateTo} theme={theme}>
        <ListItemView>
          {thumbnail && <Thumbnail source={thumbnail} />}
          <Description theme={theme}>
            <Title theme={theme}>{title}</Title>
            {children}
          </Description>
        </ListItemView>
      </StyledTouchableOpacity>
    )
  }
}

export default ListItem
