import * as React from 'react'
import { CityModel } from 'api-client'
import { View } from 'react-native'
import Heading from '../components/Heading'
import styled from 'styled-components/native'
import FilterableCitySelector from '../components/FilterableCitySelector'
import { TFunction } from 'react-i18next'
import { ThemeType } from 'build-configs'
import Geolocation, { GeolocationError, GeolocationResponse } from '@react-native-community/geolocation'
import { checkLocationPermission, requestLocationPermission } from '../utils/LocationPermissionManager'
import { openSettings, RESULTS } from 'react-native-permissions'
import testID from '../testing/testID'
import { ReactNode } from 'react'

const Wrapper = styled(View)`
  background-color: ${props => props.theme.colors.backgroundColor};
  padding: 20px;
  align-items: center;
  flex-grow: 1;
`

export type PropsType = {
  cities: Array<CityModel>
  language: string
  t: TFunction
  theme: ThemeType
  navigateToDashboard: (cityCode: string, language: string) => void
  clearResourcesAndCache: () => void
}
export type LocationType =
  | {
      status: 'unavailable'
      message: string
    }
  | {
      status: 'ready'
      longitude: number
      latitude: number
    }
  | null
type StateType = {
  location: LocationType
}

class Landing extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props)
    this.state = {
      location: null
    }
  }

  componentDidMount(): void {
    this.determineLocationIfGranted()
  }

  determineLocationIfGranted = async (): Promise<void> => {
    const locationPermissionStatus = await checkLocationPermission()

    if (locationPermissionStatus === RESULTS.GRANTED) {
      this.setState({
        location: {
          message: 'loading',
          status: 'unavailable'
        }
      })
      this.determineLocation()
    } else {
      this.setState({
        location: {
          status: 'unavailable',
          message: 'noPermission'
        }
      })
    }
  }

  requestAndDetermineLocation = async (): Promise<void> => {
    this.setState({
      location: {
        message: 'loading',
        status: 'unavailable'
      }
    })
    const locationPermissionStatus = await checkLocationPermission()

    if (locationPermissionStatus === RESULTS.BLOCKED) {
      openSettings()
      this.setState({
        location: {
          message: 'noPermission',
          status: 'unavailable'
        }
      })
    } else if (locationPermissionStatus === RESULTS.GRANTED) {
      this.determineLocation()
    } else {
      if ((await requestLocationPermission()) === RESULTS.GRANTED) {
        this.determineLocation()
      } else {
        this.setState({
          location: {
            message: 'noPermission',
            status: 'unavailable'
          }
        })
      }
    }
  }

  determineLocation = (): void => {
    Geolocation.getCurrentPosition(
      (position: GeolocationResponse) => {
        this.setState({
          location: {
            status: 'ready',
            longitude: position.coords.longitude,
            latitude: position.coords.latitude
          }
        })
      },
      (error: GeolocationError) => this.setLocationErrorMessage(error),
      {
        enableHighAccuracy: true,
        timeout: 50000,
        maximumAge: 3600000
      }
    )
  }

  setLocationErrorMessage = (error: GeolocationError): void => {
    if (error.code === 1) {
      this.setState({
        location: {
          status: 'unavailable',
          message: 'noPermission'
        }
      })
    } else if (error.code === 2) {
      this.setState({
        location: {
          status: 'unavailable',
          message: 'notAvailable'
        }
      })
    } else {
      this.setState({
        location: {
          status: 'unavailable',
          message: 'timeout'
        }
      })
    }
  }

  navigateToDashboard = (cityModel: CityModel): void => {
    const { navigateToDashboard, language } = this.props
    navigateToDashboard(cityModel.code, language)
  }

  render(): ReactNode {
    const { theme, cities, t, clearResourcesAndCache } = this.props
    const { location } = this.state
    const retryDetermineLocation =
      location?.status === 'unavailable' && location.message === 'loading' ? null : this.requestAndDetermineLocation
    return (
      <Wrapper {...testID('Landing-Page')}>
        <Heading clearResourcesAndCache={clearResourcesAndCache} theme={theme} />
        <FilterableCitySelector
          theme={theme}
          cities={cities}
          t={t}
          location={location}
          retryDetermineLocation={retryDetermineLocation}
          navigateToDashboard={this.navigateToDashboard}
        />
      </Wrapper>
    )
  }
}

export default Landing
