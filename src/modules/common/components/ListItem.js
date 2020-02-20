// @flow

import * as React from 'react'
import styled from 'styled-components/native'
import { type StyledComponent } from 'styled-components'
import type { ThemeType } from '../../theme/constants/theme'
import Image from './Image'
import type { ImageSourceType } from './Image'
import { contentDirection } from '../../i18n/contentDirection'

type ListItemViewPropsType = {|
  language: string, children: React.Node, theme: ThemeType
|}

const ListItemView: StyledComponent<ListItemViewPropsType, ThemeType, *> = styled.View`
  flex: 1;
  flex-direction: ${props => contentDirection(props.language)};
  padding: 15px 5px 0;
`

const StyledTouchableOpacity: StyledComponent<{}, ThemeType, *> = styled.TouchableOpacity`
  flex: 1;
  flex-direction: column;
  padding-bottom: 10px;
  border-bottom-width: 2px;
  border-bottom-color: ${props => props.theme.colors.themeColor};
`

const Thumbnail = styled(Image)`
  width: 75px;
  height: 75px;
  flex-shrink: 0;
`

const Description = styled.View`
  flex: 1;
  height: 100%;
  flex-direction: column;
  flex-grow: 1;
  font-family: ${props => props.theme.fonts.decorativeFontRegular};
  padding: 0 10px;
`

const Title = styled.Text`
  font-weight: 700;
  font-family: ${props => props.theme.fonts.decorativeFontBold};
  color: ${props => props.theme.colors.textColor};
`

type PropsType = {|
  thumbnail: ImageSourceType,
  title: string,
  language: string,
  children?: React.Node,
  navigateTo: () => void,
  theme: ThemeType
|}

class ListItem extends React.PureComponent<PropsType> {
  render () {
    const { language, title, thumbnail, children, theme } = this.props
    return (
      <StyledTouchableOpacity onPress={this.props.navigateTo} theme={theme}>
        <ListItemView language={language} theme={theme}>
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
