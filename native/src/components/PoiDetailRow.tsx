import React, { ReactElement } from 'react'
import { SvgProps } from 'react-native-svg'
import styled from 'styled-components/native'

import useSnackbar from '../hooks/useSnackbar'
import openExternalUrl from '../utils/openExternalUrl'
import Pressable from './base/Pressable'
import Text from './base/Text'

const Container = styled(Pressable)`
  flex-direction: row;
  padding: 2px 0;
`

const StyledText = styled(Text)`
  align-self: center;
  padding: 0 8px;
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
    <Container onPress={() => openExternalUrl(externalUrl, showSnackbar)}>
      <Icon accessibilityLabel={accessibilityLabel} />
      <StyledText>{text}</StyledText>
    </Container>
  )
}

export default PoiDetailRow
