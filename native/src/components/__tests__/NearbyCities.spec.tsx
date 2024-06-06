import Geolocation from '@react-native-community/geolocation'
import { fireEvent, waitFor } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'
import { check, request, RESULTS } from 'react-native-permissions'

import { CityModelBuilder } from 'shared/api'

import useSnackbar from '../../hooks/useSnackbar'
import render from '../../testing/render'
import NearbyCities from '../NearbyCities'

jest.mock('@react-native-community/geolocation')
jest.mock('react-i18next')
jest.mock('../../hooks/useSnackbar')

const mockCheckPermission = mocked(check)
const mockRequestPermission = mocked(request)
const mockGetCurrentPosition = mocked(Geolocation.getCurrentPosition)

describe('NearbyCities', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const showSnackbar = jest.fn()
  mocked(useSnackbar).mockImplementation(() => showSnackbar)

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

  const cities = new CityModelBuilder(5).build()
  const navigateToDashboard = jest.fn(key => key)
  const filterText = ''

  const renderNearbyCities = () =>
    render(<NearbyCities cities={cities} navigateToDashboard={navigateToDashboard} filterText={filterText} />)

  it('should not request location permission on mount', async () => {
    mockCheckPermission.mockImplementationOnce(async () => RESULTS.BLOCKED)
    const { getByText } = renderNearbyCities()
    await waitFor(() => expect(getByText('noPermission')).toBeTruthy())
    expect(mockCheckPermission).toHaveBeenCalled()
    expect(mockRequestPermission).not.toHaveBeenCalled()
    expect(showSnackbar).not.toHaveBeenCalled()
    expect(mockGetCurrentPosition).not.toHaveBeenCalled()
  })

  it('should determine location and show nearby locations on mount if permission already granted', async () => {
    mockCheckPermission.mockImplementationOnce(async () => RESULTS.GRANTED)
    mockGetCurrentPosition.mockImplementationOnce(setPosition => setPosition(augsburgCoordinates))
    const { queryByText, getByText } = renderNearbyCities()
    await waitFor(() => expect(getByText('Stadt Augsburg')).toBeTruthy())
    expect(queryByText('noPermission')).toBeFalsy()
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
    const { queryByText, getByText } = renderNearbyCities()
    await waitFor(() => expect(getByText('noNearbyCities')).toBeTruthy())
    expect(queryByText('Stadt Augsburg')).toBeFalsy()
    expect(queryByText('noPermission')).toBeFalsy()
    expect(mockCheckPermission).toHaveBeenCalled()
    expect(mockRequestPermission).not.toHaveBeenCalled()
    expect(showSnackbar).not.toHaveBeenCalled()
    expect(mockGetCurrentPosition).toHaveBeenCalledTimes(1)
  })

  it('should show snackbar if permission is blocked on retry clicked', async () => {
    mockCheckPermission.mockImplementation(async () => RESULTS.BLOCKED)
    mockRequestPermission.mockImplementation(async () => RESULTS.BLOCKED)
    const { getByText, getByLabelText } = renderNearbyCities()
    await waitFor(() => expect(getByText('noPermission')).toBeTruthy())
    expect(mockCheckPermission).toHaveBeenCalledTimes(1)
    expect(showSnackbar).not.toHaveBeenCalled()
    const retryDetermineLocationButton = getByLabelText('refresh')
    fireEvent.press(retryDetermineLocationButton)
    expect(getByText('loading')).toBeTruthy()
    await waitFor(() => expect(getByText('noPermission')).toBeTruthy())
    await waitFor(() => expect(showSnackbar).toHaveBeenCalled())
    expect(mockCheckPermission).toHaveBeenCalledTimes(1)
    expect(mockRequestPermission).toHaveBeenCalledTimes(1)
    expect(mockGetCurrentPosition).not.toHaveBeenCalled()
  })

  it('should determine location if permission is granted on retry click', async () => {
    mockCheckPermission.mockImplementationOnce(async () => RESULTS.BLOCKED)
    mockRequestPermission.mockImplementationOnce(async () => RESULTS.GRANTED)
    mockGetCurrentPosition.mockImplementationOnce(setPosition => setPosition(augsburgCoordinates))
    const { queryByText, getByText, getByLabelText } = renderNearbyCities()
    await waitFor(() => expect(getByText('noPermission')).toBeTruthy())
    expect(mockCheckPermission).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(queryByText('Stadt Augsburg')).toBeFalsy())
    const retryDetermineLocationButton = getByLabelText('refresh')
    fireEvent.press(retryDetermineLocationButton)
    expect(getByText('loading')).toBeTruthy()
    await waitFor(() => expect(getByText('Stadt Augsburg')).toBeTruthy())
    expect(mockCheckPermission).toHaveBeenCalledTimes(1)
    expect(mockRequestPermission).toHaveBeenCalledTimes(1)
    expect(mockGetCurrentPosition).toHaveBeenCalledTimes(1)
    expect(showSnackbar).not.toHaveBeenCalled()
  })

  it('should request permission and determine location on retry if not granted yet', async () => {
    mockCheckPermission.mockImplementation(async () => RESULTS.BLOCKED)
    mockRequestPermission.mockImplementation(async () => RESULTS.GRANTED)
    mockGetCurrentPosition.mockImplementationOnce(setPosition => setPosition(augsburgCoordinates))
    const { queryByText, getByText, getByLabelText } = renderNearbyCities()
    await waitFor(() => expect(getByText('noPermission')).toBeTruthy())
    expect(mockCheckPermission).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(queryByText('Stadt Augsburg')).toBeFalsy())
    const retryDetermineLocationButton = getByLabelText('refresh')
    fireEvent.press(retryDetermineLocationButton)
    expect(getByText('loading')).toBeTruthy()
    await waitFor(() => expect(getByText('Stadt Augsburg')).toBeTruthy())
    expect(mockCheckPermission).toHaveBeenCalledTimes(1)
    expect(mockRequestPermission).toHaveBeenCalledTimes(1)
    expect(mockGetCurrentPosition).toHaveBeenCalledTimes(1)
    expect(showSnackbar).not.toHaveBeenCalled()

    expect(navigateToDashboard).not.toHaveBeenCalled()
    fireEvent.press(getByText('Stadt Augsburg'))
    expect(navigateToDashboard).toHaveBeenCalledTimes(1)
    expect(navigateToDashboard).toHaveBeenCalledWith(cities[0])
  })
})
