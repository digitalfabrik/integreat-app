import React, { ReactElement, ReactNode } from 'react'
import styled from 'styled-components/native'

import { contentDirection } from '../constants/contentDirection'
import SimpleImage, { ImageSourceType } from './SimpleImage'
import Pressable from './base/Pressable'
import Text from './base/Text'

const ListItemView = styled.View<{ language: string }>`
  flex-direction: ${props => contentDirection(props.language)};
  padding: 12px 0;
  gap: 8px;
  align-items: center;
`

const StyledPressable = styled(Pressable)`
  border-bottom-width: 2px;
  border-bottom-color: ${props => props.theme.legacy.colors.themeColor};
`

const Thumbnail = styled(SimpleImage)`
  width: 75px;
  height: 75px;
  flex-shrink: 0;
`

const Description = styled.View`
  height: 100%;
  flex: 1;
  font-family: ${props => props.theme.legacy.fonts.native.decorativeFontRegular};
`

const TitleRow = styled.View`
  flex-direction: row;
  gap: 8px;
  justify-content: space-between;
`

const Title = styled(Text)`
  flex: 1;
  font-weight: 700;
  font-family: ${props => props.theme.legacy.fonts.native.decorativeFontBold};
  color: ${props => props.theme.legacy.colors.textColor};
  flex-wrap: wrap;
`

type ListItemProps = {
  thumbnail: ImageSourceType
  title: string
  language: string
  children?: ReactNode
  Icon?: ReactNode
  navigateTo: () => void
}

const ListItem = ({ language, title, thumbnail, children, Icon, navigateTo }: ListItemProps): ReactElement => (
  <StyledPressable onPress={navigateTo} accessibilityLanguage={language} role='link'>
    <ListItemView language={language}>
      <Thumbnail source={thumbnail} />
      <Description>
        <TitleRow>
          <Title>{title}</Title>
          {Icon}
        </TitleRow>
        {children}
      </Description>
    </ListItemView>
  </StyledPressable>
)

export default ListItem
