import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import FeedbackContainer from '../FeedbackContainer'
import sendTrackingSignal from '../../endpoint/sendTrackingSignal'
import {
  CATEGORIES_FEEDBACK_TYPE,
  CATEGORIES_ROUTE,
  CONTENT_FEEDBACK_CATEGORY,
  SEND_FEEDBACK_SIGNAL_NAME
} from 'api-client'
import buildConfig from '../../app/constants/buildConfig'
const mockRequest = jest.fn(() => Promise.resolve())
jest.mock('react-i18next')
jest.mock('../../endpoint/sendTrackingSignal')
jest.mock('api-client', () => {
  return {
    ...jest.requireActual('api-client'),
    createFeedbackEndpoint: (baseUrl: string) => ({
      request: mockRequest
    })
  }
})
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: text => text
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
    fireEvent.changeText(commentField, comment)
    fireEvent.changeText(emailField, contactMail)
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
