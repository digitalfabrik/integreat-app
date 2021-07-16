import * as React from 'react'
import { ReactNode } from 'react'
import { TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'
import { ThemeType } from 'build-configs'
import moment, { Moment } from 'moment'
import AppSettings from '../services/AppSettings'
import { Button } from 'react-native-elements'
import buildConfig, { buildConfigAssets } from '../constants/buildConfig'

const API_URL_OVERRIDE_MIN_CLICKS = 10
const CLICK_TIMEOUT = 8

type StateType = {
  clickCount: number
  clickStart: Moment | null | undefined
  apiUrlOverride: string | null | undefined
}
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

class EastereggImage extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props)
    this.state = {
      clickCount: 0,
      apiUrlOverride: null,
      clickStart: null
    }
  }

  componentDidMount(): void {
    const appSettings = new AppSettings()
    appSettings
      .loadApiUrlOverride()
      .then(apiUrlOverride =>
        this.setState({
          apiUrlOverride
        })
      )
      .catch(e => {
        console.error(e)
      })
  }

  onImagePress = async (): Promise<void> => {
    const { cmsUrl, switchCmsUrl } = buildConfig()

    if (!switchCmsUrl) {
      return
    }

    const prevClickCount = this.state.clickCount
    const clickStart = this.state.clickStart
    const clickedInTimeInterval = clickStart && clickStart.isAfter(moment().subtract(CLICK_TIMEOUT, 's'))

    if (prevClickCount + 1 >= API_URL_OVERRIDE_MIN_CLICKS && clickedInTimeInterval) {
      const appSettings = new AppSettings()
      const apiUrlOverride = await appSettings.loadApiUrlOverride()
      const newApiUrl = !apiUrlOverride || apiUrlOverride === cmsUrl ? switchCmsUrl : cmsUrl
      await appSettings.setApiUrlOverride(newApiUrl)
      this.setState({
        clickCount: 0,
        clickStart: null
      })
      this.props.clearResourcesAndCache()
      console.debug(`Switching to new API-Url: ${newApiUrl}`)
    } else {
      const newClickStart = clickedInTimeInterval ? clickStart : moment()
      const newClickCount = clickedInTimeInterval ? prevClickCount + 1 : 1
      this.setState({
        clickCount: newClickCount,
        clickStart: newClickStart
      })
    }
  }

  resetApiUrl = async (): Promise<void> => {
    const appSettings = new AppSettings()
    await appSettings.setApiUrlOverride(buildConfig().cmsUrl)
    this.setState({
      clickCount: 0
    })
    this.props.clearResourcesAndCache()
  }

  renderApiUrlText = (): ReactNode => {
    const theme = this.props.theme
    const apiUrlOverride = this.state.apiUrlOverride

    if (apiUrlOverride && apiUrlOverride !== buildConfig().cmsUrl) {
      return (
        <>
          <ApiUrlText>{`Currently using API: ${apiUrlOverride.toString()}`}</ApiUrlText>
          <Button
            titleStyle={{
              color: theme.colors.textColor
            }}
            buttonStyle={{
              backgroundColor: theme.colors.themeColor,
              marginTop: 10
            }}
            onPress={this.resetApiUrl}
            title='Switch back to default API'
          />
        </>
      )
    }
  }

  render(): ReactNode {
    const locationMarker = buildConfigAssets().locationMarker
    if (!locationMarker) {
      return null
    }

    return (
      <>
        <TouchableOpacity activeOpacity={1} onPress={this.onImagePress}>
          <LocationImage source={locationMarker} />
        </TouchableOpacity>
        {this.renderApiUrlText()}
      </>
    )
  }
}

export default EastereggImage
