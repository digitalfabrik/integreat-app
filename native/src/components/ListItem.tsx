import React, { ReactElement, ReactNode } from 'react'
import { TouchableRipple } from 'react-native-paper'
import styled, { useTheme } from 'styled-components/native'

import { contentDirection } from '../constants/contentDirection'
import SimpleImage, { ImageSourceType } from './SimpleImage'
import Text from './base/Text'

const ListItemView = styled.View<{ language: string }>`
  flex-direction: ${props => contentDirection(props.language)};
  padding: 12px 0;
  gap: 8px;
  align-items: center;
`

const Thumbnail = styled(SimpleImage)`
  width: 75px;
  height: 75px;
  flex-shrink: 0;
`

const Description = styled.View`
  height: 100%;
  flex: 1;
`

const TitleRow = styled.View`
  flex-direction: row;
  gap: 8px;
  justify-content: space-between;
`

type ListItemProps = {
  thumbnail: ImageSourceType
  title: string
  language: string
  children?: ReactNode
  icon?: ReactNode
  navigateTo: () => void
}

const ListItem = ({ language, title, thumbnail, children, icon, navigateTo }: ListItemProps): ReactElement => {
  const theme = useTheme()

  return (
    <TouchableRipple
      borderless
      onPress={navigateTo}
      accessibilityLanguage={language}
      role='link'
      style={{ borderBottomWidth: 2, borderBottomColor: theme.colors.secondary }}>
      <ListItemView language={language}>
        <Thumbnail source={thumbnail} />
        <Description>
          <TitleRow>
            <Text variant='h6' style={{ flex: 1, flexWrap: 'wrap' }}>
              {title}
            </Text>
            {icon}
          </TitleRow>
          {children}
        </Description>
      </ListItemView>
    </TouchableRipple>
  )
}

export default ListItem
