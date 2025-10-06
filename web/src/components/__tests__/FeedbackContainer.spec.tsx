import { fireEvent } from '@testing-library/react'
import React, { ComponentProps } from 'react'

import { CATEGORIES_ROUTE, RATING_POSITIVE, SEARCH_ROUTE } from 'shared'
import { FeedbackRouteType } from 'shared/api'

import { renderWithTheme } from '../../testing/render'
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
  const cityCode = 'augsburg'
  const language = 'de'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  const buildDefaultProps = (
    routeType: FeedbackRouteType,
    query?: string,
  ): ComponentProps<typeof FeedbackContainer> => ({
    routeType,
    cityCode,
    language,
    query,
    initialRating: null,
  })

  it('should display thanks message', async () => {
    const { getByRole, findByText, getByText } = renderWithTheme(
      <FeedbackContainer {...buildDefaultProps(CATEGORIES_ROUTE)} initialRating={RATING_POSITIVE} />,
    )
    const buttonRating = getByRole('button', {
      name: 'feedback:useful',
    })
    fireEvent.click(buttonRating)

    getByText('feedback:useful').click()
    getByText('common:privacyPolicy').click()

    const button = getByRole('button', {
      name: 'feedback:send',
    })
    fireEvent.click(button)

    expect(await findByText('feedback:thanksMessage')).toBeTruthy()
  })

  it('should display thanks message for search', async () => {
    const { getByRole, findByText, queryByRole, getByText } = renderWithTheme(
      <FeedbackContainer {...buildDefaultProps(CATEGORIES_ROUTE, 'test')} />,
    )

    getByText('common:privacyPolicy').click()

    const button = getByRole('button', {
      name: 'feedback:send',
    })
    fireEvent.click(button)

    expect(await findByText('feedback:thanksMessage')).toBeTruthy()
    expect(queryByRole('button', { name: 'feedback:close' })).toBeNull()
  })

  it('should display error for search', async () => {
    mockRequest.mockImplementationOnce(() => {
      throw new Error()
    })
    const { getByRole, findByText, getByText } = renderWithTheme(
      <FeedbackContainer {...buildDefaultProps(SEARCH_ROUTE, 'test')} />,
    )

    getByText('common:privacyPolicy').click()

    const button = getByRole('button', {
      name: 'feedback:send',
    })
    fireEvent.click(button)

    expect(await findByText('feedback:failedSendingFeedback')).toBeTruthy()
  })

  it('should send query for search', async () => {
    const query = 'zeugnis'
    const { getByRole, getByText } = renderWithTheme(<FeedbackContainer {...buildDefaultProps(SEARCH_ROUTE, query)} />)

    getByText('common:privacyPolicy').click()

    const button = getByRole('button', {
      name: 'feedback:send',
    })
    fireEvent.click(button)
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
    const { getByDisplayValue, getByRole, getByText } = renderWithTheme(
      <FeedbackContainer {...buildDefaultProps(SEARCH_ROUTE, query)} />,
    )
    const input = getByDisplayValue(query)
    fireEvent.change(input, { target: { value: fullSearchTerm } })

    getByText('common:privacyPolicy').click()

    const button = getByRole('button', {
      name: 'feedback:send',
    })
    fireEvent.click(button)
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
