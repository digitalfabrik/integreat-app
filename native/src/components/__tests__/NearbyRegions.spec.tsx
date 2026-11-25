import Geolocation from '@react-native-community/geolocation'
import { act, fireEvent, userEvent, waitFor } from '@testing-library/react-native'
import React from 'react'
import { check, PermissionStatus, request, RESULTS } from 'react-native-permissions'

import { RegionModelBuilder } from 'shared/api'

import useSnackbar from '../../hooks/useSnackbar'
import render from '../../testing/render'
import NearbyRegions from '../NearbyRegions'

jest.mock('@react-native-community/geolocation')
jest.mock('../../hooks/useSnackbar')

const { mocked } = jest
const mockCheckPermission = mocked(check)
const mockRequestPermission = mocked(request)
const mockGetCurrentPosition = mocked(Geolocation.getCurrentPosition)

describe('NearbyRegions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const showSnackbar = jest.fn()
  mocked(useSnackbar).mockImplementation(() => showSnackbar)
  const user = userEvent.setup()

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

  const regions = new RegionModelBuilder(5).build()
  const navigateToDashboard = jest.fn(key => key)
  const filterText = ''

  const renderNearbyRegions = () =>
    render(<NearbyRegions regions={regions} navigateToDashboard={navigateToDashboard} filterText={filterText} />)

  it('should not request location permission on mount', async () => {
    mockCheckPermission.mockImplementationOnce(async () => RESULTS.BLOCKED)
    const { getByText } = await renderNearbyRegions()
    await waitFor(() => expect(getByText('userLocation:noPermission')).toBeTruthy())
    expect(mockCheckPermission).toHaveBeenCalled()
    expect(mockRequestPermission).not.toHaveBeenCalled()
    expect(showSnackbar).not.toHaveBeenCalled()
    expect(mockGetCurrentPosition).not.toHaveBeenCalled()
  })

  it('should determine location and show nearby locations on mount if permission already granted', async () => {
    mockCheckPermission.mockImplementationOnce(async () => RESULTS.GRANTED)
    mockGetCurrentPosition.mockImplementationOnce(setPosition => setPosition(augsburgCoordinates))
    const { queryByText, getByText } = await renderNearbyRegions()
    await waitFor(() => expect(getByText('Stadt Augsburg')).toBeTruthy())
    expect(queryByText('userLocation:noPermission')).toBeFalsy()
    expect(mockCheckPermission).toHaveBeenCalled()
    expect(mockRequestPermission).not.toHaveBeenCalled()
    expect(showSnackbar).not.toHaveBeenCalled()
    expect(mockGetCurrentPosition).toHaveBeenCalledTimes(1)
  })

  it('should determine location and show no nearby locations if there are none', async () => {
    mockCheckPermission.mockImplementationOnce(async () => RESULTS.GRANTED)
    mockGetCurrentPosition.mockImplementationOnce(setPosition =>
      setPosition({
        ...augsburgCoordinates,
        coords: {
          ...augsburgCoordinates.coords,
          longitude: 0,
          latitude: 0,
        },
      }),
    )
    const { queryByText, getByText } = await renderNearbyRegions()
    await waitFor(() => expect(getByText('regions:nearby.nothingFound')).toBeTruthy())
    expect(queryByText('Stadt Augsburg')).toBeFalsy()
    expect(queryByText('userLocation:noPermission')).toBeFalsy()
    expect(mockCheckPermission).toHaveBeenCalled()
    expect(mockRequestPermission).not.toHaveBeenCalled()
    expect(showSnackbar).not.toHaveBeenCalled()
    expect(mockGetCurrentPosition).toHaveBeenCalledTimes(1)
  })

  it('should show snackbar if permission is blocked on retry clicked', async () => {
    mockCheckPermission.mockImplementation(async () => RESULTS.BLOCKED)
    let resolveRequest: (status: PermissionStatus) => void = () => undefined
    mockRequestPermission.mockImplementationOnce(
      () =>
        new Promise(resolve => {
          resolveRequest = resolve
        }),
    )
    const { getByText, getByLabelText } = await renderNearbyRegions()
    await waitFor(() => expect(getByText('userLocation:noPermission')).toBeTruthy())
    expect(mockCheckPermission).toHaveBeenCalledTimes(1)
    expect(showSnackbar).not.toHaveBeenCalled()
    const retryDetermineLocationButton = getByLabelText('regions:nearby.refresh')
    await user.press(retryDetermineLocationButton)
    expect(getByText('userLocation:loading')).toBeTruthy()
    await act(() => resolveRequest(RESULTS.BLOCKED))
    await waitFor(() => expect(getByText('userLocation:noPermission')).toBeTruthy())
    await waitFor(() => expect(showSnackbar).toHaveBeenCalled())
    expect(mockCheckPermission).toHaveBeenCalledTimes(1)
    expect(mockRequestPermission).toHaveBeenCalledTimes(1)
    expect(mockGetCurrentPosition).not.toHaveBeenCalled()
  })

  it('should determine location if permission is granted on retry click', async () => {
    mockCheckPermission.mockImplementationOnce(async () => RESULTS.BLOCKED)
    let resolveRequest: (status: PermissionStatus) => void = () => undefined
    mockRequestPermission.mockImplementationOnce(
      () =>
        new Promise(resolve => {
          resolveRequest = resolve
        }),
    )
    mockGetCurrentPosition.mockImplementationOnce(setPosition => setPosition(augsburgCoordinates))
    const { queryByText, getByText, getByLabelText } = await renderNearbyRegions()
    await waitFor(() => expect(getByText('userLocation:noPermission')).toBeTruthy())
    expect(mockCheckPermission).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(queryByText('Stadt Augsburg')).toBeFalsy())
    const retryDetermineLocationButton = getByLabelText('regions:nearby.refresh')
    await user.press(retryDetermineLocationButton)
    expect(getByText('userLocation:loading')).toBeTruthy()
    await act(() => resolveRequest(RESULTS.GRANTED))
    await waitFor(() => expect(getByText('Stadt Augsburg')).toBeTruthy())
    expect(mockCheckPermission).toHaveBeenCalledTimes(1)
    expect(mockRequestPermission).toHaveBeenCalledTimes(1)
    expect(mockGetCurrentPosition).toHaveBeenCalledTimes(1)
    expect(showSnackbar).not.toHaveBeenCalled()
  })

  it('should request permission and determine location on retry if not granted yet', async () => {
    mockCheckPermission.mockImplementation(async () => RESULTS.BLOCKED)
    let resolveRequest: (status: PermissionStatus) => void = () => undefined
    mockRequestPermission.mockImplementationOnce(
      () =>
        new Promise(resolve => {
          resolveRequest = resolve
        }),
    )
    mockGetCurrentPosition.mockImplementationOnce(setPosition => setPosition(augsburgCoordinates))
    const { queryByText, getByText, getByLabelText } = await renderNearbyRegions()
    await waitFor(() => expect(getByText('userLocation:noPermission')).toBeTruthy())
    expect(mockCheckPermission).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(queryByText('Stadt Augsburg')).toBeFalsy())
    const retryDetermineLocationButton = getByLabelText('regions:nearby.refresh')
    await user.press(retryDetermineLocationButton)
    expect(getByText('userLocation:loading')).toBeTruthy()
    await act(() => resolveRequest(RESULTS.GRANTED))
    await waitFor(() => expect(getByText('Stadt Augsburg')).toBeTruthy())
    expect(mockCheckPermission).toHaveBeenCalledTimes(1)
    expect(mockRequestPermission).toHaveBeenCalledTimes(1)
    expect(mockGetCurrentPosition).toHaveBeenCalledTimes(1)
    expect(showSnackbar).not.toHaveBeenCalled()

    expect(navigateToDashboard).not.toHaveBeenCalled()
    await fireEvent.press(getByText('Stadt Augsburg'))
    expect(navigateToDashboard).toHaveBeenCalledTimes(1)
    expect(navigateToDashboard).toHaveBeenCalledWith(regions[0])
  })
})
