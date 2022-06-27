import React, { ReactElement } from 'react'
import { Text } from 'react-native'
import styled from 'styled-components/native'

import openExternalUrl from '../utils/openExternalUrl'

const Row = styled.View`
  flex-direction: row;
  padding-vertical: 3px;
`

const Icon = styled.Image`
  margin-horizontal: 5px;
`

const StyledPressable = styled.Pressable`
  alignself: center;
`

type Props = {
  externalUrl: string
  accessibilityLabel: string
  text: string
  icon: SVGElement
}

const PoiDetailRow = ({ externalUrl, text, accessibilityLabel, icon }: Props): ReactElement => (
  <Row>
    <Icon source={icon} accessibilityLabel={accessibilityLabel} />
    <StyledPressable onPress={() => openExternalUrl(externalUrl)}>
      <Text>{text}</Text>
    </StyledPressable>
  </Row>
)

export default PoiDetailRow
