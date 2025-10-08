import { fireEvent } from '@testing-library/react'
import React from 'react'

import { Rating, RATING_POSITIVE, SEARCH_ROUTE } from 'shared'

import { renderAllRoutes } from '../../testing/render'
import FeedbackContainer from '../FeedbackContainer'

const mockRequest = jest.fn()
jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: (namespace?: string) => ({
    t: (key: string) => (namespace ? `${namespace}:${key}` : key),
  }),
  Trans: ({ i18nKey }: { i18nKey: string }) => i18nKey,
}))
jest.mock('shared/api', () => ({
  ...jest.requireActual('shared/api'),
  createFeedbackEndpoint: () => ({
    request: mockRequest,
  }),
}))

describe('FeedbackContainer', () => {
  beforeEach(jest.clearAllMocks)

  const renderFeedbackContainer = (
    path: string,
    { query, initialRating }: { query?: string; initialRating?: Rating } = {},
  ) =>
    renderAllRoutes(path, {
      CityContentElement: <FeedbackContainer query={query} initialRating={initialRating ?? null} />,
    })

  it('should display thanks message', async () => {
    const { findByText, getByText } = renderFeedbackContainer('/augsburg/de', {
      initialRating: RATING_POSITIVE,
    })
    fireEvent.click(getByText('feedback:useful'))

    getByText('feedback:useful').click()
    getByText('common:privacyPolicy').click()

    fireEvent.click(getByText('feedback:send'))

    expect(await findByText('feedback:thanksMessage')).toBeTruthy()
  })

  it('should display thanks message for search', async () => {
    const { findByText, getByText, queryByText } = renderFeedbackContainer('/augsburg/de/search', { query: 'test' })

    getByText('common:privacyPolicy').click()

    fireEvent.click(getByText('feedback:send'))

    expect(await findByText('feedback:thanksMessage')).toBeTruthy()
    expect(queryByText('feedback:close')).toBeNull()
  })

  it('should display error for search', async () => {
    mockRequest.mockImplementationOnce(() => {
      throw new Error()
    })
    const { findByText, getByText } = renderFeedbackContainer('/augsburg/de/search', { query: 'test' })

    getByText('common:privacyPolicy').click()

    fireEvent.click(getByText('feedback:send'))

    expect(await findByText('feedback:failedSendingFeedback')).toBeTruthy()
  })

  it('should send query for search', async () => {
    const query = 'zeugnis'
    const { getByText } = renderFeedbackContainer('/augsburg/de/search', { query })

    getByText('common:privacyPolicy').click()

    fireEvent.click(getByText('feedback:send'))
    expect(mockRequest).toHaveBeenCalledTimes(1)
    expect(mockRequest).toHaveBeenCalledWith({
      routeType: SEARCH_ROUTE,
      city: 'augsburg',
      language: 'de',
      comment: '',
      contactMail: '',
      isPositiveRating: false,
      query,
      searchTerm: 'zeugnis',
      slug: undefined,
    })
  })

  it('should send original search term if updated', () => {
    const query = 'Zeugnis'
    const fullSearchTerm = 'Zeugnisübergabe'
    const { getByDisplayValue, getByText } = renderFeedbackContainer('/augsburg/de/search', { query })
    const input = getByDisplayValue(query)
    fireEvent.change(input, { target: { value: fullSearchTerm } })

    getByText('common:privacyPolicy').click()

    fireEvent.click(getByText('feedback:send'))
    expect(mockRequest).toHaveBeenCalledTimes(1)
    expect(mockRequest).toHaveBeenCalledWith({
      routeType: SEARCH_ROUTE,
      city: 'augsburg',
      language: 'de',
      comment: '',
      contactMail: '',
      isPositiveRating: false,
      query,
      searchTerm: fullSearchTerm,
      slug: undefined,
    })
  })
})
