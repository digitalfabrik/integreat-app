import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import { CATEGORIES_ROUTE, FEEDBACK_ROUTE, RATING_NEGATIVE, RATING_POSITIVE, SEARCH_ROUTE } from 'shared'

import useNavigate from '../../hooks/useNavigate'
import render from '../../testing/render'
import { FeedbackContainer } from '../FeedbackContainer'

import mocked = jest.mocked

jest.mock('../../hooks/useNavigate')
const mockRequest = jest.fn()
jest.mock('styled-components')
jest.mock('shared/api', () => ({
  ...jest.requireActual('shared/api'),
  createFeedbackEndpoint: (_unusedBaseUrl: string) => ({
    request: mockRequest,
  }),
}))

describe('FeedbackContainer', () => {
  const mockNavigate = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mocked(useNavigate).mockReturnValue({
      navigation: { navigate: mockNavigate },
    } as unknown as ReturnType<typeof useNavigate>)
  })

  const region = 'augsburg'
  const language = 'de'

  it('should disable send button if privacy policy is not accepted', async () => {
    const { findByText, getByText } = render(
      <FeedbackContainer routeType={SEARCH_ROUTE} language={language} regionCode={region} />,
    )
    const positiveRatingButton = getByText('feedback:rating.useful')
    fireEvent.press(positiveRatingButton)

    expect(await findByText('common:actions.send')).toBeDisabled()
  })

  it('should send feedback request with rating and no other inputs on submit', async () => {
    const { getByText, findByText } = render(
      <FeedbackContainer routeType={CATEGORIES_ROUTE} language={language} regionCode={region} />,
    )
    fireEvent.press(getByText('common:privacy.confirmation'))

    const positiveRatingButton = getByText('feedback:rating.useful')
    fireEvent.press(positiveRatingButton)
    expect(getByText('common:actions.send')).not.toBeDisabled()
    const submitButton = getByText('common:actions.send')
    fireEvent.press(submitButton)
    expect(await findByText('feedback:thanks.description')).toBeDefined()
    expect(mockRequest).toHaveBeenCalledTimes(1)
    expect(mockRequest).toHaveBeenCalledWith({
      routeType: CATEGORIES_ROUTE,
      rating: RATING_POSITIVE,
      region,
      language,
      comment: '',
      contactMail: '',
      query: undefined,
      searchTerm: undefined,
    })
  })

  it('should send feedback request with comment and contact information on submit without rating', async () => {
    const comment = 'my comment'
    const contactMail = 'test@example.com'
    const { getByText, findByText, getAllByDisplayValue } = render(
      <FeedbackContainer routeType={CATEGORIES_ROUTE} language={language} regionCode={region} />,
    )
    fireEvent.press(getByText('common:privacy.confirmation'))
    const [commentField, emailField] = getAllByDisplayValue('')
    fireEvent.changeText(commentField!, comment)
    fireEvent.changeText(emailField!, contactMail)
    const button = getByText('common:actions.send')
    fireEvent.press(button)
    expect(await findByText('feedback:thanks.description')).toBeDefined()
    expect(mockRequest).toHaveBeenCalledTimes(1)
    expect(mockRequest).toHaveBeenCalledWith({
      routeType: CATEGORIES_ROUTE,
      rating: null,
      region,
      language,
      comment,
      contactMail,
      query: undefined,
      searchTerm: undefined,
    })
  })

  it('should disable send feedback button if rating button is clicked twice', async () => {
    const { getByText, findByText } = render(
      <FeedbackContainer routeType={CATEGORIES_ROUTE} language={language} regionCode={region} />,
    )
    fireEvent.press(getByText('common:privacy.confirmation'))
    const positiveRatingButton = getByText('feedback:rating.useful')
    fireEvent.press(positiveRatingButton)
    expect(await findByText('common:actions.send')).not.toBeDisabled()
    fireEvent.press(positiveRatingButton)
    expect(await findByText('common:actions.send')).toBeDisabled()
  })

  it('should send negative feedback for not found search results and show the thanks banner', async () => {
    const query = 'gesundheitsversicherung'
    const { getByText, findByText } = render(
      <FeedbackContainer
        routeType={SEARCH_ROUTE}
        language={language}
        rating='negative'
        regionCode={region}
        query={query}
        noResults
      />,
    )
    fireEvent.press(getByText('feedback:search.informUs'))
    expect(await findByText('feedback:thanks.title')).toBeDefined()
    expect(mockRequest).toHaveBeenCalledWith({
      routeType: SEARCH_ROUTE,
      rating: RATING_NEGATIVE,
      region,
      language,
      comment: '',
      contactMail: '',
      query,
      searchTerm: query,
      slug: undefined,
    })
  })

  it('should show the chat option when chat is enabled in a region for not found search results', () => {
    const query = 'gesundheitsversicherung'

    const { findByText } = render(
      <FeedbackContainer
        routeType={SEARCH_ROUTE}
        language={language}
        regionCode={region}
        query={query}
        rating='negative'
        noResults
        isChatEnabled
      />,
    )
    expect(findByText('feedback:search.options.askChat')).toBeDefined()
  })

  it('should hide the chat option when chat is disabled in a region for not found search results', () => {
    const query = 'gesundheitsversicherung'
    const { queryByText } = render(
      <FeedbackContainer
        routeType={SEARCH_ROUTE}
        language={language}
        regionCode={region}
        query={query}
        rating='negative'
        noResults
        isChatEnabled={false}
      />,
    )
    expect(queryByText('feedback:search.options.askChat')).toBeNull()
  })
})
