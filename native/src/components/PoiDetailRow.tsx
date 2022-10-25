import React, { ReactElement } from 'react'
import { Text } from 'react-native'
import styled from 'styled-components/native'

import openExternalUrl from '../utils/openExternalUrl'

const Icon = styled.Image`
  margin-horizontal: 5px;
`

const StyledPressable = styled.Pressable`
  flex-direction: row;
  padding-vertical: 3px;
`

const StyledText = styled(Text)`
  align-self: center;
`

type PoiDetailRowProps = {
  externalUrl: string
  accessibilityLabel: string
  text: string
  icon: SVGElement
}

const PoiDetailRow = ({ externalUrl, text, accessibilityLabel, icon }: PoiDetailRowProps): ReactElement => (
  <StyledPressable onPress={() => openExternalUrl(externalUrl)}>
    <Icon source={icon} accessibilityLabel={accessibilityLabel} />
    <StyledText>{text}</StyledText>
  </StyledPressable>
)

export default PoiDetailRow
