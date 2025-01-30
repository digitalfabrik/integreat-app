import { render, waitFor, screen, fireEvent } from '@testing-library/react'
import { mocked } from 'jest-mock'
import React from 'react'

import useUserLocation from '../useUserLocation'

jest.mock('../useUserLocation', () => ({
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('shared/api', () => ({
  ...jest.requireActual('shared/api'),
  useLoadFromEndpoint: jest.fn(),
  useLoadAsync: jest.fn(() => ({ data: null, error: null })),
}))

const MockComponent = () => {
  const { data, refresh } = useUserLocation()
  return (
    <div>
      <div data-testid='coords'>{data?.coordinates ? data.coordinates.join(',') : 'no coords'}</div>
      <button type='button' onClick={refresh}>
        refresh
      </button>
    </div>
  )
}

describe('useUserLocation', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should show coordinates when available', async () => {
    mocked(useUserLocation).mockReturnValue({
      data: { status: 'ready', coordinates: [10.8, 48.3], message: 'ready' },
      refresh: jest.fn(),
      error: null,
      loading: false,
    })
    render(<MockComponent />)
    await waitFor(() => {
      expect(screen.getByTestId('coords')).toHaveTextContent('10.8,48.3')
    })
  })

  it('should show null when unavailable', async () => {
    mocked(useUserLocation).mockReturnValue({
      data: { status: 'unavailable', coordinates: undefined, message: 'noPermission' },
      refresh: jest.fn(),
      error: null,
      loading: false,
    })
    render(<MockComponent />)
    await waitFor(() => {
      expect(screen.getByTestId('coords')).toHaveTextContent('no coords')
    })
  })

  it('should refresh when calling refresh', async () => {
    const mockRefresh = jest.fn()
    mocked(useUserLocation).mockReturnValue({
      data: { status: 'ready', coordinates: [10.8, 48.3], message: 'ready' },
      refresh: mockRefresh,
      error: null,
      loading: false,
    })
    render(<MockComponent />)
    fireEvent.click(screen.getByText('refresh'))
    expect(mockRefresh).toHaveBeenCalled()
  })
})
