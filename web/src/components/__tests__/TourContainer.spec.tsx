import { fireEvent, screen, waitFor } from '@testing-library/react'
import React from 'react'

import type { RegionModel } from 'shared/api'

import { renderWithTheme } from '../../testing/render'
import TourContainer from '../TourContainer'

jest.mock('../../utils/tourStepsDesktop', () => ({
  __esModule: true,
  default: () => [
    {
      selector: '#tour-mask-regression-target',
      content: 'Tour step',
      position: 'bottom',
    },
  ],
}))

jest.mock('../../utils/tourStepsMobile', () => ({
  __esModule: true,
  default: () => [
    {
      selector: '#tour-mask-regression-target',
      content: 'Tour step',
      position: 'bottom',
    },
  ],
}))

describe('TourContainer mask interaction', () => {
  afterEach(() => {
    localStorage.clear()
  })

  it('keeps the active tour open when clicking the Reactour mask', async () => {
    renderWithTheme(
      <>
        <div id='tour-mask-regression-target'>Highlight target</div>
        <TourContainer region={{} as RegionModel} languageCode='de' />
      </>,
    )

    fireEvent.click(screen.getByText('tour:start'))

    const mask = await waitFor(() => {
      const element = document.querySelector('.reactour__mask')

      if (!element) {
        throw new Error('RED_SETUP: Reactour mask did not mount')
      }

      return element
    })

    if (!screen.queryByText('Tour step')) {
      throw new Error('RED_SETUP: tour step did not mount')
    }

    fireEvent.click(mask)

    expect(document.querySelector('.reactour__mask')).not.toBeNull()
    expect(screen.queryByText('Tour step')).not.toBeNull()
  })
})
