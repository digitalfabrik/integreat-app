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
  align-self: center;
`

type Props = {
  externalUrl: string
  accessibilityLabel: string
  text: string
  icon: SVGElement
}

const PoiDetailRow = ({ externalUrl, text, accessibilityLabel, icon }: Props): ReactElement => (
  <Row>
    <StyledPressable onPress={() => openExternalUrl(externalUrl)}>
      <Text>
        <Icon source={icon} accessibilityLabel={accessibilityLabel} />
        {text}
      </Text>
    </StyledPressable>
  </Row>
)

export default PoiDetailRow
