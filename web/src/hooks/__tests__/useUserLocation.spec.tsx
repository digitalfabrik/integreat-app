import { render, waitFor } from '@testing-library/react'
import React from 'react'

import useUserLocation from '../useUserLocation'

jest.mock('../useUserLocation', () => ({
  __esModule: true,
  default: jest.fn(),
  getUserLocation: jest.fn(),
}))

const TestComponent = () => {
  const { data } = useUserLocation()
  return <div>{data?.coordinates?.join(',') ?? 'null'}</div>
}

describe('useUserLocation', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should show coordinates when available', async () => {
    ;(useUserLocation as jest.Mock).mockReturnValue({
      data: {
        status: 'ready',
        coordinates: [10.8, 48.3],
        message: 'ready',
      },
    })

    const { getByText } = render(<TestComponent />)
    await waitFor(() => {
      expect(getByText('10.8,48.3')).toBeInTheDocument()
    })
  })

  it('should show null when unavailable', async () => {
    ;(useUserLocation as jest.Mock).mockReturnValue({
      data: {
        status: 'unavailable',
        message: 'noPermission',
        coordinates: undefined,
      },
    })

    const { getByText } = render(<TestComponent />)
    await waitFor(() => {
      expect(getByText('null')).toBeInTheDocument()
    })
  })
})
