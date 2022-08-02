import { fireEvent, render, waitFor } from '@testing-library/react'
import React, { ComponentProps } from 'react'
import { ThemeProvider } from 'styled-components'

import {
  CATEGORIES_FEEDBACK_TYPE,
  CATEGORIES_ROUTE,
  DISCLAIMER_ROUTE,
  EVENTS_FEEDBACK_TYPE,
  EVENTS_ROUTE,
  OFFER_FEEDBACK_TYPE,
  OFFERS_FEEDBACK_TYPE,
  OFFERS_ROUTE,
  PAGE_FEEDBACK_TYPE,
  POIS_ROUTE,
  SEARCH_FEEDBACK_TYPE,
  SEARCH_ROUTE,
  SPRUNGBRETT_OFFER,
} from 'api-client'

import buildConfig from '../../constants/buildConfig'
import { RouteType, TU_NEWS_ROUTE } from '../../routes'
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
    route               | inputProps                             | feedbackType
    ${CATEGORIES_ROUTE} | ${{}}                                  | ${CATEGORIES_FEEDBACK_TYPE}
    ${CATEGORIES_ROUTE} | ${{ path: 'augsburg/de' }}             | ${PAGE_FEEDBACK_TYPE}
    ${EVENTS_ROUTE}     | ${{}}                                  | ${EVENTS_FEEDBACK_TYPE}
    ${EVENTS_ROUTE}     | ${{ path: 'augsburg/de/events/1234' }} | ${PAGE_FEEDBACK_TYPE}
    ${OFFERS_ROUTE}     | ${{ alias: SPRUNGBRETT_OFFER }}        | ${OFFER_FEEDBACK_TYPE}
    ${OFFERS_ROUTE}     | ${{}}                                  | ${OFFERS_FEEDBACK_TYPE}
    ${DISCLAIMER_ROUTE} | ${{ path: 'augsburg/de/disclaimer' }}  | ${PAGE_FEEDBACK_TYPE}
    ${POIS_ROUTE}       | ${{ path: 'augsburg/de/pois/1234' }}   | ${PAGE_FEEDBACK_TYPE}
    ${POIS_ROUTE}       | ${{}}                                  | ${CATEGORIES_FEEDBACK_TYPE}
    ${SEARCH_ROUTE}     | ${{ query: 'query ' }}                 | ${SEARCH_FEEDBACK_TYPE}
    ${TU_NEWS_ROUTE}    | ${{}}                                  | ${CATEGORIES_FEEDBACK_TYPE}
  `('should successfully request feedback for $feedbackType', async ({ route, inputProps, feedbackType }) => {
    const { getByRole } = render(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <FeedbackContainer {...buildDefaultProps(route, true, false)} {...inputProps} />
      </ThemeProvider>
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
      alias: inputProps.alias,
      permalink: inputProps.path,
      query: inputProps.query,
    })
  })

  it('should display thanks message for modal', async () => {
    const { getByRole, getByText } = render(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <FeedbackContainer {...buildDefaultProps(CATEGORIES_ROUTE, true, false)} />
      </ThemeProvider>
    )
    const button = getByRole('button', {
      name: 'feedback:send',
    })
    fireEvent.click(button)
    // Needed as submitFeedback is asynchronous
    await waitFor(() => expect(button).toBeEnabled())
    expect(getByRole('button', { name: 'feedback:close' })).toBeTruthy()
    expect(getByText('feedback:thanksMessage')).toBeTruthy()
  })

  it('should display thanks message for search', async () => {
    const { getByRole, getByText, queryByRole } = render(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <FeedbackContainer {...buildDefaultProps(CATEGORIES_ROUTE, true, true)} />
      </ThemeProvider>
    )
    const button = getByRole('button', {
      name: 'feedback:send',
    })
    fireEvent.click(button)
    // Needed as submitFeedback is asynchronous
    await waitFor(() => expect(button).toBeEnabled())
    expect(queryByRole('button', { name: 'feedback:close' })).toBeNull()
    expect(getByText('feedback:thanksMessage')).toBeTruthy()
  })

  it('should display error', async () => {
    mockRequest.mockImplementationOnce(() => {
      throw new Error()
    })
    const { getByRole, getByText } = render(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <FeedbackContainer {...buildDefaultProps(SEARCH_ROUTE, true, true)} />
      </ThemeProvider>
    )
    const button = getByRole('button', {
      name: 'feedback:send',
    })
    fireEvent.click(button)
    // Needed as submitFeedback is asynchronous
    await waitFor(() => expect(getByText('feedback:failedSendingFeedback')).toBeTruthy())
  })
})
