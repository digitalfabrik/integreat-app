import Geolocation, { GeolocationError, GeolocationResponse } from '@react-native-community/geolocation'
import { fireEvent, waitFor } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'
import { Button, View } from 'react-native'
import { check, openSettings, PERMISSIONS, request, RESULTS } from 'react-native-permissions'

import Text from '../../components/base/Text'
import render from '../../testing/render'
import useSnackbar from '../useSnackbar'
import useUserLocation from '../useUserLocation'

const augsburgCoordinates = {
  coords: {
    latitude: 48.369696,
    longitude: 10.892578,
    altitude: null,
    accuracy: 1,
    altitudeAccuracy: null,
    heading: null,
    speed: null,
  },
  timestamp: 1234566789,
}

jest.mock('@react-native-community/geolocation', () => ({
  getCurrentPosition: jest.fn((setPosition: (position: GeolocationResponse) => void) =>
    setPosition(augsburgCoordinates),
  ),
}))
jest.mock('react-i18next')
jest.mock('../../hooks/useSnackbar')

const mockCheckPermission = mocked(check)
const mockRequestPermission = mocked(request)
const mockGetCurrentPosition = mocked(Geolocation.getCurrentPosition)

describe('useUserLocation', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const showSnackbar = jest.fn()
  mocked(useSnackbar).mockImplementation(() => showSnackbar)

  const MockComponent = ({ requestPermissionInitially = false }: { requestPermissionInitially: boolean }) => {
    const { message, coordinates, refreshPermissionAndLocation } = useUserLocation({ requestPermissionInitially })
    return (
      <View>
        <Text>{message}</Text>
        <Text>longitude: {coordinates?.[0]}</Text>
        <Text>latitude: {coordinates?.[1]}</Text>
        <Button title='refresh w. request and snackbar' onPress={() => refreshPermissionAndLocation()} />
        <Button
          title='refresh w. request'
          onPress={() => refreshPermissionAndLocation({ showSnackbarIfBlocked: false })}
        />
        <Button
          title='refresh'
          onPress={() => {
            refreshPermissionAndLocation({ requestPermission: false, showSnackbarIfBlocked: false })
          }}
        />
      </View>
    )
  }

  const renderMockComponent = (requestPermissionInitially = false) =>
    render(<MockComponent requestPermissionInitially={requestPermissionInitially} />)

  it('should request permissions initially and get current position', async () => {
    mockRequestPermission.mockImplementationOnce(async () => RESULTS.GRANTED)
    const { getByText } = renderMockComponent(true)
    await waitFor(() => expect(getByText(`longitude: ${augsburgCoordinates.coords.longitude}`)).toBeTruthy())
    expect(getByText(`latitude: ${augsburgCoordinates.coords.latitude}`)).toBeTruthy()
    expect(mockRequestPermission).toHaveBeenCalledTimes(1)
    expect(mockRequestPermission).toHaveBeenCalledWith(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
    expect(mockGetCurrentPosition).toHaveBeenCalledTimes(1)
    expect(mockCheckPermission).not.toHaveBeenCalled()
  })

  it('should request permissions initially and not show snackbar if blocked', async () => {
    mockRequestPermission.mockImplementationOnce(async () => RESULTS.BLOCKED)
    const { getByText } = renderMockComponent(true)
    await waitFor(() => expect(getByText('noPermission')).toBeTruthy())
    expect(mockRequestPermission).toHaveBeenCalledTimes(1)
    expect(mockRequestPermission).toHaveBeenCalledWith(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
    expect(mockGetCurrentPosition).not.toHaveBeenCalled()
    expect(mockCheckPermission).not.toHaveBeenCalled()
    expect(showSnackbar).not.toHaveBeenCalled()
  })

  it('should only check permissions if requestPermissionInitially is set to false', async () => {
    mockCheckPermission.mockImplementationOnce(async () => RESULTS.BLOCKED)
    const { getByText } = renderMockComponent(false)
    await waitFor(() => expect(getByText('noPermission')).toBeTruthy())
    expect(mockCheckPermission).toHaveBeenCalledTimes(1)
    expect(mockCheckPermission).toHaveBeenCalledWith(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
    expect(mockGetCurrentPosition).not.toHaveBeenCalled()
    expect(mockRequestPermission).not.toHaveBeenCalled()
    expect(showSnackbar).not.toHaveBeenCalled()
  })

  it('should correctly handle errors during getCurrentPosition', async () => {
    mockRequestPermission.mockImplementationOnce(async () => RESULTS.GRANTED)
    mockGetCurrentPosition.mockImplementationOnce(
      (_: (position: GeolocationResponse) => void, setError: ((error: GeolocationError) => void) | undefined) =>
        setError &&
        setError({ code: 2, message: 'timeout', POSITION_UNAVAILABLE: 0, PERMISSION_DENIED: 1, TIMEOUT: 2 }),
    )
    const { getByText } = renderMockComponent(true)
    await waitFor(() => expect(getByText('timeout')).toBeTruthy())
    expect(mockRequestPermission).toHaveBeenCalledTimes(1)
    expect(mockRequestPermission).toHaveBeenCalledWith(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
    expect(mockGetCurrentPosition).toHaveBeenCalledTimes(1)
    expect(mockCheckPermission).not.toHaveBeenCalled()
  })

  it('should refresh current location', async () => {
    mockRequestPermission.mockImplementationOnce(async () => RESULTS.GRANTED)
    const { getByText } = renderMockComponent(true)
    await waitFor(() => expect(getByText(`longitude: ${augsburgCoordinates.coords.longitude}`)).toBeTruthy())
    expect(getByText(`latitude: ${augsburgCoordinates.coords.latitude}`)).toBeTruthy()

    mockGetCurrentPosition.mockImplementationOnce((setPosition: (position: GeolocationResponse) => void) =>
      setPosition({ ...augsburgCoordinates, coords: { ...augsburgCoordinates.coords, longitude: 0, latitude: 0 } }),
    )
    fireEvent.press(getByText('refresh'))

    await waitFor(() => expect(getByText(`longitude: 0`)).toBeTruthy())
    expect(getByText(`latitude: 0`)).toBeTruthy()

    mockGetCurrentPosition.mockImplementationOnce(
      (_: (position: GeolocationResponse) => void, setError: ((error: GeolocationError) => void) | undefined) =>
        setError &&
        setError({ code: 2, message: 'timeout', POSITION_UNAVAILABLE: 0, PERMISSION_DENIED: 1, TIMEOUT: 2 }),
    )
    fireEvent.press(getByText('refresh'))

    await waitFor(() => expect(getByText('timeout')).toBeTruthy())
  })

  it('should show snackbar if permission blocked', async () => {
    mockRequestPermission.mockImplementationOnce(async () => RESULTS.BLOCKED)
    const { getByText } = renderMockComponent(true)
    await waitFor(() => expect(getByText('noPermission')).toBeTruthy())

    mockRequestPermission.mockImplementationOnce(async () => RESULTS.BLOCKED)
    fireEvent.press(getByText('refresh w. request and snackbar'))
    expect(getByText('loading')).toBeTruthy()
    await waitFor(() => expect(getByText('noPermission')).toBeTruthy())

    expect(mockRequestPermission).toHaveBeenCalledTimes(2)
    expect(showSnackbar).toHaveBeenCalledTimes(1)
    expect(showSnackbar).toHaveBeenCalledWith({
      action: {
        label: 'layout:settings',
        onPress: openSettings,
      },
      text: 'landing:noPermission',
    })

    expect(mockGetCurrentPosition).not.toHaveBeenCalled()
    expect(mockCheckPermission).not.toHaveBeenCalled()
  })

  it('should not show snackbar if permission blocked', async () => {
    mockRequestPermission.mockImplementationOnce(async () => RESULTS.BLOCKED)
    const { getByText } = renderMockComponent(true)
    await waitFor(() => expect(getByText('noPermission')).toBeTruthy())

    mockRequestPermission.mockImplementationOnce(async () => RESULTS.BLOCKED)
    fireEvent.press(getByText('refresh w. request'))
    expect(getByText('loading')).toBeTruthy()
    await waitFor(() => expect(getByText('noPermission')).toBeTruthy())

    expect(mockRequestPermission).toHaveBeenCalledTimes(2)
    expect(showSnackbar).not.toHaveBeenCalled()
    expect(mockGetCurrentPosition).not.toHaveBeenCalled()
    expect(mockCheckPermission).not.toHaveBeenCalled()
  })

  it('should request permission if initially denied', async () => {
    mockCheckPermission.mockImplementationOnce(async () => RESULTS.DENIED)
    const { getByText } = renderMockComponent(false)
    await waitFor(() => expect(getByText('noPermission')).toBeTruthy())
    expect(mockCheckPermission).toHaveBeenCalledTimes(1)
    expect(mockRequestPermission).not.toHaveBeenCalled()

    mockRequestPermission.mockImplementationOnce(async () => RESULTS.GRANTED)
    fireEvent.press(getByText('refresh w. request'))

    await waitFor(() => expect(getByText(`longitude: ${augsburgCoordinates.coords.longitude}`)).toBeTruthy())
    expect(getByText(`latitude: ${augsburgCoordinates.coords.latitude}`)).toBeTruthy()
    expect(mockCheckPermission).toHaveBeenCalledTimes(1)
    expect(mockRequestPermission).toHaveBeenCalledTimes(1)
  })
})
