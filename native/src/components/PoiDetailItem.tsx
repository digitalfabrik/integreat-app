import React, { ReactElement, ReactNode } from 'react'
import { Pressable, View } from 'react-native'
import styled from 'styled-components/native'

import { contentDirection } from '../constants/contentDirection'

type PoiDetailItemProps = {
  language: string
  onIconPress: () => void
  icon: ReactElement
  children: ReactNode
}

const PoiDetailItemContainer = styled(View)<{ language: string }>`
  justify-content: space-between;
  flex-direction: ${props => contentDirection(props.language)};
`

const IconContainer = styled(Pressable)`
  align-self: center;
  padding-right: 8px;
`

const PoiDetailItem: React.FC<PoiDetailItemProps> = ({
  onIconPress,
  children,
  icon,
  language,
}: PoiDetailItemProps): ReactElement => (
  <PoiDetailItemContainer language={language}>
    <View>{children}</View>
    <IconContainer onPress={onIconPress}>{icon}</IconContainer>
  </PoiDetailItemContainer>
)

export default PoiDetailItem
