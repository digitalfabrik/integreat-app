import { render } from '@testing-library/react'
import React, { ReactElement } from 'react'

import { mockLongitude, mockLatitude, mockGeolocationSuccess, mockGeolocationError } from '../../__mocks__/geoLocation'
import { useUserLocation } from '../useUserLocation'

describe('useUserLocation', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const MockComponent = (): ReactElement => {
    const { userCoordinates, locationState } = useUserLocation()

    return (
      <div>
        {userCoordinates && (
          <>
            <span>{userCoordinates[0]}</span>
            <span>{userCoordinates[1]}</span>
          </>
        )}
        <span>{locationState.status}</span>
      </div>
    )
  }

  it('should correctly receive userCoordinates properties', () => {
    // @ts-expect-error -- ignore readOnly var
    navigator.geolocation = mockGeolocationSuccess
    const { getByText } = render(<MockComponent />)
    expect(getByText(mockLongitude)).toBeTruthy()
    expect(getByText(mockLatitude)).toBeTruthy()
    expect(getByText('ready')).toBeTruthy()
  })
  it('should not receive userCoordinates', () => {
    // @ts-expect-error -- ignore readOnly var
    navigator.geolocation = mockGeolocationError
    const { queryByText, getByText } = render(<MockComponent />)
    expect(queryByText(mockLongitude)).toBeNull()
    expect(queryByText(mockLatitude)).toBeNull()
    expect(getByText('unavailable')).toBeTruthy()
  })
})
