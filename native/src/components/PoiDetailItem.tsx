import React, { ReactElement, ReactNode } from 'react'
import { TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import styled, { useTheme } from 'styled-components/native'

import { config } from 'translations/src'

import { contentDirection } from '../constants/contentDirection'

type PoiDetailItemProps = {
  /** language to offer rtl support */
  language: string
  onPress?: () => void | undefined
  onLongPress?: () => void | undefined
  /** name of the materialIcon */
  icon: string
  children: ReactNode
  /** define whether item should have border bottom */
  border?: boolean
  /** set iconSize for the item icon */
  iconSize?: number
}

const PoiDetailItemContainer = styled(TouchableOpacity)<{ border: boolean; language: string }>`
  padding: 16px 48px;
  border-style: solid;
  border-color: ${props => props.theme.colors.textDisabledColor};
  border-bottom-width: ${props => (props.border ? '1px' : 0)};
  width: 100%;
  flex-direction: ${props => contentDirection(props.language)};
  min-height: 64px;
`

const TextContainer = styled.View`
  padding: 0 16px;
  align-self: center;
`

const StyledIcon = styled(Icon)<{ hasRTLScript?: boolean }>`
  align-self: center;
  transform: scaleX(${props => (props.hasRTLScript ? -1 : 1)});
`

const ArrowContainer = styled(View)<{ language: string }>`
  flex: 1;
  flex-direction: ${props => contentDirection(props.language)};
  justify-content: flex-end;
`

const DEFAULT_ICON_SIZE = 25

const PoiDetailItem: React.FC<PoiDetailItemProps> = ({
  onPress,
  onLongPress,
  children,
  icon,
  border = true,
  language,
  iconSize = DEFAULT_ICON_SIZE
}: PoiDetailItemProps): ReactElement => {
  const theme = useTheme()

  return (
    <PoiDetailItemContainer
      activeOpacity={1}
      onPress={onPress}
      border={border}
      onLongPress={onLongPress}
      language={language}
    >
      <StyledIcon name={icon} size={iconSize} color={theme.colors.textSecondaryColor} />
      <TextContainer>{children}</TextContainer>
      <ArrowContainer language={language}>
        <StyledIcon
          name='chevron-right'
          size={iconSize}
          color={theme.colors.textSecondaryColor}
          hasRTLScript={config.hasRTLScript(language)}
        />
      </ArrowContainer>
    </PoiDetailItemContainer>
  )
}

export default PoiDetailItem
