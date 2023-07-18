import React, { ReactElement } from 'react'
import { Text } from 'react-native'
import { SvgProps } from 'react-native-svg'
import styled from 'styled-components/native'

import useSnackbar from '../hooks/useSnackbar'
import openExternalUrl from '../utils/openExternalUrl'

const IconContainer = styled.View`
  margin-right: 5px;
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
  Icon: React.JSXElementConstructor<SvgProps>
}

const PoiDetailRow = ({ externalUrl, text, accessibilityLabel, Icon }: PoiDetailRowProps): ReactElement => {
  const showSnackbar = useSnackbar()
  return (
    <StyledPressable onPress={() => openExternalUrl(externalUrl, showSnackbar)}>
      <IconContainer>
        <Icon accessibilityLabel={accessibilityLabel} />
      </IconContainer>
      <StyledText>{text}</StyledText>
    </StyledPressable>
  )
}

export default PoiDetailRow
