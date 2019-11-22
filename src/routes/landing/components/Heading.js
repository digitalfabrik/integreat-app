// @flow

import * as React from 'react'
import { TouchableOpacity } from 'react-native'
import LocationBig from '../assets/LocationBig.png'
import styled, { type StyledComponent } from 'styled-components/native'
import AppSettings from '../../../modules/settings/AppSettings'
import { liveBaseUrl, testBaseUrl } from '../../../modules/endpoint/constants'

const API_URL_OVERRIDE_MIN_CLICKS = 10

type StateType = {| clickCount: number |}

type PropsType = {| refresh: () => void |}

const LocationImage = styled.Image`
  height: 70px;
  resize-mode: contain;
`

const Wrapper: StyledComponent<{| children: React.Node |}, {}, *> = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
`

class Heading extends React.Component<PropsType, StateType> {
  constructor (props: PropsType) {
    super(props)
    this.state = { clickCount: 0 }
  }

  onImagePress = async () => {
    this.setState(previousState => ({ clickCount: previousState.clickCount + 1 }))
    if (this.state.clickCount >= API_URL_OVERRIDE_MIN_CLICKS) {
      console.log('Switching url')
      const appSettings = new AppSettings()
      const apiUrlOverride = await appSettings.loadApiUrlOverride()
      const newApiUrl = apiUrlOverride === testBaseUrl ? liveBaseUrl : testBaseUrl
      await appSettings.setApiUrlOverride(newApiUrl)
      this.setState({ clickCount: 0 })
      this.props.refresh()
    }
  }

  render () {
    return (
      <Wrapper>
        <TouchableOpacity activeOpacity={1} onPress={this.onImagePress}>
          <LocationImage source={LocationBig} />
        </TouchableOpacity>
      </Wrapper>
    )
  }
}

export default Heading
