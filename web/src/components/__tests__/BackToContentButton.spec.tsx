import { fireEvent } from '@testing-library/react'
import React from 'react'

import { mockDimensions } from '../../__mocks__/useDimensions'
import useDimensions from '../../hooks/useDimensions'
import { renderWithRouterAndTheme } from '../../testing/render'
import BackToContentButton from '../BackToContentButton'

const mockNavigate = jest.fn()
jest.mock('react-i18next')
jest.mock('../../hooks/useDimensions')
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate,
}))

describe('BackToContentButton', () => {
  const { mocked } = jest

  const setHistoryIndex = (idx: number) => window.history.replaceState({ idx }, '')

  beforeEach(() => {
    jest.clearAllMocks()
    mocked(useDimensions).mockImplementation(() => ({ ...mockDimensions, mobile: true }))
    setHistoryIndex(1)
  })

  it('should render on mobile and navigate back on click', () => {
    const { getByText } = renderWithRouterAndTheme(<BackToContentButton />)

    fireEvent.click(getByText('layout:backToContent'))

    expect(mockNavigate).toHaveBeenCalledWith(-1)
  })

  it('should render nothing when there is no history to go back to', () => {
    setHistoryIndex(0)
    const { queryByText } = renderWithRouterAndTheme(<BackToContentButton />)

    expect(queryByText('layout:backToContent')).toBeFalsy()
  })
})
