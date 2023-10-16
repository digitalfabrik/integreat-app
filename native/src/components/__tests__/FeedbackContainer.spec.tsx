import { NavigationContainer } from '@react-navigation/native'
import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import {
  FeedbackType,
  CATEGORIES_ROUTE,
  CONTENT_FEEDBACK_CATEGORY,
  SEND_FEEDBACK_SIGNAL_NAME,
  SEARCH_ROUTE,
} from 'api-client'

import render from '../../testing/render'
import sendTrackingSignal from '../../utils/sendTrackingSignal'
import FeedbackContainer from '../FeedbackContainer'

const mockRequest = jest.fn(() => Promise.resolve())
jest.mock('styled-components')
jest.mock('react-i18next')
jest.mock('../../utils/sendTrackingSignal')
jest.mock('api-client', () => ({
  ...jest.requireActual('api-client'),
  createFeedbackEndpoint: (_unusedBaseUrl: string) => ({
    request: mockRequest,
  }),
}))

describe('FeedbackContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const city = 'augsburg'
  const language = 'de'

  it('should send feedback request with rating and no other inputs on submit', async () => {
    const { getByText, findByText } = render(
      <NavigationContainer>
        <FeedbackContainer routeType={CATEGORIES_ROUTE} isSearchFeedback={false} language={language} cityCode={city} />
      </NavigationContainer>,
    )
    const positiveRatingButton = getByText('useful')
    fireEvent.press(positiveRatingButton)
    expect(await findByText('send')).not.toBeDisabled()
    const submitButton = getByText('send')
    fireEvent.press(submitButton)
    expect(await findByText('thanksMessage')).toBeDefined()
    expect(mockRequest).toHaveBeenCalledTimes(1)
    expect(mockRequest).toHaveBeenCalledWith({
      feedbackType: FeedbackType.categories,
      feedbackCategory: CONTENT_FEEDBACK_CATEGORY,
      isPositiveRating: true,
      city,
      language,
      comment: expect.stringContaining('Kontaktadresse: Keine Angabe'),
    })
    expect(sendTrackingSignal).toHaveBeenCalledTimes(1)
    expect(sendTrackingSignal).toHaveBeenCalledWith({
      signal: {
        name: SEND_FEEDBACK_SIGNAL_NAME,
        feedback: {
          positive: true,
          numCharacters: 0,
          contactMail: false,
        },
      },
    })
  })

  it('should send feedback request with comment and contact information on submit without rating', async () => {
    const comment = 'my comment'
    const contactMail = 'test@example.com'
    const { getByText, findByText, getAllByDisplayValue } = render(
      <NavigationContainer>
        {' '}
        <FeedbackContainer routeType={CATEGORIES_ROUTE} isSearchFeedback={false} language={language} cityCode={city} />
      </NavigationContainer>,
    )
    const [commentField, emailField] = getAllByDisplayValue('')
    fireEvent.changeText(commentField!, comment)
    fireEvent.changeText(emailField!, contactMail)
    const button = getByText('send')
    fireEvent.press(button)
    expect(await findByText('thanksMessage')).toBeDefined()
    expect(mockRequest).toHaveBeenCalledTimes(1)
    expect(mockRequest).toHaveBeenCalledWith({
      feedbackType: FeedbackType.categories,
      feedbackCategory: CONTENT_FEEDBACK_CATEGORY,
      isPositiveRating: null,
      city,
      language,
      comment: `${comment}    Kontaktadresse: ${contactMail}`,
    })
    expect(sendTrackingSignal).toHaveBeenCalledTimes(1)
    expect(sendTrackingSignal).toHaveBeenCalledWith({
      signal: {
        name: SEND_FEEDBACK_SIGNAL_NAME,
        feedback: {
          positive: null,
          numCharacters: comment.length,
          contactMail: true,
        },
      },
    })
  })

  it('should disable send feedback button if rating button is clicked twice', async () => {
    const { getByText, findByText } = render(
      <NavigationContainer>
        <FeedbackContainer routeType={CATEGORIES_ROUTE} isSearchFeedback={false} language={language} cityCode={city} />
      </NavigationContainer>,
    )
    const positiveRatingButton = getByText('useful')
    fireEvent.press(positiveRatingButton)
    expect(await findByText('send')).not.toBeDisabled()
    fireEvent.press(positiveRatingButton)
    expect(await findByText('send')).toBeDisabled()
  })

  it('should send search feedback on submit', async () => {
    const query = 'Zeugnis'
    const { findByText, getByText } = render(
      <NavigationContainer>
        <FeedbackContainer
          routeType={SEARCH_ROUTE}
          isSearchFeedback
          language={language}
          cityCode={city}
          query={query}
        />
      </NavigationContainer>,
    )
    const button = getByText('send')
    fireEvent.press(button)
    expect(await findByText('thanksMessage')).toBeDefined()
    expect(mockRequest).toHaveBeenCalledTimes(1)
    expect(mockRequest).toHaveBeenCalledWith({
      feedbackType: FeedbackType.search,
      feedbackCategory: CONTENT_FEEDBACK_CATEGORY,
      isPositiveRating: null,
      city,
      language,
      comment: '    Kontaktadresse: Keine Angabe',
      query,
      slug: undefined,
    })
  })

  it('should send original search term for search feedback if edited', async () => {
    const query = 'Zeugnis'
    const fullSearchTerm = 'Zeugnisübergabe'
    const { findByText, getByTestId, getByText } = render(
      <NavigationContainer>
        <FeedbackContainer
          routeType={SEARCH_ROUTE}
          isSearchFeedback
          language={language}
          cityCode={city}
          query={query}
        />
      </NavigationContainer>,
    )
    const input = getByTestId('searchTerm')
    fireEvent.changeText(input, fullSearchTerm)
    const button = getByText('send')
    fireEvent.press(button)
    expect(await findByText('thanksMessage')).toBeDefined()
    expect(mockRequest).toHaveBeenCalledTimes(1)
    expect(mockRequest).toHaveBeenCalledWith({
      feedbackType: FeedbackType.search,
      feedbackCategory: CONTENT_FEEDBACK_CATEGORY,
      isPositiveRating: null,
      city,
      language,
      comment: '    Kontaktadresse: Keine Angabe',
      query: `${fullSearchTerm} (actual query: ${query})`,
      slug: undefined,
    })
  })
})
