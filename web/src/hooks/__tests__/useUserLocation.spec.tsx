import Button from '@mui/material/Button'
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
  useLoadAsync: jest.fn(() => ({ data: null, error: null, loading: false, refresh: jest.fn() })),
}))

const MockComponent = () => {
  const { data, refresh } = useUserLocation()
  return (
    <div>
      <div data-testid='coords'>{data ? data.join(',') : 'no coords'}</div>
      <Button onClick={refresh}>refresh</Button>
    </div>
  )
}

describe('useUserLocation', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should show coordinates when available', async () => {
    mocked(useUserLocation).mockReturnValue({
      data: [10.8, 48.3],
      refresh: jest.fn(),
      error: null,
      loading: false,
      setData: () => jest.fn(),
    })
    render(<MockComponent />)
    await waitFor(() => {
      expect(screen.getByTestId('coords')).toHaveTextContent('10.8,48.3')
    })
  })

  it('should show null when unavailable', async () => {
    mocked(useUserLocation).mockReturnValue({
      data: null,
      refresh: jest.fn(),
      error: null,
      loading: false,
      setData: () => jest.fn(),
    })
    render(<MockComponent />)
    await waitFor(() => {
      expect(screen.getByTestId('coords')).toHaveTextContent('no coords')
    })
  })

  it('should refresh when calling refresh', async () => {
    const mockRefresh = jest.fn()
    mocked(useUserLocation).mockReturnValue({
      data: [10.8, 48.3],
      refresh: mockRefresh,
      error: null,
      loading: false,
      setData: () => jest.fn(),
    })
    render(<MockComponent />)
    fireEvent.click(screen.getByText('refresh'))
    expect(mockRefresh).toHaveBeenCalled()
  })
})
