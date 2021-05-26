// @flow

import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { FeedbackBoxContainer } from '../FeedbackBoxContainer'
import { CATEGORIES_ROUTE } from '../../../app/route-configs/CategoriesRouteConfig'
import createLocation from '../../../../createLocation'
import {
  CATEGORIES_FEEDBACK_TYPE,
  EVENTS_FEEDBACK_TYPE,
  OFFER_FEEDBACK_TYPE,
  OFFERS_FEEDBACK_TYPE,
  PAGE_FEEDBACK_TYPE,
  SPRUNGBRETT_OFFER
} from 'api-client'
import { ThemeProvider } from 'styled-components'
import lightTheme from '../../../theme/constants/theme'
import { EVENTS_ROUTE } from '../../../app/route-configs/EventsRouteConfig'
import { OFFERS_ROUTE } from '../../../app/route-configs/OffersRouteConfig'
import { POIS_ROUTE } from '../../../app/route-configs/PoisRouteConfig'
import { DISCLAIMER_ROUTE } from '../../../app/route-configs/DisclaimerRouteConfig'

const mockRequest = jest.fn()
jest.mock('react-i18next')
jest.mock('redux-first-router-link')
jest.mock('api-client', () => {
  return {
    ...jest.requireActual('api-client'),
    createFeedbackEndpoint: (baseUrl: string) => ({ request: mockRequest })
  }
})

describe('FeedbackBoxContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const closeFeedbackModal = jest.fn()
  const onSubmit = jest.fn()
  const t = (key: ?string): string => key || ''

  const buildDefaultProps = (locationType, isPositiveRatingSelected, sendingStatus = 'IDLE') => {
    const location = createLocation({
      type: locationType,
      payload: { city: 'augsburg', language: 'de' }
    })
    return {
      closeFeedbackModal,
      location,
      isPositiveRatingSelected,
      sendingStatus,
      onSubmit,
      t
    }
  }

  it('should set the submit that an error occured', async () => {
    mockRequest.mockImplementationOnce(() => {
      throw new Error()
    })
    const { getByRole } = render(
      <ThemeProvider theme={lightTheme}>
        <FeedbackBoxContainer {...buildDefaultProps(CATEGORIES_ROUTE, true)} />
      </ThemeProvider>
    )

    const button = getByRole('button', { name: 'feedback:send' })
    fireEvent.click(button)

    // Needed as submitFeedback is asynchronous
    await waitFor(() => expect(button).not.toBeDisabled())

    expect(onSubmit).toBeCalledWith('ERROR')
  })

  it.each`
    routeType           | inputProps                             | feedbackType
    ${CATEGORIES_ROUTE} | ${{}}                                  | ${CATEGORIES_FEEDBACK_TYPE}
    ${CATEGORIES_ROUTE} | ${{ path: 'augsburg/de' }}             | ${PAGE_FEEDBACK_TYPE}
    ${EVENTS_ROUTE}     | ${{}}                                  | ${EVENTS_FEEDBACK_TYPE}
    ${EVENTS_ROUTE}     | ${{ path: 'augsburg/de/events/1234' }} | ${PAGE_FEEDBACK_TYPE}
    ${OFFERS_ROUTE}     | ${{ alias: SPRUNGBRETT_OFFER }}        | ${OFFER_FEEDBACK_TYPE}
    ${OFFERS_ROUTE}     | ${{}}                                  | ${OFFERS_FEEDBACK_TYPE}
    ${DISCLAIMER_ROUTE} | ${{ path: 'augsburg/de/disclaimer' }}  | ${PAGE_FEEDBACK_TYPE}
    ${POIS_ROUTE}       | ${{ path: 'augsburg/de/pois/1234' }}   | ${PAGE_FEEDBACK_TYPE}
    ${POIS_ROUTE}       | ${{}}                                  | ${CATEGORIES_FEEDBACK_TYPE}
  `('should successfully request feedback for $feedbackType', async ({ routeType, inputProps, feedbackType }) => {
    const { getByRole } = render(
      <ThemeProvider theme={lightTheme}>
        <FeedbackBoxContainer {...buildDefaultProps(routeType, true)} {...inputProps} />
      </ThemeProvider>
    )

    const button = getByRole('button', { name: 'feedback:send' })
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
