import React, { ReactElement } from 'react'
import { Text } from 'react-native'
import styled from 'styled-components/native'

import openExternalUrl from '../utils/openExternalUrl'

const Icon = styled.Image`
  margin-horizontal: 5px;
`

const StyledPressable = styled.Pressable`
  align-self: flex-start;
  flex-direction: row;
  padding-vertical: 3px;
`

type Props = {
  externalUrl: string
  accessibilityLabel: string
  text: string
  icon: SVGElement
}

const PoiDetailRow = ({ externalUrl, text, accessibilityLabel, icon }: Props): ReactElement => (
  <StyledPressable onPress={() => openExternalUrl(externalUrl)}>
    <Icon source={icon} accessibilityLabel={accessibilityLabel} />
    <Text>{text}</Text>
  </StyledPressable>
)

export default PoiDetailRow
