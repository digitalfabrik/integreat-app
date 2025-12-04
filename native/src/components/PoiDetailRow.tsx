import React, { ReactElement } from 'react'
import styled, { useTheme } from 'styled-components/native'

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
  color: ${props => props.theme.colors.link};
`

const StyledSecondIcon = styled(Icon)`
  align-self: center;
`

type PoiDetailRowProps = {
  externalUrl: string
  accessibilityLabel: string
  text: string
  icon: string
  iconEnd?: string
}

const PoiDetailRow = ({ externalUrl, text, accessibilityLabel, icon, iconEnd }: PoiDetailRowProps): ReactElement => {
  const showSnackbar = useSnackbar()
  const theme = useTheme()
  return (
    <Container
      onPress={() => openExternalUrl(externalUrl, showSnackbar)}
      role='link'
      accessibilityLabel={accessibilityLabel}>
      <Icon source={icon} />
      <StyledText>{text}</StyledText>
      {!!iconEnd && <StyledSecondIcon size={16} color={theme.colors.link} source={iconEnd} />}
    </Container>
  )
}

export default PoiDetailRow
