import { DateTime } from 'luxon'
import React, { ReactElement, useState } from 'react'
import styled, { useTheme } from 'styled-components/native'

import buildConfig from '../constants/buildConfig'
import { useAppContext } from '../hooks/useCityAppContext'
import { log } from '../utils/sentry'
import Icon from './base/Icon'
import Pressable from './base/Pressable'
import TextButton from './base/TextButton'

const API_URL_OVERRIDE_MIN_CLICKS = 10
const CLICK_TIMEOUT = 8

const Container = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const ApiUrlText = styled.Text`
  padding-top: 10px;
  color: red;
`

const StyledButton = styled(TextButton)`
  margin-top: 16px;
`

const StyledPressable = styled(Pressable)`
  opacity: 1;
`

const StyledIcon = styled(Icon)`
  color: ${props => props.theme.legacy.colors.themeColor};
  height: 64px;
  width: 96px;
`

type LandingIconProps = {
  clearResourcesAndCache: () => void
}

const SwitchCmsUrlIcon = ({ clearResourcesAndCache }: LandingIconProps): ReactElement => {
  const [clickCount, setClickCount] = useState(0)
  const [clickStart, setClickStart] = useState<null | DateTime>(null)
  const { settings, updateSettings } = useAppContext()
  const theme = useTheme()
  const { cmsUrl, switchCmsUrl } = buildConfig()
  const { apiUrlOverride } = settings

  const setApiUrl = (newApiUrl: string) => {
    updateSettings({ apiUrlOverride: newApiUrl })
    setClickCount(0)
    setClickStart(null)
    clearResourcesAndCache()
  }

  const onImagePress = async () => {
    if (!switchCmsUrl) {
      return
    }

    const prevClickCount = clickCount
    const clickedInTimeInterval = clickStart && clickStart > DateTime.now().minus({ seconds: CLICK_TIMEOUT })

    if (prevClickCount + 1 >= API_URL_OVERRIDE_MIN_CLICKS && clickedInTimeInterval) {
      const newApiUrl = !apiUrlOverride || apiUrlOverride === cmsUrl ? switchCmsUrl : cmsUrl
      setApiUrl(newApiUrl)
      log(`Switching to new API-Url: ${newApiUrl}`)
    } else {
      const newClickStart = clickedInTimeInterval ? clickStart : DateTime.now()
      const newClickCount = clickedInTimeInterval ? prevClickCount + 1 : 1
      setClickCount(newClickCount)
      setClickStart(newClickStart)
    }
  }

  return (
    <Container>
      <StyledPressable
        onPress={onImagePress}
        role='button'
        focusable={false}
        importantForAccessibility='no'
        accessibilityElementsHidden
        accessible={false}>
        <StyledIcon size={72} color={theme.legacy.colors.themeColor} source='map-marker' />
      </StyledPressable>
      {apiUrlOverride && apiUrlOverride !== buildConfig().cmsUrl ? (
        <>
          <ApiUrlText>{`Currently using API: ${apiUrlOverride.toString()}`}</ApiUrlText>
          <StyledButton onPress={() => setApiUrl(cmsUrl)} text='Switch back to default API' />
        </>
      ) : null}
    </Container>
  )
}

export default SwitchCmsUrlIcon
