import React, { ComponentProps } from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'
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
  SPRUNGBRETT_OFFER
} from 'api-client'
import { ThemeProvider } from 'styled-components'
import buildConfig from '../../constants/buildConfig'
import FeedbackContainer from '../FeedbackContainer'
import { SendingStatusType } from '../FeedbackModal'
import { RouteType } from '../../routes'

const mockRequest = jest.fn()
jest.mock('react-i18next')
jest.mock('api-client', () => {
  return {
    ...jest.requireActual('api-client'),
    createFeedbackEndpoint: () => ({
      request: mockRequest
    })
  }
})

describe('FeedbackContainer', () => {
  const cityCode = 'augsburg'
  const language = 'de'

  beforeEach(() => {
    jest.clearAllMocks()
  })
  const closeFeedbackModal = jest.fn()
  const onSubmit = jest.fn()

  const buildDefaultProps = (
    route: RouteType,
    isPositiveRatingSelected: boolean,
    sendingStatus: SendingStatusType = 'IDLE'
  ): ComponentProps<typeof FeedbackContainer> => {
    return {
      route,
      cityCode,
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
      <ThemeProvider theme={buildConfig().lightTheme}>
        <FeedbackContainer {...buildDefaultProps(CATEGORIES_ROUTE, true)} />
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
  `('should successfully request feedback for $feedbackType', async ({ route, inputProps, feedbackType }) => {
    const { getByRole } = render(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <FeedbackContainer {...buildDefaultProps(route, true)} {...inputProps} />
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
