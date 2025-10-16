import { mocked } from 'jest-mock'
import React from 'react'
import { useNavigate } from 'react-router'

import { setJpalTrackingCode } from 'shared/api'

import { renderRoute } from '../../testing/render'
import safeLocalStorage, { JPAL_TRACKING_CODE_KEY } from '../../utils/safeLocalStorage'
import JpalTrackingPage from '../JpalTrackingPage'

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: jest.fn(),
}))

jest.mock('../../utils/safeLocalStorage', () => ({
  setItem: jest.fn(),
  removeItem: jest.fn(),
  JPAL_TRACKING_CODE_KEY: 'jpalTrackingCode',
}))

jest.mock('shared/api', () => ({
  setJpalTrackingCode: jest.fn(),
}))

describe('JpalTrackingPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  const navigate = jest.fn()
  mocked(useNavigate).mockImplementation(() => navigate)

  it('should save tracking code and redirect', () => {
    const trackingCode = 'my-tracking-code'
    renderRoute(<JpalTrackingPage />, {
      pathname: `/jpal/${trackingCode}`,
      routePattern: `/jpal/:trackingCode`,
    })

    expect(safeLocalStorage.setItem).toHaveBeenCalledWith(JPAL_TRACKING_CODE_KEY, trackingCode)
    expect(safeLocalStorage.setItem).toHaveBeenCalledTimes(1)
    expect(safeLocalStorage.removeItem).not.toHaveBeenCalled()

    expect(setJpalTrackingCode).toHaveBeenCalledWith(trackingCode)
    expect(setJpalTrackingCode).toHaveBeenCalledTimes(1)

    expect(navigate).toHaveBeenCalledWith('/', { replace: true })
    expect(navigate).toHaveBeenCalledTimes(1)
  })

  it('should delete tracking code and redirect', () => {
    renderRoute(<JpalTrackingPage />, { pathname: '/jpal', routePattern: `/jpal` })

    expect(safeLocalStorage.removeItem).toHaveBeenCalledWith(JPAL_TRACKING_CODE_KEY)
    expect(safeLocalStorage.removeItem).toHaveBeenCalledTimes(1)
    expect(safeLocalStorage.setItem).not.toHaveBeenCalled()

    expect(setJpalTrackingCode).toHaveBeenCalledWith(null)
    expect(setJpalTrackingCode).toHaveBeenCalledTimes(1)

    expect(navigate).toHaveBeenCalledWith('/', { replace: true })
    expect(navigate).toHaveBeenCalledTimes(1)
  })
})
