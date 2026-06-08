import { fireEvent, render } from '@testing-library/react'
import React from 'react'
import { createMemoryRouter, RouterProvider } from 'react-router'

import { Rating, RATING_NEGATIVE, RATING_POSITIVE } from 'shared'

import FeedbackToolbarItem from '../FeedbackToolbarItem'

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: (namespace?: string) => ({
    t: (key: string) => (namespace ? `${namespace}:${key}` : key),
  }),
  Trans: ({ i18nKey }: { i18nKey: string }) => i18nKey,
}))

const renderToolbarItem = (rating: Rating | null) => {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: <FeedbackToolbarItem rating={rating} />,
      },
    ],
    { initialEntries: ['/'] },
  )
  return { router, ...render(<RouterProvider router={router} />) }
}

describe('FeedbackToolbarItem', () => {
  it('should set feedback query param on click with positive rating', () => {
    const { getByText, router } = renderToolbarItem(RATING_POSITIVE)

    expect(router.state.location.search).toBe('')
    fireEvent.click(getByText('feedback:useful'))
    expect(router.state.location.search).toBe('?feedback=positive')
  })

  it('should set feedback query param on click with negative rating', () => {
    const { getByText, router } = renderToolbarItem(RATING_NEGATIVE)

    expect(router.state.location.search).toBe('')
    fireEvent.click(getByText('feedback:notUseful'))
    expect(router.state.location.search).toBe('?feedback=negative')
  })
})
