import React, { ReactElement } from 'react'
import { Button } from 'react-native-paper'
import styled, { useTheme } from 'styled-components/native'

import buildConfig from '../constants/buildConfig'
import { useAppContext } from '../hooks/useCityAppContext'
import Text from './base/Text'

const Container = styled.View`
  display: flex;
  align-items: center;
`

type LandingIconProps = {
  clearResourcesAndCache: () => void
}

const SwitchCmsUrlButton = ({ clearResourcesAndCache }: LandingIconProps): ReactElement | null => {
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
      <Text style={{ paddingTop: 12, color: theme.colors.error }}>{`Currently using API: ${apiUrlOverride}`}</Text>
      <Button mode='contained' style={{ marginTop: 16 }} onPress={() => setApiUrl(cmsUrl)}>
        Switch back to default API
      </Button>
    </Container>
  )
}

export default SwitchCmsUrlButton
