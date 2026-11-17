import MenuItem from '@mui/material/MenuItem'
import { act, fireEvent, screen, waitFor } from '@testing-library/react'
import React from 'react'

import type { RegionModel } from 'shared/api'

import { renderWithTheme } from '../../testing/render'
import TourContainer from '../TourContainer'
import Menu from '../base/Menu'

jest.mock('../../utils/tourStepsDesktop', () => () => [
  { selector: '#tour-mask-regression-target', content: 'Tour step' },
])
jest.mock('../../utils/tourStepsMobile', () => () => [
  { selector: '#tour-mask-regression-target', content: 'Tour step' },
])

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

  it('keeps an opened menu open when clicking the Reactour mask', async () => {
    renderWithTheme(
      <>
        <div id='tour-mask-regression-target'>Highlight target</div>
        <Menu label='Menu'>{() => <MenuItem>Item</MenuItem>}</Menu>
        <TourContainer region={{} as RegionModel} languageCode='de' />
      </>,
    )

    fireEvent.click(screen.getByText('tour:start'))
    await waitFor(() => expect(document.querySelector('.reactour__mask')).not.toBeNull())
    fireEvent.click(screen.getByRole('button', { name: 'Menu' }))
    // The click away listener is only activated after the click opening the menu
    await act(async () => {
      await new Promise(resolve => {
        setTimeout(resolve, 0)
      })
    })

    fireEvent.click(document.querySelector('.reactour__mask')!)

    expect(screen.getByRole('button', { name: 'Menu' })).toHaveAttribute('aria-expanded', 'true')
  })
})
