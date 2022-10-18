import moment, { Moment } from 'moment'
import * as React from 'react'
import { ReactElement, ReactNode, useCallback, useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { Button } from 'react-native-elements'
import styled from 'styled-components/native'

import { ThemeType } from 'build-configs'

import buildConfig, { buildConfigAssets } from '../constants/buildConfig'
import appSettings from '../utils/AppSettings'
import { log, reportError } from '../utils/sentry'

const API_URL_OVERRIDE_MIN_CLICKS = 10
const CLICK_TIMEOUT = 8

type PropsType = {
  clearResourcesAndCache: () => void
  theme: ThemeType
}
const LocationImage = styled.Image`
  height: 70px;
  resize-mode: contain;
`
const ApiUrlText = styled.Text`
  padding-top: 10px;
  color: red;
`

const EastereggImage = ({ clearResourcesAndCache, theme }: PropsType): ReactElement => {
  const [clickCount, setClickCount] = useState(0)
  const [apiUrlOverride, setApiUrlOverride] = useState<string | null>(null)
  const [clickStart, setClickStart] = useState<null | Moment>(null)

  useEffect(() => {
    appSettings.loadApiUrlOverride().then(setApiUrlOverride).catch(reportError)
  }, [])

  const onImagePress = useCallback(async () => {
    const { cmsUrl, switchCmsUrl } = buildConfig()

    if (!switchCmsUrl) {
      return
    }

    const prevClickCount = clickCount
    const clickedInTimeInterval = clickStart && clickStart.isAfter(moment().subtract(CLICK_TIMEOUT, 's'))

    if (prevClickCount + 1 >= API_URL_OVERRIDE_MIN_CLICKS && clickedInTimeInterval) {
      const apiUrlOverride = await appSettings.loadApiUrlOverride()
      const newApiUrl = !apiUrlOverride || apiUrlOverride === cmsUrl ? switchCmsUrl : cmsUrl
      await appSettings.setApiUrlOverride(newApiUrl)
      setClickCount(0)
      setClickStart(null)

      clearResourcesAndCache()
      log(`Switching to new API-Url: ${newApiUrl}`)
    } else {
      const newClickStart = clickedInTimeInterval ? clickStart : moment()
      const newClickCount = clickedInTimeInterval ? prevClickCount + 1 : 1
      setClickCount(newClickCount)
      setClickStart(newClickStart)
    }
  }, [clearResourcesAndCache, clickCount, clickStart])

  const resetApiUrl = useCallback(async () => {
    await appSettings.setApiUrlOverride(buildConfig().cmsUrl)
    setClickCount(0)
    clearResourcesAndCache()
  }, [clearResourcesAndCache])

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
            onPress={resetApiUrl}
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
