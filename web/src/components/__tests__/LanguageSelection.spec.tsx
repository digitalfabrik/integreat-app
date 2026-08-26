import React from 'react'

import { renderRoute } from '../../testing/render'
import LanguageSelection, { LanguageChangePath } from '../LanguageSelection'

describe('LanguageSelection', () => {
  const routePattern = '/:regionCode/:languageCode/events'
  const pathname = '/augsburg/de/events'
  const languageChangePaths: LanguageChangePath[] = [
    { code: 'de', name: 'Deutsch', path: '/augsburg/de/events' },
    { code: 'en', name: 'English', path: '/augsburg/en/events' },
    { code: 'ar', name: 'Arabic', path: '/augsburg/ar/events' },
    { code: 'es', name: 'Español', path: null },
  ]

  it('should append the current search string to each available language link', () => {
    const { getByText } = renderRoute(
      <LanguageSelection
        languageChangePaths={languageChangePaths}
        languageCode='de'
        asList
        openAlertDialog={jest.fn()}
      />,
      { pathname, routePattern, searchParams: '?start=2026-08-12&end=2026-10-31' },
    )

    expect(getByText('Deutsch').closest('a')).toHaveAttribute(
      'href',
      '/augsburg/de/events?start=2026-08-12&end=2026-10-31',
    )
    expect(getByText('English').closest('a')).toHaveAttribute(
      'href',
      '/augsburg/en/events?start=2026-08-12&end=2026-10-31',
    )
    expect(getByText('Arabic').closest('a')).toHaveAttribute(
      'href',
      '/augsburg/ar/events?start=2026-08-12&end=2026-10-31',
    )

    expect(getByText('Español').closest('a')).toBeNull()
  })

  it('should leave language paths unchanged when there is no search string', () => {
    const { getByText } = renderRoute(
      <LanguageSelection
        languageChangePaths={languageChangePaths}
        languageCode='de'
        asList
        openAlertDialog={jest.fn()}
      />,
      { pathname, routePattern },
    )

    expect(getByText('Deutsch').closest('a')).toHaveAttribute('href', '/augsburg/de/events')
    expect(getByText('English').closest('a')).toHaveAttribute('href', '/augsburg/en/events')
    expect(getByText('Arabic').closest('a')).toHaveAttribute('href', '/augsburg/ar/events')
    expect(getByText('Español').closest('a')).toBeNull()
  })
})
