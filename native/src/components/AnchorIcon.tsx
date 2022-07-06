import React, { ReactElement } from 'react'
import { ScrollView } from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import styled from 'styled-components/native'

import { isRTL } from '../constants/contentDirection'

const Icon = styled(MaterialIcon)<{ disabled: boolean }>`
  font-size: 30px;
  color: ${props => (props.disabled ? props.theme.colors.textDisabledColor : props.theme.colors.textColor)};
`

type PropsType = {
  name: string
  scrollViewRef: React.ElementRef<typeof ScrollView> | null
  isLeftAnchor: boolean
  disabled: boolean
}

const AnchorIcon = ({ name, scrollViewRef, isLeftAnchor, disabled }: PropsType): ReactElement => {
  const onAnchorPress = (): void => {
    if (isLeftAnchor) {
      scrollViewRef?.scrollTo({ x: 0, y: 0, animated: true })
    } else {
      scrollViewRef?.scrollToEnd({ animated: true })
    }
  }

  return (
    <Icon
      name={name}
      style={{
        transform: [
          {
            scaleX: isRTL() ? -1 : 1
          }
        ]
      }}
      onPress={onAnchorPress}
      disabled={disabled}
    />
  )
}

export default AnchorIcon
