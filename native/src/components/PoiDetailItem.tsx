import React, { ReactElement, ReactNode } from 'react'
import { TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import styled, { useTheme } from 'styled-components/native'

type PoiDetailItemProps = {
  onPress?: () => void | undefined
  icon: string
  children: ReactNode
  border?: boolean
}

const LocationContainer = styled(TouchableOpacity)<{ border: boolean }>`
  padding: 16px 48px;
  border-style: solid;
  border-color: ${props => props.theme.colors.textSecondaryColor};
  border-bottom-width: ${props => (props.border ? '1px' : 0)};
  width: 100%;
  flex-direction: row;
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
  children,
  icon,
  border = true
}: PoiDetailItemProps): ReactElement => {
  const theme = useTheme()

  return (
    <LocationContainer activeOpacity={1} onPress={onPress} border={border}>
      <StyledIcon name={icon} size={25} color={theme.colors.textSecondaryColor} />
      <InformationTextContainer>{children}</InformationTextContainer>
    </LocationContainer>
  )
}

export default PoiDetailItem
