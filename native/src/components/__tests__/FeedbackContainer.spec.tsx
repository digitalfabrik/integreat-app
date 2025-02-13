import { NavigationContainer } from '@react-navigation/native'
import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import { CATEGORIES_ROUTE, SEND_FEEDBACK_SIGNAL_NAME, SEARCH_ROUTE } from 'shared'

import render from '../../testing/render'
import sendTrackingSignal from '../../utils/sendTrackingSignal'
import FeedbackContainer from '../FeedbackContainer'

const mockRequest = jest.fn()
jest.mock('styled-components')
jest.mock('react-i18next')
jest.mock('../../utils/sendTrackingSignal')
jest.mock('shared/api', () => ({
  ...jest.requireActual('shared/api'),
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

  it('should disable send button if privacy policy is not accepted', async () => {
    const { findByText, getByText } = render(
      <NavigationContainer>
        <FeedbackContainer routeType={SEARCH_ROUTE} language={language} cityCode={city} />
      </NavigationContainer>,
    )
    const positiveRatingButton = getByText('useful')
    fireEvent.press(positiveRatingButton)

    expect(await findByText('send')).toBeDisabled()
  })

  it('should send feedback request with rating and no other inputs on submit', async () => {
    const { getByText, findByText } = render(
      <NavigationContainer>
        <FeedbackContainer routeType={CATEGORIES_ROUTE} language={language} cityCode={city} />
      </NavigationContainer>,
    )
    fireEvent.press(getByText('common:privacyPolicy'))

    const positiveRatingButton = getByText('useful')
    fireEvent.press(positiveRatingButton)
    expect(getByText('send')).not.toBeDisabled()
    const submitButton = getByText('send')
    fireEvent.press(submitButton)
    expect(await findByText('thanksMessage')).toBeDefined()
    expect(mockRequest).toHaveBeenCalledTimes(1)
    expect(mockRequest).toHaveBeenCalledWith({
      routeType: CATEGORIES_ROUTE,
      isPositiveRating: true,
      city,
      language,
      comment: '',
      contactMail: '',
      query: undefined,
      searchTerm: undefined,
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
        <FeedbackContainer routeType={CATEGORIES_ROUTE} language={language} cityCode={city} />
      </NavigationContainer>,
    )
    fireEvent.press(getByText('common:privacyPolicy'))
    const [commentField, emailField] = getAllByDisplayValue('')
    fireEvent.changeText(commentField!, comment)
    fireEvent.changeText(emailField!, contactMail)
    const button = getByText('send')
    fireEvent.press(button)
    expect(await findByText('thanksMessage')).toBeDefined()
    expect(mockRequest).toHaveBeenCalledTimes(1)
    expect(mockRequest).toHaveBeenCalledWith({
      routeType: CATEGORIES_ROUTE,
      isPositiveRating: null,
      city,
      language,
      comment,
      contactMail,
      query: undefined,
      searchTerm: undefined,
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
        <FeedbackContainer routeType={CATEGORIES_ROUTE} language={language} cityCode={city} />
      </NavigationContainer>,
    )
    fireEvent.press(getByText('common:privacyPolicy'))
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
        <FeedbackContainer routeType={SEARCH_ROUTE} language={language} cityCode={city} query={query} />
      </NavigationContainer>,
    )
    fireEvent.press(getByText('common:privacyPolicy'))
    const button = getByText('send')
    fireEvent.press(button)
    expect(await findByText('thanksMessage')).toBeDefined()
    expect(mockRequest).toHaveBeenCalledTimes(1)
    expect(mockRequest).toHaveBeenCalledWith({
      routeType: SEARCH_ROUTE,
      isPositiveRating: null,
      city,
      language,
      comment: '',
      contactMail: '',
      query,
      searchTerm: query,
      slug: undefined,
    })
  })

  it('should send original search term for search feedback if edited', async () => {
    const query = 'Zeugnis'
    const fullSearchTerm = 'Zeugnisübergabe'
    const { findByText, getByDisplayValue, getByText } = render(
      <NavigationContainer>
        <FeedbackContainer routeType={SEARCH_ROUTE} language={language} cityCode={city} query={query} />
      </NavigationContainer>,
    )
    fireEvent.press(getByText('common:privacyPolicy'))
    const input = getByDisplayValue(query)
    fireEvent.changeText(input, fullSearchTerm)
    const button = getByText('send')
    fireEvent.press(button)
    expect(await findByText('thanksMessage')).toBeDefined()
    expect(mockRequest).toHaveBeenCalledTimes(1)
    expect(mockRequest).toHaveBeenCalledWith({
      routeType: SEARCH_ROUTE,
      isPositiveRating: null,
      city,
      language,
      comment: '',
      contactMail: '',
      query,
      searchTerm: fullSearchTerm,
      slug: undefined,
    })
  })

  it('should disable send button if query term is removed', async () => {
    const { findByText, getByDisplayValue, getByText } = render(
      <NavigationContainer>
        <FeedbackContainer routeType={SEARCH_ROUTE} language={language} cityCode={city} query='query' />
      </NavigationContainer>,
    )
    fireEvent.press(getByText('common:privacyPolicy'))
    expect(await findByText('send')).not.toBeDisabled()
    const input = getByDisplayValue('query')
    fireEvent.changeText(input, '')
    expect(await findByText('send')).toBeDisabled()
  })

  it('should send negative rating on submit if there are no search results found', async () => {
    const query = 'gesundheitsversicherung'
    const noResults = true
    const { getByText, findByText } = render(
      <NavigationContainer>
        <FeedbackContainer
          routeType={SEARCH_ROUTE}
          language={language}
          cityCode={city}
          query={query}
          noResults={noResults}
        />
      </NavigationContainer>,
    )
    fireEvent.press(getByText('common:privacyPolicy'))
    expect(getByText('send')).not.toBeDisabled()
    const submitButton = getByText('send')
    fireEvent.press(submitButton)
    expect(await findByText('thanksMessage')).toBeDefined()
    expect(mockRequest).toHaveBeenCalledTimes(1)
    expect(mockRequest).toHaveBeenCalledWith({
      routeType: SEARCH_ROUTE,
      isPositiveRating: false,
      city,
      language,
      comment: '',
      contactMail: '',
      query,
      searchTerm: query,
      slug: undefined,
    })
    expect(sendTrackingSignal).toHaveBeenCalledTimes(1)
    expect(sendTrackingSignal).toHaveBeenCalledWith({
      signal: {
        name: SEND_FEEDBACK_SIGNAL_NAME,
        feedback: {
          positive: false,
          numCharacters: 0,
          contactMail: false,
        },
      },
    })
  })
})
