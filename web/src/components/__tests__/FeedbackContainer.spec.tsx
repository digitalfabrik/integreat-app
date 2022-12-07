import { findByText, fireEvent, waitFor } from '@testing-library/react'
import React, { ComponentProps } from 'react'

import {
  CATEGORIES_ROUTE,
  DISCLAIMER_ROUTE,
  EVENTS_ROUTE,
  FeedbackType,
  OFFERS_ROUTE,
  POIS_ROUTE,
  SEARCH_ROUTE,
  SPRUNGBRETT_OFFER,
} from 'api-client'

import { RouteType, TU_NEWS_ROUTE } from '../../routes'
import { renderWithTheme } from '../../testing/render'
import FeedbackContainer from '../FeedbackContainer'

const mockRequest = jest.fn()
jest.mock('react-i18next')
jest.mock('api-client', () => ({
  ...jest.requireActual('api-client'),
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
    routeType: RouteType,
    isPositiveFeedback: boolean,
    isSearchFeedback: boolean
  ): ComponentProps<typeof FeedbackContainer> => ({
    routeType,
    cityCode,
    language,
    closeModal,
    isPositiveFeedback,
    isSearchFeedback,
  })

  it.each`
    route               | inputProps                     | feedbackType
    ${CATEGORIES_ROUTE} | ${{}}                          | ${FeedbackType.categories}
    ${CATEGORIES_ROUTE} | ${{ slug: 'willkommen' }}      | ${FeedbackType.page}
    ${EVENTS_ROUTE}     | ${{}}                          | ${FeedbackType.events}
    ${EVENTS_ROUTE}     | ${{ slug: '1234' }}            | ${FeedbackType.event}
    ${OFFERS_ROUTE}     | ${{ slug: SPRUNGBRETT_OFFER }} | ${FeedbackType.offer}
    ${OFFERS_ROUTE}     | ${{}}                          | ${FeedbackType.offers}
    ${DISCLAIMER_ROUTE} | ${{}}                          | ${FeedbackType.imprint}
    ${POIS_ROUTE}       | ${{ slug: '1234' }}            | ${FeedbackType.poi}
    ${POIS_ROUTE}       | ${{}}                          | ${FeedbackType.map}
    ${SEARCH_ROUTE}     | ${{ query: 'query ' }}         | ${FeedbackType.search}
    ${TU_NEWS_ROUTE}    | ${{}}                          | ${FeedbackType.categories}
  `('should successfully request feedback for $feedbackType', async ({ route, inputProps, feedbackType }) => {
    const { getByRole } = renderWithTheme(
      <FeedbackContainer {...buildDefaultProps(route, true, false)} {...inputProps} />
    )
    const button = getByRole('button', {
      name: 'feedback:send',
    })
    fireEvent.click(button)
    // Needed as submitFeedback is asynchronous
    await waitFor(() => expect(button).toBeEnabled())
    expect(mockRequest).toHaveBeenCalledTimes(1)
    expect(mockRequest).toHaveBeenCalledWith({
      feedbackType,
      city: 'augsburg',
      language: 'de',
      comment: '    Kontaktadresse: Keine Angabe',
      feedbackCategory: 'Inhalte',
      isPositiveRating: true,
      query: inputProps.query,
      slug: inputProps.slug,
    })
  })

  it('should display thanks message for modal', async () => {
    const { getByRole, findByText } = renderWithTheme(
      <FeedbackContainer {...buildDefaultProps(CATEGORIES_ROUTE, true, false)} />
    )
    const button = getByRole('button', {
      name: 'feedback:send',
    })
    fireEvent.click(button)

    expect(await findByText('feedback:thanksMessage')).toBeTruthy()
    expect(getByRole('button', { name: 'feedback:close' })).toBeTruthy()
  })

  it('should display thanks message for search', async () => {
    const { getByRole, findByText, queryByRole } = renderWithTheme(
      <FeedbackContainer {...buildDefaultProps(CATEGORIES_ROUTE, true, true)} />
    )
    const button = getByRole('button', {
      name: 'feedback:send',
    })
    fireEvent.click(button)

    expect(await findByText('feedback:thanksMessage')).toBeTruthy()
    expect(queryByRole('button', { name: 'feedback:close' })).toBeNull()
  })

  it('should display error', async () => {
    mockRequest.mockImplementationOnce(() => {
      throw new Error()
    })
    const { getByRole, findByText } = renderWithTheme(
      <FeedbackContainer {...buildDefaultProps(SEARCH_ROUTE, true, true)} />
    )
    const button = getByRole('button', {
      name: 'feedback:send',
    })
    fireEvent.click(button)

    expect(await findByText('feedback:failedSendingFeedback')).toBeTruthy()
  })
})
