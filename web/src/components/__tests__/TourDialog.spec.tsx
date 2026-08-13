import { StepType, TourProvider } from '@reactour/tour'
import { fireEvent } from '@testing-library/react'
import React from 'react'

import { TOUR_DIALOG_VISIBLE_STORAGE_KEY } from '../../hooks/useLocalStorage'
import { renderWithTheme } from '../../testing/render'
import TourDialog from '../TourDialog'

jest.mock('react-i18next')

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

    expect(getByText('tour:welcomeTitle')).toBeTruthy()
    expect(getByText('tour:welcomeDescription')).toBeTruthy()
    expect(getByText('tour:startTour')).toBeTruthy()
    expect(getByText('tour:skipTour')).toBeTruthy()
  })

  it('should not offer the tour again once it was dismissed', () => {
    localStorage.setItem(TOUR_DIALOG_VISIBLE_STORAGE_KEY, 'false')
    const { queryByText } = renderDialog()

    expect(queryByText('tour:welcomeTitle')).toBeNull()
  })

  it('should offer the tour again if it was interrupted after starting it', () => {
    const { getByText, queryByText } = renderDialog()

    fireEvent.click(getByText('tour:startTour'))

    expect(queryByText('tour:welcomeTitle')).toBeNull()
    expect(localStorage.getItem(TOUR_DIALOG_VISIBLE_STORAGE_KEY)).toBe('true')
  })

  it('should hide the dialog when skipping the tour', () => {
    const { getByText, queryByText } = renderDialog()

    fireEvent.click(getByText('tour:skipTour'))

    expect(queryByText('tour:welcomeTitle')).toBeNull()
    expect(localStorage.getItem(TOUR_DIALOG_VISIBLE_STORAGE_KEY)).toBe('false')
  })

  it('should conclude the tour after the last step', () => {
    const { getByText, queryByText } = renderDialog({ finished: true })

    expect(getByText('tour:finishTitle')).toBeTruthy()
    expect(getByText('tour:finishDescription')).toBeTruthy()
    expect(queryByText('tour:skipTour')).toBeNull()

    fireEvent.click(getByText('tour:finishAction'))

    expect(queryByText('tour:finishTitle')).toBeNull()
    expect(localStorage.getItem(TOUR_DIALOG_VISIBLE_STORAGE_KEY)).toBe('false')
  })
})
