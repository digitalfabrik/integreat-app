import { PopoverContentProps } from '@reactour/tour'
import { fireEvent, render } from '@testing-library/react'
import React, { ReactNode } from 'react'

import { TOUR_VISIBLE_STORAGE_KEY } from '../../hooks/useLocalStorage'
import { TourStepType } from '../../utils/tourSteps'
import ThemeContainer from '../ThemeContainer'
import TourPopover from '../TourPopover'

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

  const createPopover = (currentStep: number) => (
    <TourPopover {...({ steps, currentStep, setCurrentStep, setIsOpen } as unknown as PopoverContentProps)} />
  )

  const renderPopover = (currentStep: number) => {
    const result = render(createPopover(currentStep), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <ThemeContainer contentDirection='ltr'>{children}</ThemeContainer>
      ),
    })
    // The wrapper is kept on rerendering, so the popover stays mounted while switching steps
    const rerenderStep = (step: number) => result.rerender(createPopover(step))
    return { ...result, rerenderStep }
  }

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

  it('should close the tour and not offer it again', () => {
    const { getByLabelText } = renderPopover(0)

    fireEvent.click(getByLabelText('common:actions.close'))

    expect(setIsOpen).toHaveBeenCalledWith(false)
    expect(localStorage.getItem(TOUR_VISIBLE_STORAGE_KEY)).toBe('false')
  })

  it('should move the focus into the popover when the tour starts', () => {
    const { getByRole } = renderPopover(0)

    const dialog = getByRole('dialog', { name: 'tour:title' })
    expect(dialog).toHaveFocus()
    expect(dialog).toHaveAccessibleDescription('First step')
    expect(getByRole('status')).toHaveTextContent('')
  })

  it('should announce the content of the next step to screen readers', () => {
    const { getByRole, getByText, rerenderStep } = renderPopover(0)

    const nextButton = getByText('common:actions.next')
    nextButton.focus()
    rerenderStep(1)

    expect(getByRole('status')).toHaveTextContent('tour:progress [2,2]: Second step')
    expect(nextButton).toHaveFocus()
  })

  it('should move the focus back into the popover if the focused button disappears', () => {
    const { getByRole, getByText, rerenderStep } = renderPopover(1)

    getByText('common:actions.previous').focus()
    rerenderStep(0)

    expect(getByRole('dialog')).toHaveFocus()
    expect(getByRole('status')).toHaveTextContent('tour:progress [1,2]: First step')
  })
})
