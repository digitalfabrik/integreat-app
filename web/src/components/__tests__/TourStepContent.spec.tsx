import { fireEvent } from '@testing-library/react'
import React, { useState } from 'react'

import { renderWithTheme } from '../../testing/render'
import TourStepContent from '../TourStepContent'

describe('TourStepContent accessibility', () => {
  const TourStepHarness = () => {
    const [step, setStep] = useState(0)

    return (
      <>
        <TourStepContent title={step === 0 ? 'First step' : 'Second step'} descriptionKey={$ => $.tour.welcome} />
        <button type='button' onClick={() => setStep(current => (current === 0 ? 1 : 0))}>
          {step === 0 ? 'Next step' : 'Previous step'}
        </button>
      </>
    )
  }

  it('announces the initial step title and description', () => {
    const { getByRole } = renderWithTheme(<TourStepHarness />)

    const announcement = getByRole('status')

    expect(announcement).toHaveTextContent('First step')
    expect(announcement).toHaveTextContent('tour:welcome')
  })

  it('updates the announcement when navigating forward and backward', () => {
    const { getByRole } = renderWithTheme(<TourStepHarness />)

    expect(getByRole('status')).toHaveTextContent('First step')

    fireEvent.click(getByRole('button', { name: 'Next step' }))

    expect(getByRole('status')).toHaveTextContent('Second step')

    fireEvent.click(getByRole('button', { name: 'Previous step' }))

    expect(getByRole('status')).toHaveTextContent('First step')
  })

  it('announces dynamic navigation items without HTML markup', () => {
    const { getByRole } = renderWithTheme(
      <TourStepContent
        title='Navigation'
        descriptionKey={$ => $.tour.navigation.description}
        values={{
          navigationItems: ['<strong>Categories</strong>', '<strong>News</strong>'],
        }}
      />,
    )

    const announcement = getByRole('status')

    expect(announcement).toHaveTextContent('Navigation')
    expect(announcement).toHaveTextContent('Categories')
    expect(announcement).toHaveTextContent('News')
    expect(announcement).not.toHaveTextContent('<strong>')
  })
})
