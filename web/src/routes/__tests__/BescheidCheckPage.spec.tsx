import { fireEvent } from '@testing-library/react'
import React from 'react'

import { renderRoute } from '../../testing/render'
import BescheidCheckPage from '../BescheidCheckPage'

describe('BescheidCheckPage', () => {
  it('should render a heading', () => {
    const { getByText } = renderRoute(<BescheidCheckPage languageCode='de' />, {
      pathname: '/bescheid-check/de',
      routePattern: '/bescheid-check/:languageCode',
    })

    expect(getByText('Bescheid-Check')).toBeTruthy()
  })

  it('should show a back button that navigates to the originating region home page when no history exists', () => {
    const { getByText, router } = renderRoute(<BescheidCheckPage languageCode='de' />, {
      pathname: '/bescheid-check/de',
      routePattern: '/bescheid-check/:languageCode',
      searchParams: 'region=augsburg',
    })

    fireEvent.click(getByText('common:actions.back'))

    expect(router.state.location.pathname).toBe('/augsburg/de')
  })

  it('should show a back button that navigates to the regions page when no history and no region exist', () => {
    const { getByText, router } = renderRoute(<BescheidCheckPage languageCode='de' />, {
      pathname: '/bescheid-check/de',
      routePattern: '/bescheid-check/:languageCode',
    })

    fireEvent.click(getByText('common:actions.back'))

    expect(router.state.location.pathname).toBe('/regions/de')
  })

  it('should only enable the submit button with at least one file and accepted privacy policy', () => {
    const { getByText, getByLabelText, getByRole } = renderRoute(<BescheidCheckPage languageCode='de' />, {
      pathname: '/bescheid-check/de',
      routePattern: '/bescheid-check/:languageCode',
    })
    const submitButton = getByRole('button', { name: 'bescheidCheck:submit' })

    expect(submitButton).toBeDisabled()

    fireEvent.change(getByLabelText('bescheidCheck:upload.selectFiles'), {
      target: { files: [new File(['content'], 'page1.pdf')] },
    })

    expect(getByText('page1.pdf')).toBeTruthy()
    expect(submitButton).toBeDisabled()

    fireEvent.click(getByRole('checkbox'))

    expect(submitButton).toBeEnabled()
  })
})
