import React, { ReactElement } from 'react'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import styled from 'styled-components/native'

import { isRTL } from '../constants/contentDirection'

const Icon = styled(MaterialIcon)<{ disabled: boolean }>`
  font-size: 30px;
  color: ${props => (props.disabled ? props.theme.colors.textDisabledColor : props.theme.colors.textColor)};
`

type AnchorIconProps = {
  onPress: () => void
  isLeftAnchor: boolean
  disabled: boolean
}

const AnchorIcon = ({ onPress, isLeftAnchor, disabled }: AnchorIconProps): ReactElement => (
  <Icon
    name={isLeftAnchor ? 'keyboard-arrow-left' : 'keyboard-arrow-right'}
    style={{
      transform: [
        {
          scaleX: isRTL() ? -1 : 1,
        },
      ],
    }}
    onPress={onPress}
    disabled={disabled}
  />
)

export default AnchorIcon
