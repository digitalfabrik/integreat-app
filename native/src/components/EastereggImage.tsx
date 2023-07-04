import moment, { Moment } from 'moment'
import React, { ReactElement, ReactNode, useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'

import buildConfig, { buildConfigAssets } from '../constants/buildConfig'
import appSettings from '../utils/AppSettings'
import { log, reportError } from '../utils/sentry'
import PrimaryTextButton from './PrimaryTextButton'

const API_URL_OVERRIDE_MIN_CLICKS = 10
const CLICK_TIMEOUT = 8

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
  const [clickStart, setClickStart] = useState<null | Moment>(null)
  const { cmsUrl, switchCmsUrl } = buildConfig()

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
    const clickedInTimeInterval = clickStart && clickStart.isAfter(moment().subtract(CLICK_TIMEOUT, 's'))

    if (prevClickCount + 1 >= API_URL_OVERRIDE_MIN_CLICKS && clickedInTimeInterval) {
      const apiUrlOverride = await appSettings.loadApiUrlOverride()
      const newApiUrl = !apiUrlOverride || apiUrlOverride === cmsUrl ? switchCmsUrl : cmsUrl
      setApiUrl(newApiUrl)
      log(`Switching to new API-Url: ${newApiUrl}`)
    } else {
      const newClickStart = clickedInTimeInterval ? clickStart : moment()
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
          <PrimaryTextButton onPress={() => setApiUrl(cmsUrl)} text='Switch back to default API' />
        </>
      )
    }
    return null
  }

  const { LocationMarker } = buildConfigAssets()

  return (
    <>
      <TouchableOpacity activeOpacity={1} onPress={onImagePress}>
        {LocationMarker && <LocationMarker height={70} width={100} />}
      </TouchableOpacity>
      {renderApiUrlText()}
    </>
  )
}

export default EastereggImage
