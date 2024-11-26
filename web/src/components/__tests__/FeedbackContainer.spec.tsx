import { fireEvent } from '@testing-library/react'
import React, { ComponentProps } from 'react'

import { CATEGORIES_ROUTE, SEARCH_ROUTE } from 'shared'
import { FeedbackRouteType } from 'shared/api'

import { renderWithTheme } from '../../testing/render'
import FeedbackContainer from '../FeedbackContainer'

const mockRequest = jest.fn()
jest.mock('react-i18next')
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
  const closeModal = jest.fn()

  const buildDefaultProps = (
    routeType: FeedbackRouteType,
    query?: string,
  ): ComponentProps<typeof FeedbackContainer> => ({
    routeType,
    cityCode,
    language,
    onClose: closeModal,
    query,
    isPositiveRating: null,
  })

  it('should display thanks message for modal', async () => {
    const { getByRole, findByText } = renderWithTheme(
      <FeedbackContainer {...buildDefaultProps(CATEGORIES_ROUTE)} isPositiveRating />,
    )
    const button = getByRole('button', {
      name: 'feedback:send',
    })
    fireEvent.click(button)

    expect(await findByText('feedback:thanksMessage')).toBeTruthy()
    expect(getByRole('button', { name: 'feedback:common:close' })).toBeTruthy()
  })

  it('should display thanks message for search', async () => {
    const { getByRole, findByText, queryByRole } = renderWithTheme(
      <FeedbackContainer {...buildDefaultProps(CATEGORIES_ROUTE, 'test')} />,
    )
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
    const { getByRole, findByText } = renderWithTheme(
      <FeedbackContainer {...buildDefaultProps(SEARCH_ROUTE, 'test')} />,
    )
    const button = getByRole('button', {
      name: 'feedback:send',
    })
    fireEvent.click(button)

    expect(await findByText('feedback:failedSendingFeedback')).toBeTruthy()
  })

  it('should send query for search', async () => {
    const query = 'zeugnis'
    const { getByRole } = renderWithTheme(<FeedbackContainer {...buildDefaultProps(SEARCH_ROUTE, query)} />)
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
      isPositiveRating: null,
      query,
      searchTerm: 'zeugnis',
      slug: undefined,
    })
  })

  it('should send original search term if updated', () => {
    const query = 'Zeugnis'
    const fullSearchTerm = 'Zeugnisübergabe'
    const { getByDisplayValue, getByRole } = renderWithTheme(
      <FeedbackContainer {...buildDefaultProps(SEARCH_ROUTE, query)} />,
    )
    const input = getByDisplayValue(query)
    fireEvent.change(input, { target: { value: fullSearchTerm } })
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
      isPositiveRating: null,
      query,
      searchTerm: fullSearchTerm,
      slug: undefined,
    })
  })
})
