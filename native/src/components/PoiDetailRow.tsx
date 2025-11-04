import React, { ReactElement } from 'react'
import { SvgProps } from 'react-native-svg'
import styled from 'styled-components/native'

import useSnackbar from '../hooks/useSnackbar'
import openExternalUrl from '../utils/openExternalUrl'
import Icon from './base/Icon'
import Pressable from './base/Pressable'
import Text from './base/Text'

const Container = styled(Pressable)`
  flex-direction: row;
  padding: 2px 0;
`

const StyledText = styled(Text)`
  align-self: center;
  padding: 0 8px;
  color: ${props => props.theme.legacy.colors.linkColor};
`

const StyledSecondIcon = styled(Icon)`
  width: 16px;
  height: 16px;
  align-self: center;
`

type PoiDetailRowProps = {
  externalUrl: string
  accessibilityLabel: string
  text: string
  Icon: React.JSXElementConstructor<SvgProps>
  IconEnd?: React.JSXElementConstructor<SvgProps>
}

const PoiDetailRow = ({
  externalUrl,
  text,
  accessibilityLabel,
  Icon: IconProp,
  IconEnd,
}: PoiDetailRowProps): ReactElement => {
  const showSnackbar = useSnackbar()
  return (
    <Container
      onPress={() => openExternalUrl(externalUrl, showSnackbar)}
      role='link'
      accessibilityLabel={accessibilityLabel}>
      <Icon Icon={IconProp} />
      <StyledText>{text}</StyledText>
      {IconEnd && <StyledSecondIcon Icon={IconEnd} />}
    </Container>
  )
}

export default PoiDetailRow
