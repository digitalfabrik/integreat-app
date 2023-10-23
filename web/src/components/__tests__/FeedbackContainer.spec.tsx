import { fireEvent, waitFor } from '@testing-library/react'
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
    isSearchFeedback: boolean,
  ): ComponentProps<typeof FeedbackContainer> => ({
    routeType,
    cityCode,
    language,
    closeModal,
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
  `(
    'should successfully request feedback for $feedbackType if rating was set',
    async ({ route, inputProps, feedbackType }) => {
      const { getByRole } = renderWithTheme(<FeedbackContainer {...buildDefaultProps(route, false)} {...inputProps} />)
      const buttonRating = getByRole('button', {
        name: 'feedback:useful',
      })
      fireEvent.click(buttonRating)
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
    },
  )

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
  `(
    'should successfully request feedback for $feedbackType if rating was set',
    async ({ route, inputProps, feedbackType }) => {
      const { getByRole } = renderWithTheme(<FeedbackContainer {...buildDefaultProps(route, false)} {...inputProps} />)
      const buttonRating = getByRole('button', {
        name: 'feedback:useful',
      })
      fireEvent.click(buttonRating)
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
    },
  )

  it('should display thanks message for modal', async () => {
    const { getByRole, findByText } = renderWithTheme(
      <FeedbackContainer {...buildDefaultProps(CATEGORIES_ROUTE, false)} />,
    )
    const buttonRating = getByRole('button', {
      name: 'feedback:useful',
    })
    fireEvent.click(buttonRating)
    const button = getByRole('button', {
      name: 'feedback:send',
    })
    fireEvent.click(button)

    expect(await findByText('feedback:thanksMessage')).toBeTruthy()
    expect(getByRole('button', { name: 'feedback:common:close' })).toBeTruthy()
  })

  it('should display thanks message for search', async () => {
    const { getByRole, findByText, queryByRole } = renderWithTheme(
      <FeedbackContainer {...buildDefaultProps(CATEGORIES_ROUTE, true)} query='test' />,
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
      <FeedbackContainer {...buildDefaultProps(SEARCH_ROUTE, true)} query='test' />,
    )
    const button = getByRole('button', {
      name: 'feedback:send',
    })
    fireEvent.click(button)

    expect(await findByText('feedback:failedSendingFeedback')).toBeTruthy()
  })

  it('should send query for search', async () => {
    const query = 'zeugnis'
    const { getByRole } = renderWithTheme(
      <FeedbackContainer {...buildDefaultProps(SEARCH_ROUTE, true)} query={query} />,
    )
    const button = getByRole('button', {
      name: 'feedback:send',
    })
    fireEvent.click(button)
    expect(mockRequest).toHaveBeenCalledTimes(1)
    expect(mockRequest).toHaveBeenCalledWith({
      feedbackType: SEARCH_ROUTE,
      city: 'augsburg',
      language: 'de',
      comment: '    Kontaktadresse: Keine Angabe',
      feedbackCategory: 'Inhalte',
      isPositiveRating: null,
      query,
      slug: undefined,
    })
  })

  it('should send original search term if updated', () => {
    const query = 'Zeugnis'
    const fullSearchTerm = 'Zeugnisübergabe'
    const { getByDisplayValue, getByRole } = renderWithTheme(
      <FeedbackContainer {...buildDefaultProps(SEARCH_ROUTE, true)} query={query} />,
    )
    const input = getByDisplayValue(query)
    fireEvent.change(input, { target: { value: fullSearchTerm } })
    const button = getByRole('button', {
      name: 'feedback:send',
    })
    fireEvent.click(button)
    expect(mockRequest).toHaveBeenCalledTimes(1)
    expect(mockRequest).toHaveBeenCalledWith({
      feedbackType: SEARCH_ROUTE,
      city: 'augsburg',
      language: 'de',
      comment: '    Kontaktadresse: Keine Angabe',
      feedbackCategory: 'Inhalte',
      isPositiveRating: null,
      query: `${fullSearchTerm} (actual query: ${query})`,
      slug: undefined,
    })
  })
})
