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

type StateType = {|
  proposeNearbyCities: ?boolean,
  longitude: ?number,
  latitude: ?number,
  locationMessage: ?string
|}

class Landing extends React.Component<PropsType, StateType> {
  constructor (props: PropsType) {
    super(props)
    this.state = { proposeNearbyCities: null, latitude: null, longitude: null, locationMessage: null }
  }

  componentDidMount () {
    this.initializeProposeCities()
  }

  initializeProposeCities = async () => {
    const appSettings = new AppSettings()
    const { proposeNearbyCities } = await appSettings.loadSettings()
    this.setState({ proposeNearbyCities: proposeNearbyCities })

    if (proposeNearbyCities) {
      Geolocation.getCurrentPosition(
        (position: GeolocationResponse) => {
          this.setState({
            longitude: position.coords.longitude,
            latitude: position.coords.latitude
          })
        },
        (error: GeolocationError) => this.setLocationErrorMessage(error)
        ,
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 3600000 }
      )
    }
  }

  setLocationErrorMessage = (error: GeolocationError) => {
    const { t } = this.props
    if (error.code === 1) {
      this.setState({ locationMessage: t('noPermission') })
    } else if (error.code === 2) {
      this.setState({ locationMessage: t('notAvailable') })
    } else {
      this.setState({ locationMessage: t('timeout') })
    }
  }

  navigateToDashboard = (cityModel: CityModel) => {
    const { navigateToDashboard, language } = this.props
    navigateToDashboard(cityModel.code, language)
  }

  render () {
    const { theme, cities, t, clearResourcesAndCache } = this.props

    return <Wrapper theme={theme}>
      <Heading clearResourcesAndCache={clearResourcesAndCache} theme={theme} />
      <FilterableCitySelector theme={theme} cities={cities} t={t} {...this.state}
                              navigateToDashboard={this.navigateToDashboard} />
    </Wrapper>
  }
}

export default Landing
