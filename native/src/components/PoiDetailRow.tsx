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
      <Text style={{ alignSelf: 'center', paddingHorizontal: 8, color: theme.colors.primary }}>{text}</Text>
      {!!iconEnd && <StyledSecondIcon size={16} color={theme.colors.primary} source={iconEnd} />}
    </Container>
  )
}

export default PoiDetailRow
