import { PopoverContentProps } from '@reactour/tour'
import { fireEvent } from '@testing-library/react'
import React from 'react'

import { TOUR_VISIBLE_STORAGE_KEY } from '../../hooks/useLocalStorage'
import { renderWithTheme } from '../../testing/render'
import { TourStepType } from '../../utils/tourSteps'
import TourPopover from '../TourPopover'
import { arrowStyle } from '../base/PopoverPaper'

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
    expect(getByLabelText('tour:progress [1,2]')).toHaveTextContent('1/2')
  })

  it('should navigate to the next step', () => {
    const { getByText } = renderPopover(0)

    fireEvent.click(getByText('common:actions.next'))

    expect(setCurrentStep).toHaveBeenCalledWith(1)
  })

  it('should navigate to the previous step', () => {
    const { getByText } = renderPopover(1)

    fireEvent.click(getByText('common:actions.previous'))

    expect(setCurrentStep).toHaveBeenCalledWith(0)
  })

  it('should not show the back button on the first step', () => {
    const { queryByText } = renderPopover(0)

    expect(queryByText('common:actions.previous')).toBeNull()
  })

  it('should advance past the last step to finish the tour', () => {
    const { getByText } = renderPopover(1)

    fireEvent.click(getByText('common:actions.next'))

    expect(setCurrentStep).toHaveBeenCalledWith(steps.length)
    expect(setIsOpen).not.toHaveBeenCalled()
  })

  it('should center the feedback arrow vertically when requested', () => {
    const feedbackStep: TourStepType = {
      selector: '#toolbar',
      position: 'right',
      centerArrowVertically: true,
      content: <span>Feedback</span>,
    }

    const { container } = renderWithTheme(
      <TourPopover
        {...({
          steps: [feedbackStep],
          currentStep: 0,
          setCurrentStep,
          setIsOpen,
        } as unknown as PopoverContentProps)}
      />,
    )

    const centeredPaper = container.querySelector('.MuiPaper-root')
    const defaultPaper = renderPopover(1).container.querySelector('.MuiPaper-root')

    expect(centeredPaper).not.toBeNull()
    expect(defaultPaper).not.toBeNull()

    expect(centeredPaper?.className).not.toEqual(defaultPaper?.className)
    expect(centeredPaper).not.toHaveAttribute('data-arrow-vertical-alignment')

    expect(arrowStyle('right', 'left', false, true)).toMatchObject({
      insetBlockStart: '50%',
      transform: 'translateY(-50%)',
    })
  })

  it('should preserve default and RTL arrow behavior', () => {
    const defaultStyle = arrowStyle('right', 'left', false)

    expect(defaultStyle).toMatchObject({
      insetBlockStart: 24,
    })
    expect(defaultStyle).not.toHaveProperty('transform')

    expect(arrowStyle('left', 'right', true, true)).toMatchObject({
      insetBlockStart: '50%',
      transform: 'translateY(-50%)',
    })
  })

  it('should close the tour and not offer it again', () => {
    const { getByLabelText } = renderPopover(0)

    fireEvent.click(getByLabelText('common:actions.close'))

    expect(setIsOpen).toHaveBeenCalledWith(false)
    expect(localStorage.getItem(TOUR_VISIBLE_STORAGE_KEY)).toBe('false')
  })
})
