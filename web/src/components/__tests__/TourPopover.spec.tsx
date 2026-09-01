import { PopoverContentProps } from '@reactour/tour'
import { fireEvent } from '@testing-library/react'
import React from 'react'

import { TOUR_DIALOG_VISIBLE_STORAGE_KEY } from '../../hooks/useLocalStorage'
import { renderWithTheme } from '../../testing/render'
import TourPopover from '../TourPopover'
import { TourStepType } from '../TourStepContent'

describe('TourPopover', () => {
  const setCurrentStep = jest.fn()
  const setIsOpen = jest.fn()

  const steps: TourStepType[] = [
    { selector: '#first', position: 'bottom', content: <span>First step</span> },
    { selector: '#second', position: 'right', content: <span>Second step</span> },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  const renderPopover = (currentStep: number) =>
    renderWithTheme(
      <TourPopover {...({ steps, currentStep, setCurrentStep, setIsOpen } as unknown as PopoverContentProps)} />,
    )

  it('should render the content and the progress of the current step', () => {
    const { getByText, getByLabelText } = renderPopover(0)

    expect(getByText('First step')).toBeTruthy()
    expect(getByLabelText('tour:progress')).toHaveTextContent('1/2')
  })

  it('should navigate to the next step', () => {
    const { getByText } = renderPopover(0)

    fireEvent.click(getByText('layout:next'))

    expect(setCurrentStep).toHaveBeenCalledWith(1)
  })

  it('should navigate to the previous step', () => {
    const { getByText } = renderPopover(1)

    fireEvent.click(getByText('layout:previous'))

    expect(setCurrentStep).toHaveBeenCalledWith(0)
  })

  it('should disable navigating back on the first step', () => {
    const { getByText } = renderPopover(0)

    expect(getByText('layout:previous').closest('button')).toBeDisabled()
  })

  it('should advance past the last step to finish the tour', () => {
    const { getByText } = renderPopover(1)

    fireEvent.click(getByText('tour:finish'))

    expect(setCurrentStep).toHaveBeenCalledWith(steps.length)
    expect(setIsOpen).not.toHaveBeenCalled()
  })

  it('should close the tour and not offer it again', () => {
    const { getByLabelText } = renderPopover(0)

    fireEvent.click(getByLabelText('common:close'))

    expect(setIsOpen).toHaveBeenCalledWith(false)
    expect(localStorage.getItem(TOUR_DIALOG_VISIBLE_STORAGE_KEY)).toBe('false')
  })
})
