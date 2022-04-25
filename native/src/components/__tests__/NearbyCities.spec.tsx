import Geolocation from '@react-native-community/geolocation'
import { fireEvent, waitFor } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'
import { openSettings, RESULTS } from 'react-native-permissions'

import CityModelBuilder from 'api-client/src/testing/CityModelBuilder'

import render from '../../testing/render'
import { checkLocationPermission, requestLocationPermission } from '../../utils/LocationPermissionManager'
import NearbyCities from '../NearbyCities'

jest.mock('react-native-system-setting', () => undefined)
jest.mock('../../utils/LocationPermissionManager', () => ({
  checkLocationPermission: jest.fn(),
  requestLocationPermission: jest.fn()
}))
jest.mock('react-native-permissions', () => require('react-native-permissions/mock'))

jest.mock('@react-native-community/geolocation')

const mockCheckLocationPermission = mocked(checkLocationPermission)
const mockRequestLocationPermission = mocked(requestLocationPermission)
const mockGetCurrentPosition = mocked(Geolocation.getCurrentPosition)

describe('NearbyCities', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const augsburgCoordinates = {
    coords: {
      latitude: 48.369696,
      longitude: 10.892578,
      altitude: null,
      accuracy: 1,
      altitudeAccuracy: null,
      heading: null,
      speed: null
    },
    timestamp: 1234566789
  }

  const cities = new CityModelBuilder(5).build()
  const navigateToDashboard = jest.fn(key => key)
  const filterText = ''

  const renderNearbyCities = () =>
    render(<NearbyCities cities={cities} navigateToDashboard={navigateToDashboard} filterText={filterText} />)

  it('should not request location permission on mount', async () => {
    mockCheckLocationPermission.mockImplementationOnce(async () => RESULTS.BLOCKED)
    const { getByText } = renderNearbyCities()
    await waitFor(() => expect(getByText('noPermission')).toBeTruthy())
    expect(mockCheckLocationPermission).toHaveBeenCalled()
    expect(mockRequestLocationPermission).not.toHaveBeenCalled()
    expect(openSettings).not.toHaveBeenCalled()
    expect(mockGetCurrentPosition).not.toHaveBeenCalled()
  })

  it('should determine location and show nearby locations on mount if permission already granted', async () => {
    mockCheckLocationPermission.mockImplementationOnce(async () => RESULTS.GRANTED)
    mockGetCurrentPosition.mockImplementationOnce(setPosition => setPosition(augsburgCoordinates))
    const { queryByText, getByText } = renderNearbyCities()
    await waitFor(() => expect(getByText('Stadt Augsburg')).toBeTruthy())
    expect(queryByText('noPermission')).toBeFalsy()
    expect(mockCheckLocationPermission).toHaveBeenCalled()
    expect(mockRequestLocationPermission).not.toHaveBeenCalled()
    expect(openSettings).not.toHaveBeenCalled()
    expect(mockGetCurrentPosition).toHaveBeenCalledTimes(1)
  })

  it('should determine location and show no nearby locations if there are none', async () => {
    mockCheckLocationPermission.mockImplementationOnce(async () => RESULTS.GRANTED)
    mockGetCurrentPosition.mockImplementationOnce(setPosition =>
      setPosition({
        ...augsburgCoordinates,
        coords: {
          ...augsburgCoordinates.coords,
          longitude: 0,
          latitude: 0
        }
      })
    )
    const { queryByText, getByText } = renderNearbyCities()
    await waitFor(() => expect(getByText('noNearbyCities')).toBeTruthy())
    expect(queryByText('Stadt Augsburg')).toBeFalsy()
    expect(queryByText('noPermission')).toBeFalsy()
    expect(mockCheckLocationPermission).toHaveBeenCalled()
    expect(mockRequestLocationPermission).not.toHaveBeenCalled()
    expect(openSettings).not.toHaveBeenCalled()
    expect(mockGetCurrentPosition).toHaveBeenCalledTimes(1)
  })

  it('should open settings if permission is blocked on retry clicked', async () => {
    mockCheckLocationPermission.mockImplementation(async () => RESULTS.BLOCKED)
    const { getByText, getByA11yLabel } = renderNearbyCities()
    await waitFor(() => expect(getByText('noPermission')).toBeTruthy())
    expect(mockCheckLocationPermission).toHaveBeenCalledTimes(1)
    expect(openSettings).not.toHaveBeenCalled()
    const retryDetermineLocationButton = getByA11yLabel('refresh')
    fireEvent.press(retryDetermineLocationButton)
    expect(getByText('loading')).toBeTruthy()
    await waitFor(() => expect(getByText('noPermission')).toBeTruthy())
    await waitFor(() => expect(openSettings).toHaveBeenCalled())
    expect(mockCheckLocationPermission).toHaveBeenCalledTimes(2)
    expect(mockRequestLocationPermission).toHaveBeenCalled()
    expect(mockGetCurrentPosition).not.toHaveBeenCalled()
  })

  it('should determine location if permission is granted on retry click', async () => {
    mockCheckLocationPermission.mockImplementationOnce(async () => RESULTS.BLOCKED)
    mockGetCurrentPosition.mockImplementationOnce(setPosition => setPosition(augsburgCoordinates))
    const { queryByText, getByText, getByA11yLabel } = renderNearbyCities()
    await waitFor(() => expect(getByText('noPermission')).toBeTruthy())
    expect(mockCheckLocationPermission).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(queryByText('Stadt Augsburg')).toBeFalsy())
    mockCheckLocationPermission.mockImplementationOnce(async () => RESULTS.GRANTED)
    const retryDetermineLocationButton = getByA11yLabel('refresh')
    fireEvent.press(retryDetermineLocationButton)
    expect(getByText('loading')).toBeTruthy()
    await waitFor(() => expect(getByText('Stadt Augsburg')).toBeTruthy())
    expect(mockCheckLocationPermission).toHaveBeenCalledTimes(2)
    expect(mockRequestLocationPermission).not.toHaveBeenCalled()
    expect(mockGetCurrentPosition).toHaveBeenCalledTimes(1)
    expect(openSettings).not.toHaveBeenCalled()
  })

  it('should request permission and determine location on retry if not granted yet', async () => {
    mockCheckLocationPermission.mockImplementation(async () => RESULTS.DENIED)
    mockRequestLocationPermission.mockImplementation(async () => RESULTS.GRANTED)
    mockGetCurrentPosition.mockImplementationOnce(setPosition => setPosition(augsburgCoordinates))
    const { queryByText, getByText, getByA11yLabel } = renderNearbyCities()
    await waitFor(() => expect(getByText('noPermission')).toBeTruthy())
    expect(mockCheckLocationPermission).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(queryByText('Stadt Augsburg')).toBeFalsy())
    const retryDetermineLocationButton = getByA11yLabel('refresh')
    fireEvent.press(retryDetermineLocationButton)
    expect(getByText('loading')).toBeTruthy()
    await waitFor(() => expect(getByText('Stadt Augsburg')).toBeTruthy())
    expect(mockCheckLocationPermission).toHaveBeenCalledTimes(2)
    expect(mockRequestLocationPermission).toHaveBeenCalledTimes(1)
    expect(mockGetCurrentPosition).toHaveBeenCalledTimes(1)
    expect(openSettings).not.toHaveBeenCalled()

    expect(navigateToDashboard).not.toHaveBeenCalled()
    fireEvent.press(getByText('Stadt Augsburg'))
    expect(navigateToDashboard).toHaveBeenCalledTimes(1)
    expect(navigateToDashboard).toHaveBeenCalledWith(cities[0])
  })
})
