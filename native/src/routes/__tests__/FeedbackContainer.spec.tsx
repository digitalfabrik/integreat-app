import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import { CATEGORIES_ROUTE, RATING_NEGATIVE, RATING_POSITIVE, SEARCH_ROUTE } from 'shared'

import render from '../../testing/render'
import { FeedbackContainer } from '../FeedbackContainer'

const mockRequest = jest.fn()
jest.mock('styled-components')
jest.mock('shared/api', () => ({
  ...jest.requireActual('shared/api'),
  createFeedbackEndpoint: (_unusedBaseUrl: string) => ({
    request: mockRequest,
  }),
}))

describe('FeedbackContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    const mockNavigate = jest.fn()
    jest.mock('react-router', () => ({
      ...jest.requireActual('react-router'),
      useNavigate: () => mockNavigate,
    }))
  })

  const region = 'augsburg'
  const language = 'de'

  it('should disable send button if privacy policy is not accepted', async () => {
    const { findByText, getByText } = await render(
      <FeedbackContainer routeType={SEARCH_ROUTE} language={language} regionCode={region} />,
    )
    const positiveRatingButton = getByText('feedback:rating.useful')
    await fireEvent.press(positiveRatingButton)

    expect(await findByText('common:actions.send')).toBeDisabled()
  })

  it('should send feedback request with rating and no other inputs on submit', async () => {
    const { getByText, findByText } = await render(
      <FeedbackContainer routeType={CATEGORIES_ROUTE} language={language} regionCode={region} />,
    )
    await fireEvent.press(getByText('common:privacy.confirmation'))

    const positiveRatingButton = getByText('feedback:rating.useful')
    await fireEvent.press(positiveRatingButton)
    expect(getByText('common:actions.send')).not.toBeDisabled()
    const submitButton = getByText('common:actions.send')
    await fireEvent.press(submitButton)
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
    const { getByText, findByText, getAllByDisplayValue } = await render(
      <FeedbackContainer routeType={CATEGORIES_ROUTE} language={language} regionCode={region} />,
    )
    await fireEvent.press(getByText('common:privacy.confirmation'))
    const [commentField, emailField] = getAllByDisplayValue('')
    await fireEvent.changeText(commentField!, comment)
    await fireEvent.changeText(emailField!, contactMail)
    const button = getByText('common:actions.send')
    await fireEvent.press(button)
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
    const { getByText, findByText } = await render(
      <FeedbackContainer routeType={CATEGORIES_ROUTE} language={language} regionCode={region} />,
    )
    await fireEvent.press(getByText('common:privacy.confirmation'))
    const positiveRatingButton = getByText('feedback:rating.useful')
    await fireEvent.press(positiveRatingButton)
    expect(await findByText('common:actions.send')).not.toBeDisabled()
    await fireEvent.press(positiveRatingButton)
    expect(await findByText('common:actions.send')).toBeDisabled()
  })

  it('should send negative feedback for having unwanted search results', async () => {
    const query = 'gesundheitsversicherung'
    const { getByText, findByText } = await render(
      <FeedbackContainer
        routeType={SEARCH_ROUTE}
        language={language}
        rating='negative'
        regionCode={region}
        query={query}
        hasResults
      />,
    )

    expect(await findByText('feedback:search.informationNotFound')).toBeDefined()
    await fireEvent.press(getByText('feedback:search.informUs'))
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

  it('should send negative feedback for not found search results and show the thanks banner', async () => {
    const query = 'gesundheitsversicherung'
    const { getByText, findByText } = await render(
      <FeedbackContainer
        routeType={SEARCH_ROUTE}
        language={language}
        rating='negative'
        regionCode={region}
        query={query}
        hasResults={false}
        isChatEnabled={false}
      />,
    )
    await fireEvent.press(getByText('feedback:search.informUs'))
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

  it('should show the chat option when chat is enabled in a region for not found search results', async () => {
    const query = 'gesundheitsversicherung'

    const { getByText } = await render(
      <FeedbackContainer
        routeType={SEARCH_ROUTE}
        language={language}
        regionCode={region}
        query={query}
        rating='negative'
        isChatEnabled
        hasResults={false}
      />,
    )
    expect(getByText(/feedback:search.options.askChat/)).toBeTruthy()
  })

  it('should hide the chat option when chat is disabled in a region for not found search results', async () => {
    const query = 'gesundheitsversicherung'
    const { queryByText } = await render(
      <FeedbackContainer
        routeType={SEARCH_ROUTE}
        language={language}
        regionCode={region}
        query={query}
        rating='negative'
        isChatEnabled={false}
        hasResults={false}
      />,
    )
    expect(queryByText(/feedback:search.options.askChat/)).toBeNull()
  })
})
