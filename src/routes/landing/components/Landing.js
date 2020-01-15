// @flow

import * as React from 'react'
import { CityModel } from '@integreat-app/integreat-api-client'
import { View } from 'react-native'
import Heading from '../components/Heading'
import styled, { type StyledComponent } from 'styled-components/native'
import FilterableCitySelector from '../components/FilterableCitySelector'
import type { TFunction } from 'react-i18next'
import type { ThemeType } from '../../../modules/theme/constants/theme'
import AppSettings from '../../../modules/settings/AppSettings'
import Geolocation, { GeolocationError, GeolocationResponse } from '@react-native-community/geolocation'

const Wrapper: StyledComponent<{}, ThemeType, *> = styled(View)`
  background-color: ${props => props.theme.colors.backgroundColor};
  padding: 20px;
  align-items: center;
`

export type PropsType = {|
  cities: Array<CityModel>,
  language: string,
  t: TFunction,
  theme: ThemeType,
  navigateToDashboard: (cityCode: string, language: string) => void,
  clearResourcesAndCache: () => void
|}

export type LocationType = {| message: string |} | {|
  longitude: number,
  latitude: number
|}

type StateType = {|
  proposeNearbyCities: boolean | null,
  location: LocationType
|}

class Landing extends React.Component<PropsType, StateType> {
  constructor (props: PropsType) {
    super(props)
    this.state = { proposeNearbyCities: null, location: { message: 'loading' } }
  }

  componentDidMount () {
    this.initializeProposeCities()
  }

  initializeProposeCities = async () => {
    const appSettings = new AppSettings()
    const { proposeNearbyCities } = await appSettings.loadSettings()
    this.setState({ proposeNearbyCities: proposeNearbyCities })

    if (proposeNearbyCities) {
      this.determineCurrentPosition()
    }
  }

  determineCurrentPosition = () => {
    this.setState({ location: { message: 'loading' } })
    Geolocation.getCurrentPosition(
      (position: GeolocationResponse) => {
        this.setState({ location: {
          longitude: position.coords.longitude,
          latitude: position.coords.latitude
        } })
      },
      (error: GeolocationError) => this.setLocationErrorMessage(error)
      ,
      { enableHighAccuracy: true, timeout: 50000, maximumAge: 3600000 }
    )
  }

  setLocationErrorMessage = (error: GeolocationError) => {
    if (error.code === 1) {
      this.setState({ location: { message: 'noPermission' } })
    } else if (error.code === 2) {
      this.setState({ location: { message: 'notAvailable' } })
    } else {
      this.setState({ location: { message: 'timeout' } })
    }
  }

  navigateToDashboard = (cityModel: CityModel) => {
    const { navigateToDashboard, language } = this.props
    navigateToDashboard(cityModel.code, language)
  }

  render () {
    const { theme, cities, t, clearResourcesAndCache } = this.props
    const { proposeNearbyCities, ...state } = this.state
    const tryAgain = this.state.location.message === 'loading' ? null : this.determineCurrentPosition

    if (proposeNearbyCities !== null) {
      return <Wrapper theme={theme}>
        <Heading clearResourcesAndCache={clearResourcesAndCache} theme={theme} />
        <FilterableCitySelector theme={theme} cities={cities} t={t} {...state} proposeNearbyCities={proposeNearbyCities}
                                tryAgain={tryAgain} navigateToDashboard={this.navigateToDashboard} />
      </Wrapper>
    } else {
      return null
    }
  }
}

export default Landing
