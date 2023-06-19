import { DateTime } from 'luxon'
import React, { ReactElement, ReactNode, useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { Button } from 'react-native-elements'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import buildConfig, { buildConfigAssets } from '../constants/buildConfig'
import appSettings from '../utils/AppSettings'
import { log, reportError } from '../utils/sentry'

const API_URL_OVERRIDE_MIN_CLICKS = 10
const CLICK_TIMEOUT = 8

const LocationImage = styled.Image`
  height: 70px;
  resize-mode: contain;
`
const ApiUrlText = styled.Text`
  padding-top: 10px;
  color: red;
`

type EastereggImageProps = {
  clearResourcesAndCache: () => void
}

const EastereggImage = ({ clearResourcesAndCache }: EastereggImageProps): ReactElement => {
  const [clickCount, setClickCount] = useState(0)
  const [apiUrlOverride, setApiUrlOverride] = useState<string | null>(null)
  const [clickStart, setClickStart] = useState<null | DateTime>(null)
  const { cmsUrl, switchCmsUrl } = buildConfig()
  const theme = useTheme()

  useEffect(() => {
    appSettings.loadApiUrlOverride().then(setApiUrlOverride).catch(reportError)
  }, [])

  const setApiUrl = (newApiUrl: string) => {
    appSettings.setApiUrlOverride(newApiUrl).catch(reportError)
    setApiUrlOverride(newApiUrl)
    setClickCount(0)
    setClickStart(null)
    clearResourcesAndCache()
  }

  const onImagePress = async () => {
    if (!switchCmsUrl) {
      return
    }

    const prevClickCount = clickCount
    const clickedInTimeInterval = clickStart && clickStart > DateTime.now().minus(CLICK_TIMEOUT)

    if (prevClickCount + 1 >= API_URL_OVERRIDE_MIN_CLICKS && clickedInTimeInterval) {
      const apiUrlOverride = await appSettings.loadApiUrlOverride()
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

  const renderApiUrlText = (): ReactNode => {
    if (apiUrlOverride && apiUrlOverride !== buildConfig().cmsUrl) {
      return (
        <>
          <ApiUrlText>{`Currently using API: ${apiUrlOverride.toString()}`}</ApiUrlText>
          <Button
            titleStyle={{
              color: theme.colors.textColor,
            }}
            buttonStyle={{
              backgroundColor: theme.colors.themeColor,
              marginTop: 10,
            }}
            onPress={() => setApiUrl(cmsUrl)}
            title='Switch back to default API'
          />
        </>
      )
    }
    return null
  }

  const { locationMarker } = buildConfigAssets()

  return (
    <>
      <TouchableOpacity activeOpacity={1} onPress={onImagePress}>
        {!!locationMarker && <LocationImage source={locationMarker} />}
      </TouchableOpacity>
      {renderApiUrlText()}
    </>
  )
}

export default EastereggImage
