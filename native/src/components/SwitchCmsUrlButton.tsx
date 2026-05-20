import React, { ReactElement } from 'react'
import { Button } from 'react-native-paper'
import styled, { useTheme } from 'styled-components/native'

import buildConfig from '../constants/buildConfig'
import { useAppContext } from '../hooks/useRegionAppContext'
import Text from './base/Text'

const Container = styled.View`
  display: flex;
  align-items: center;
  gap: 8px;
`

type SwitchCmsUrlButtonProps = {
  clearResourcesAndCache: () => void
}

const SwitchCmsUrlButton = ({ clearResourcesAndCache }: SwitchCmsUrlButtonProps): ReactElement | null => {
  const { settings, updateSettings } = useAppContext()
  const theme = useTheme()
  const { cmsUrl } = buildConfig()
  const { apiUrlOverride } = settings

  if (!apiUrlOverride || apiUrlOverride === cmsUrl) {
    return null
  }

  const setApiUrl = (newApiUrl: string) => {
    updateSettings({ apiUrlOverride: newApiUrl })
    clearResourcesAndCache()
  }

  return (
    <Container>
      <Text style={{ color: theme.colors.error }}>Currently using API: {apiUrlOverride}</Text>
      <Button mode='contained' onPress={() => setApiUrl(cmsUrl)}>
        Switch back to default API
      </Button>
    </Container>
  )
}

export default SwitchCmsUrlButton
