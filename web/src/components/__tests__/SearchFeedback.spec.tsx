import { fireEvent, render } from '@testing-library/react'
import React from 'react'
import { createMemoryRouter, RouterProvider } from 'react-router'

import SearchFeedback from '../SearchFeedback'

const renderSearchFeedback = (noResults: boolean) => {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: <SearchFeedback noResults={noResults} />,
      },
    ],
    { initialEntries: ['/'] },
  )
  return { router, ...render(<RouterProvider router={router} />) }
}

describe('SearchFeedback', () => {
  it('should set feedback query param on button click when no results', () => {
    const { getByText, router } = renderSearchFeedback(true)

    expect(router.state.location.search).toBe('')
    fireEvent.click(getByText('feedback:giveFeedback'))
    expect(router.state.location.search).toBe('?feedback=negative')
  })
})
