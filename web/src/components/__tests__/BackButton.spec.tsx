import { fireEvent } from '@testing-library/react'
import React from 'react'

import { mockDimensions } from '../../hooks/__mocks__/useDimensions'
import useDimensions from '../../hooks/useDimensions'
import { renderWithRouterAndTheme } from '../../testing/render'
import BackButton from '../BackButton'

const mockNavigate = jest.fn()
jest.mock('../../hooks/useDimensions')
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate,
}))

describe('BackButton', () => {
  const { mocked } = jest

  const setHistoryIndex = (idx: number) => window.history.replaceState({ idx }, '')

  beforeEach(() => {
    jest.clearAllMocks()
    mocked(useDimensions).mockImplementation(() => ({ ...mockDimensions, mobile: true }))
    setHistoryIndex(1)
  })

  it('should render on mobile and navigate back on click when history exists', () => {
    const { getByText } = renderWithRouterAndTheme(<BackButton />)

    fireEvent.click(getByText('common:actions.back'))

    expect(mockNavigate).toHaveBeenCalledWith(-1)
  })

  it('should render nothing on mobile when there is no history and no fallback is given', () => {
    setHistoryIndex(0)
    const { queryByText } = renderWithRouterAndTheme(<BackButton />)

    expect(queryByText('common:actions.back')).toBeFalsy()
  })

  it('should render nothing on desktop by default', () => {
    mocked(useDimensions).mockImplementation(() => ({ ...mockDimensions, mobile: false }))
    const { queryByText } = renderWithRouterAndTheme(<BackButton />)

    expect(queryByText('common:actions.back')).toBeFalsy()
  })

  it('should render on desktop when the desktop prop is set', () => {
    mocked(useDimensions).mockImplementation(() => ({ ...mockDimensions, mobile: false }))
    const { getByText } = renderWithRouterAndTheme(<BackButton desktop fallback='/regions/de' />)

    expect(getByText('common:actions.back')).toBeTruthy()
  })

  it('should navigate to the fallback when there is no history to go back to', () => {
    setHistoryIndex(0)
    mocked(useDimensions).mockImplementation(() => ({ ...mockDimensions, mobile: false }))
    const { getByText } = renderWithRouterAndTheme(<BackButton desktop fallback='/regions/de' />)

    fireEvent.click(getByText('common:actions.back'))

    expect(mockNavigate).toHaveBeenCalledWith('/regions/de')
  })

  it('should prefer navigating back in history over the fallback when both are available', () => {
    mocked(useDimensions).mockImplementation(() => ({ ...mockDimensions, mobile: false }))
    const { getByText } = renderWithRouterAndTheme(<BackButton desktop fallback='/regions/de' />)

    fireEvent.click(getByText('common:actions.back'))

    expect(mockNavigate).toHaveBeenCalledWith(-1)
  })
})
