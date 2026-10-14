import { StepType, TourProvider } from '@reactour/tour'
import { fireEvent, waitFor } from '@testing-library/react'
import React from 'react'

import { HEADER_MENU_ELEMENT_ID } from '../../constants/layout'
import { TOUR_VISIBLE_STORAGE_KEY } from '../../hooks/useLocalStorage'
import { renderWithTheme } from '../../testing/render'
import TourDialog from '../TourDialog'

describe('TourDialog', () => {
  const steps: StepType[] = [
    { selector: '#first', content: 'First step' },
    { selector: '#second', content: 'Second step' },
  ]

  afterEach(() => {
    localStorage.clear()
  })

  const renderDialog = ({ finished = false } = {}) =>
    renderWithTheme(
      <TourProvider steps={steps} defaultOpen={finished} startAt={finished ? steps.length : 0}>
        <TourDialog />
      </TourProvider>,
    )

  it('should offer the tour on the first visit', () => {
    const { getByText } = renderDialog()

    expect(getByText('intro:welcome.title IntegreatTestCms')).toBeTruthy()
    expect(getByText('tour:welcome')).toBeTruthy()
    expect(getByText('tour:start')).toBeTruthy()
    expect(getByText('common:actions.skip')).toBeTruthy()
  })

  it('should not offer the tour again once it was dismissed', () => {
    localStorage.setItem(TOUR_VISIBLE_STORAGE_KEY, 'false')
    const { queryByText } = renderDialog()

    expect(queryByText('intro:welcome.title IntegreatTestCms')).toBeNull()
  })

  it('should offer the tour again if it was interrupted after starting it', () => {
    const { getByText, queryByText } = renderDialog()

    fireEvent.click(getByText('tour:start'))

    expect(queryByText('intro:welcome.title IntegreatTestCms')).toBeNull()
    expect(localStorage.getItem(TOUR_VISIBLE_STORAGE_KEY)).toBe('true')
  })

  it('should hide the dialog when skipping the tour', () => {
    const { getByText, queryByText } = renderDialog()

    fireEvent.click(getByText('common:actions.skip'))

    expect(queryByText('intro:welcome.title IntegreatTestCms')).toBeNull()
    expect(localStorage.getItem(TOUR_VISIBLE_STORAGE_KEY)).toBe('false')
  })

  it('QA-4399-08: restores focus after closing the finish dialog', async () => {
    const { getByText, getByLabelText, queryByText } = renderWithTheme(
      <>
        <button id={HEADER_MENU_ELEMENT_ID} type='button'>
          Menu
        </button>
        <TourProvider steps={steps} defaultOpen startAt={steps.length}>
          <TourDialog />
        </TourProvider>
      </>,
    )

    const menuButton = getByText('Menu')
    const closeButton = getByLabelText('common:actions.close')

    closeButton.focus()
    expect(closeButton).toHaveFocus()

    fireEvent.click(closeButton)

    expect(queryByText('tour:finish.title')).toBeNull()
    await waitFor(() => expect(menuButton).toHaveFocus())
  })

  it('should conclude the tour after the last step', () => {
    const { getByText, queryByText } = renderDialog({ finished: true })

    expect(getByText('tour:finish.title')).toBeTruthy()
    expect(getByText('tour:finish.description IntegreatTestCms')).toBeTruthy()
    expect(queryByText('common:actions.skip')).toBeNull()

    fireEvent.click(getByText('common:actions.close'))

    expect(queryByText('tour:finish.title')).toBeNull()
    expect(localStorage.getItem(TOUR_VISIBLE_STORAGE_KEY)).toBe('false')
  })
})
