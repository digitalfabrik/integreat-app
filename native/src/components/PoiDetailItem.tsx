import React, { ReactElement, ReactNode } from 'react'
import { TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import styled, { useTheme } from 'styled-components/native'

import { contentDirection } from '../constants/contentDirection'

type PoiDetailItemProps = {
  language: string
  onPress?: () => void | undefined
  onLongPress?: () => void | undefined
  icon: string
  children: ReactNode
  border?: boolean
  iconSize?: number
}

const LocationContainer = styled(TouchableOpacity)<{ border: boolean; language: string }>`
  padding: 16px 48px;
  border-style: solid;
  border-color: ${props => props.theme.colors.textDisabledColor};
  border-bottom-width: ${props => (props.border ? '1px' : 0)};
  width: 100%;
  flex-direction: ${props => contentDirection(props.language)};
  min-height: 64px;
`

const InformationTextContainer = styled.View`
  padding: 0 16px;
  align-self: center;
`

const StyledIcon = styled(Icon)`
  align-self: center;
`

const PoiDetailItem: React.FC<PoiDetailItemProps> = ({
  onPress,
  onLongPress,
  children,
  icon,
  border = true,
  language,
  iconSize = 25
}: PoiDetailItemProps): ReactElement => {
  const theme = useTheme()

  return (
    <LocationContainer
      activeOpacity={1}
      onPress={onPress}
      border={border}
      onLongPress={onLongPress}
      language={language}>
      <StyledIcon name={icon} size={iconSize} color={theme.colors.textSecondaryColor} />
      <InformationTextContainer>{children}</InformationTextContainer>
    </LocationContainer>
  )
}

export default PoiDetailItem
