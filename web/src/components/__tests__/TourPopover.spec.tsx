import { PopoverContentProps } from '@reactour/tour'
import { act, fireEvent, waitFor, within } from '@testing-library/react'
import React, { useState } from 'react'

import { HEADER_MENU_ELEMENT_ID } from '../../constants/layout'
import { TOUR_VISIBLE_STORAGE_KEY } from '../../hooks/useLocalStorage'
import { renderWithTheme } from '../../testing/render'
import { TourStepType } from '../../utils/tourSteps'
import TourPopover from '../TourPopover'
import TourStepContent from '../TourStepContent'

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

  const renderInteractiveTour = () => {
    const InteractiveTour = () => {
      const [currentStep, setCurrentStep] = useState(0)

      return (
        <TourPopover
          {...({
            steps,
            currentStep,
            setCurrentStep,
            setIsOpen,
          } as unknown as PopoverContentProps)}
        />
      )
    }

    return renderWithTheme(<InteractiveTour />)
  }

  it('should focus an accessible tour dialog on opening', () => {
    const { getByRole } = renderInteractiveTour()

    const dialog = getByRole('dialog', {
      name: 'tour:progress [1,2]',
    })

    expect(dialog).toHaveAttribute('tabindex', '-1')
    expect(dialog).toHaveFocus()
  })

  it('should focus the active tour step after navigation', () => {
    const { getByRole, getByText } = renderInteractiveTour()

    const nextButton = getByRole('button', {
      name: 'common:actions.next',
    })

    nextButton.focus()
    expect(nextButton).toHaveFocus()

    fireEvent.click(nextButton)

    expect(getByText('Second step')).toBeInTheDocument()

    const dialog = getByRole('dialog', {
      name: 'tour:progress [2,2]',
    })

    expect(dialog).toHaveFocus()
  })

  it('preserves button focus when the parent rerenders without changing steps', () => {
    let rerenderParent: () => void = () => {
      throw new Error('Parent not mounted')
    }

    const RerenderHarness = () => {
      const [, forceUpdate] = useState(0)

      rerenderParent = () => forceUpdate(count => count + 1)

      const recreatedSteps = steps.map(step => ({ ...step }))

      return (
        <TourPopover
          {...({
            steps: recreatedSteps,
            currentStep: 0,
            setCurrentStep,
            setIsOpen,
          } as unknown as PopoverContentProps)}
        />
      )
    }

    const { getByRole } = renderWithTheme(<RerenderHarness />)

    const dialog = getByRole('dialog', {
      name: 'tour:progress [1,2]',
    })

    expect(dialog).toHaveFocus()

    const nextButton = getByRole('button', {
      name: 'common:actions.next',
    })

    nextButton.focus()
    expect(nextButton).toHaveFocus()

    act(() => {
      rerenderParent()
    })

    expect(nextButton).toHaveFocus()
  })

  it('synchronizes focus and announcements across tour steps', () => {
    const IntegratedTour = () => {
      const [currentStep, setCurrentStep] = useState(0)

      const integratedSteps: TourStepType[] = [
        {
          selector: '#first',
          position: 'bottom',
          content: <TourStepContent title='First accessible step' descriptionKey={$ => $.tour.welcome} />,
        },
        {
          selector: '#second',
          position: 'right',
          content: <TourStepContent title='Second accessible step' descriptionKey={$ => $.tour.finish.description} />,
        },
      ]

      return (
        <TourPopover
          {...({
            steps: integratedSteps,
            currentStep,
            setCurrentStep,
            setIsOpen,
          } as unknown as PopoverContentProps)}
        />
      )
    }

    const { getByRole } = renderWithTheme(<IntegratedTour />)

    expect(getByRole('dialog', { name: 'tour:progress [1,2]' })).toHaveFocus()

    expect(getByRole('status')).toHaveTextContent('First accessible step')
    expect(getByRole('status')).toHaveTextContent('tour:welcome')

    fireEvent.click(getByRole('button', { name: 'common:actions.next' }))

    expect(getByRole('dialog', { name: 'tour:progress [2,2]' })).toHaveFocus()

    expect(getByRole('status')).toHaveTextContent('Second accessible step')
    expect(getByRole('status')).toHaveTextContent('tour:finish.description')
    expect(getByRole('status')).not.toHaveTextContent('First accessible step')

    fireEvent.click(getByRole('button', { name: 'common:actions.previous' }))

    expect(getByRole('dialog', { name: 'tour:progress [1,2]' })).toHaveFocus()

    expect(getByRole('status')).toHaveTextContent('First accessible step')
    expect(getByRole('status')).toHaveTextContent('tour:welcome')
    expect(getByRole('status')).not.toHaveTextContent('Second accessible step')
  })

  it('should render the content and the progress of the current step', () => {
    const { getByText, getByRole } = renderPopover(0)

    expect(getByText('First step')).toBeTruthy()
    const dialog = getByRole('dialog', {
      name: 'tour:progress [1,2]',
    })

    expect(within(dialog).getByLabelText('tour:progress [1,2]')).toHaveTextContent('1/2')
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

  it('restores focus after closing a tour step', async () => {
    const ClosingTour = () => {
      const [isOpen, setIsOpen] = useState(true)

      return (
        <>
          <button id={HEADER_MENU_ELEMENT_ID} type='button'>
            Menu
          </button>
          {isOpen && (
            <TourPopover
              {...({
                steps,
                currentStep: 0,
                setCurrentStep,
                setIsOpen,
              } as unknown as PopoverContentProps)}
            />
          )}
        </>
      )
    }

    const { getByText, getByLabelText, queryByRole } = renderWithTheme(<ClosingTour />)

    const menuButton = getByText('Menu')
    const closeButton = getByLabelText('common:actions.close')

    closeButton.focus()
    expect(closeButton).toHaveFocus()

    fireEvent.click(closeButton)

    expect(queryByRole('dialog')).not.toBeInTheDocument()
    await waitFor(() => expect(menuButton).toHaveFocus())
  })

  it('should close the tour and not offer it again', () => {
    const { getByLabelText } = renderPopover(0)

    fireEvent.click(getByLabelText('common:actions.close'))

    expect(setIsOpen).toHaveBeenCalledWith(false)
    expect(localStorage.getItem(TOUR_VISIBLE_STORAGE_KEY)).toBe('false')
  })
})
