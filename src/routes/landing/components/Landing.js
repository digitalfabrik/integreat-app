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
    this.state = { proposeNearbyCities: null, location: { message: props.t('loading') } }
  }

  componentDidMount () {
    this.initializeProposeCities()
  }

  initializeProposeCities = async () => {
    const appSettings = new AppSettings()
    const { proposeNearbyCities } = await appSettings.loadSettings()
    this.setState({ proposeNearbyCities: proposeNearbyCities })

    if (proposeNearbyCities) {
      this.currentPosition()
    }
  }

  currentPosition = () => {
    Geolocation.getCurrentPosition(
      (position: GeolocationResponse) => {
        this.setState({ location: {
          longitude: position.coords.longitude,
          latitude: position.coords.latitude
        } })
      },
      (error: GeolocationError) => this.setLocationErrorMessage(error)
      ,
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 3600000 }
    )
  }

  setLocationErrorMessage = (error: GeolocationError) => {
    const { t } = this.props
    if (error.code === 1) {
      this.setState({ location: { message: t('noPermission') } })
    } else if (error.code === 2) {
      this.setState({ location: { message: t('notAvailable') } })
    } else {
      this.setState({ location: { message: t('timeout') } })
    }
  }

  navigateToDashboard = (cityModel: CityModel) => {
    const { navigateToDashboard, language } = this.props
    navigateToDashboard(cityModel.code, language)
  }

  render () {
    const { theme, cities, t, clearResourcesAndCache } = this.props
    const { proposeNearbyCities } = this.state

    if (proposeNearbyCities !== null) {
      return <Wrapper theme={theme}>
        <Heading clearResourcesAndCache={clearResourcesAndCache} theme={theme} />
        {/* $FlowFixMe Flow does not get that proposeNearbyCities is null */}
        <FilterableCitySelector theme={theme} cities={cities} t={t} {...this.state} tryAgain={this.currentPosition}
                                navigateToDashboard={this.navigateToDashboard} />
      </Wrapper>
    } else {
      return null
    }
  }
}

export default Landing
