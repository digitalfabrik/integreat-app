import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import {
  CATEGORIES_FEEDBACK_TYPE,
  CATEGORIES_ROUTE,
  CONTENT_FEEDBACK_CATEGORY,
  SEND_FEEDBACK_SIGNAL_NAME
} from 'api-client'

import buildConfig from '../../constants/buildConfig'
import render from '../../testing/render'
import sendTrackingSignal from '../../utils/sendTrackingSignal'
import FeedbackContainer from '../FeedbackContainer'

const mockRequest = jest.fn(() => Promise.resolve())
jest.mock('react-i18next')
jest.mock('../../utils/sendTrackingSignal')
jest.mock('api-client', () => ({
  ...jest.requireActual('api-client'),
  createFeedbackEndpoint: (_unusedBaseUrl: string) => ({
    request: mockRequest
  })
}))

describe('FeedbackContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  const city = 'augsburg'
  const language = 'de'
  it('should send feedback request on submit', async () => {
    const { getByText, findByText } = render(
      <FeedbackContainer
        routeType={CATEGORIES_ROUTE}
        isPositiveFeedback
        isSearchFeedback={false}
        language={language}
        cityCode={city}
        theme={buildConfig().lightTheme}
      />
    )
    const button = getByText('send')
    fireEvent.press(button)
    expect(await findByText('feedback:feedbackSent')).toBeDefined()
    expect(mockRequest).toHaveBeenCalledTimes(1)
    expect(mockRequest).toHaveBeenCalledWith({
      feedbackType: CATEGORIES_FEEDBACK_TYPE,
      feedbackCategory: CONTENT_FEEDBACK_CATEGORY,
      isPositiveRating: true,
      city,
      language,
      comment: expect.stringContaining('Kontaktadresse: Keine Angabe')
    })
    expect(sendTrackingSignal).toHaveBeenCalledTimes(1)
    expect(sendTrackingSignal).toHaveBeenCalledWith({
      signal: {
        name: SEND_FEEDBACK_SIGNAL_NAME,
        feedback: {
          positive: true,
          numCharacters: 0,
          contactMail: false
        }
      }
    })
  })
  it('should send feedback request with comment and contact information on submit', async () => {
    const comment = 'my comment'
    const contactMail = 'test@example.com'
    const { getByText, findByText, getAllByDisplayValue } = render(
      <FeedbackContainer
        routeType={CATEGORIES_ROUTE}
        isPositiveFeedback
        isSearchFeedback={false}
        language={language}
        cityCode={city}
        theme={buildConfig().lightTheme}
      />
    )
    const [commentField, emailField] = getAllByDisplayValue('')
    fireEvent.changeText(commentField!, comment)
    fireEvent.changeText(emailField!, contactMail)
    const button = getByText('send')
    fireEvent.press(button)
    expect(await findByText('feedback:feedbackSent')).toBeDefined()
    expect(mockRequest).toHaveBeenCalledTimes(1)
    expect(mockRequest).toHaveBeenCalledWith({
      alias: undefined,
      feedbackType: CATEGORIES_FEEDBACK_TYPE,
      feedbackCategory: CONTENT_FEEDBACK_CATEGORY,
      isPositiveRating: true,
      city,
      language,
      comment: `${comment}    Kontaktadresse: ${contactMail}`,
      permalink: undefined,
      query: undefined
    })
    expect(sendTrackingSignal).toHaveBeenCalledTimes(1)
    expect(sendTrackingSignal).toHaveBeenCalledWith({
      signal: {
        name: SEND_FEEDBACK_SIGNAL_NAME,
        feedback: {
          positive: true,
          numCharacters: comment.length,
          contactMail: true
        }
      }
    })
  })
})
