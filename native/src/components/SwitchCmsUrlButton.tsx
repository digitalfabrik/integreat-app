import React, { ReactElement } from 'react'
import { Button } from 'react-native-paper'
import styled, { useTheme } from 'styled-components/native'

import buildConfig from '../constants/buildConfig'
import { useAppContext } from '../hooks/useRegionAppContext'
import useSnackbar from '../hooks/useSnackbar'
import { log } from '../utils/sentry'
import Text from './base/Text'

const Container = styled.View`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 0;
`

type SwitchCmsUrlButtonProps = {
  clearResourcesAndCache: () => void
}

const SwitchCmsUrlButton = ({ clearResourcesAndCache }: SwitchCmsUrlButtonProps): ReactElement | null => {
  const { settings, updateSettings } = useAppContext()
  const theme = useTheme()
  const showSnackbar = useSnackbar()
  const { cmsUrl } = buildConfig()
  const { apiUrlOverride } = settings

  if (!apiUrlOverride || apiUrlOverride === cmsUrl) {
    return null
  }

  const setApiUrl = (newApiUrl: string) => {
    updateSettings({ apiUrlOverride: newApiUrl })
    clearResourcesAndCache()
    log(`Switching to default API: ${newApiUrl}`)
    showSnackbar({ text: `Switched to default API ${newApiUrl}` })
  }

  return (
    <Container>
      <Text style={{ color: theme.colors.error }}>Currently using CMS: {apiUrlOverride}</Text>
      <Button mode='contained' onPress={() => setApiUrl(cmsUrl)}>
        Switch back to default API
      </Button>
    </Container>
  )
}

export default SwitchCmsUrlButton
