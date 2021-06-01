import React, { ComponentProps } from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'
import {
  CATEGORIES_FEEDBACK_TYPE,
  EVENTS_FEEDBACK_TYPE,
  OFFER_FEEDBACK_TYPE,
  OFFERS_FEEDBACK_TYPE,
  PAGE_FEEDBACK_TYPE,
  SPRUNGBRETT_OFFER
} from 'api-client'
import { ThemeProvider } from 'styled-components'
import { Routes, RouteType } from '../../routes/App'
import { lightTheme } from 'build-configs/integreat/theme'
import FeedbackBoxContainer from '../FeedbackBoxContainer'
import { SendingStatusType } from '../FeedbackModal'

const mockRequest = jest.fn()
jest.mock('react-i18next')
jest.mock('api-client', () => {
  return {
    ...jest.requireActual('api-client'),
    createFeedbackEndpoint: (baseUrl: string) => ({
      request: mockRequest
    })
  }
})

describe('FeedbackBoxContainer', () => {
  const city = 'augsburg'
  const language = 'de'

  beforeEach(() => {
    jest.clearAllMocks()
  })
  const closeFeedbackModal = jest.fn()
  const onSubmit = jest.fn()

  const buildDefaultProps = (
    routeType: RouteType,
    isPositiveRatingSelected: boolean,
    sendingStatus: SendingStatusType = 'IDLE'
  ): ComponentProps<typeof FeedbackBoxContainer> => {
    return {
      routeType,
      city,
      language,
      closeFeedbackModal,
      isPositiveRatingSelected,
      sendingStatus,
      onSubmit
    }
  }

  it('should set the submit that an error occurred', async () => {
    mockRequest.mockImplementationOnce(() => {
      throw new Error()
    })
    const { getByRole } = render(
      <ThemeProvider theme={lightTheme}>
        <FeedbackBoxContainer {...buildDefaultProps(Routes.CATEGORIES_ROUTE, true)} />
      </ThemeProvider>
    )
    const button = getByRole('button', {
      name: 'feedback:send'
    })
    fireEvent.click(button)
    // Needed as submitFeedback is asynchronous
    await waitFor(() => expect(button).not.toBeDisabled())
    expect(onSubmit).toBeCalledWith('ERROR')
  })
  it.each`
    routeType                  | inputProps                             | feedbackType
    ${Routes.CATEGORIES_ROUTE} | ${{}}                                  | ${CATEGORIES_FEEDBACK_TYPE}
    ${Routes.CATEGORIES_ROUTE} | ${{ path: 'augsburg/de' }}             | ${PAGE_FEEDBACK_TYPE}
    ${Routes.EVENTS_ROUTE}     | ${{}}                                  | ${EVENTS_FEEDBACK_TYPE}
    ${Routes.EVENTS_ROUTE}     | ${{ path: 'augsburg/de/events/1234' }} | ${PAGE_FEEDBACK_TYPE}
    ${Routes.OFFERS_ROUTE}     | ${{ alias: SPRUNGBRETT_OFFER }}        | ${OFFER_FEEDBACK_TYPE}
    ${Routes.OFFERS_ROUTE}     | ${{}}                                  | ${OFFERS_FEEDBACK_TYPE}
    ${Routes.DISCLAIMER_ROUTE} | ${{ path: 'augsburg/de/disclaimer' }}  | ${PAGE_FEEDBACK_TYPE}
    ${Routes.POIS_ROUTE}       | ${{ path: 'augsburg/de/pois/1234' }}   | ${PAGE_FEEDBACK_TYPE}
    ${Routes.POIS_ROUTE}       | ${{}}                                  | ${CATEGORIES_FEEDBACK_TYPE}
  `('should successfully request feedback for $feedbackType', async ({ routeType, inputProps, feedbackType }) => {
    const { getByRole } = render(
      <ThemeProvider theme={lightTheme}>
        <FeedbackBoxContainer {...buildDefaultProps(routeType, true)} {...inputProps} />
      </ThemeProvider>
    )
    const button = getByRole('button', {
      name: 'feedback:send'
    })
    fireEvent.click(button)
    // Needed as submitFeedback is asynchronous
    await waitFor(() => expect(button).not.toBeDisabled())
    expect(mockRequest).toBeCalledTimes(1)
    expect(mockRequest).toBeCalledWith({
      feedbackType: feedbackType,
      city: 'augsburg',
      language: 'de',
      comment: '    Kontaktadresse: Keine Angabe',
      isPositiveRating: true,
      alias: inputProps.alias,
      permalink: inputProps.path,
      query: inputProps.query
    })
    expect(onSubmit).toBeCalledWith('SUCCESS')
  })
})
