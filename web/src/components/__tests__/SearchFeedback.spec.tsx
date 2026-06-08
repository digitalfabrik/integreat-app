import { fireEvent, render } from '@testing-library/react'
import React from 'react'
import { createMemoryRouter, RouterProvider } from 'react-router'

import SearchFeedback from '../SearchFeedback'

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: (namespace?: string) => ({
    t: (key: string) => (namespace ? `${namespace}:${key}` : key),
  }),
  Trans: ({ i18nKey }: { i18nKey: string }) => i18nKey,
}))

const renderSearchFeedback = (query: string, noResults: boolean) => {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: <SearchFeedback query={query} noResults={noResults} />,
      },
    ],
    { initialEntries: ['/'] },
  )
  return { router, ...render(<RouterProvider router={router} />) }
}

describe('SearchFeedback', () => {
  it('should set feedback query param on button click when no results', () => {
    const { getByText, router } = renderSearchFeedback('test', true)

    expect(router.state.location.search).toBe('')
    fireEvent.click(getByText('feedback:giveFeedback'))
    expect(router.state.location.search).toBe('?feedback=negative')
  })

  it('should set feedback query param on button click when results exist', () => {
    const { getByText, router } = renderSearchFeedback('test', false)

    expect(router.state.location.search).toBe('')
    fireEvent.click(getByText('feedback:informationNotFound'))
    expect(router.state.location.search).toBe('?feedback=true')
  })
})
