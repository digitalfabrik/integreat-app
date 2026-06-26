import { fireEvent } from '@testing-library/react'
import React from 'react'

import { SEARCH_ROUTE } from 'shared'

import { renderAllRoutes } from '../../testing/render'
import FeedbackContainer from '../FeedbackContainer'

const mockRequest = jest.fn()
jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: (namespace?: string) => ({
    t: (key: string) => (namespace ? `${namespace}:${key}` : key),
  }),
  Trans: ({ i18nKey }: { i18nKey: string }) => i18nKey,
}))
jest.mock('shared/api', () => ({
  ...jest.requireActual('shared/api'),
  createFeedbackEndpoint: () => ({
    request: mockRequest,
  }),
}))

describe('FeedbackContainer', () => {
  beforeEach(jest.clearAllMocks)

  const renderFeedbackContainer = (path: string) =>
    renderAllRoutes(path, {
      RegionContentElement: <FeedbackContainer slug={null} />,
    })

  it('should display dialog when feedback query param is set', () => {
    const { getByText, queryByText } = renderFeedbackContainer('/augsburg/de?feedback=positive')

    expect(getByText('feedback:headline')).toBeTruthy()
    expect(queryByText('feedback:thanksHeadline')).toBeFalsy()
  })

  it('should not be visible without feedback query param', () => {
    const { queryByText } = renderFeedbackContainer('/augsburg/de')

    expect(queryByText('feedback:headline')).toBeNull()
  })

  it('should display search term field on search route', () => {
    const { getByLabelText } = renderFeedbackContainer('/augsburg/de/search?feedback=positive&query=test')

    expect(getByLabelText('feedback:wantedInformation')).toBeTruthy()
  })

  it('should display success snackbar after submit', async () => {
    const { findByText, getByText } = renderFeedbackContainer('/augsburg/de?feedback=true')

    fireEvent.click(getByText('feedback:useful'))
    getByText('common:privacyPolicy').click()
    fireEvent.click(getByText('feedback:send'))

    expect(await findByText('feedback:thanksMessage')).toBeTruthy()
  })

  it('should send query for search', async () => {
    const query = 'zeugnis'
    const { getByText } = renderFeedbackContainer(`/augsburg/de/search?feedback=positive&query=${query}`)

    getByText('common:privacyPolicy').click()
    fireEvent.click(getByText('feedback:send'))
    expect(mockRequest).toHaveBeenCalledTimes(1)
    expect(mockRequest).toHaveBeenCalledWith({
      routeType: SEARCH_ROUTE,
      region: 'augsburg',
      language: 'de',
      comment: '',
      contactMail: '',
      isPositiveRating: true,
      query,
      searchTerm: query,
      slug: undefined,
    })
  })

  it('should send original search term if updated', () => {
    const query = 'Zeugnis'
    const fullSearchTerm = 'Zeugnisübergabe'
    const { getByDisplayValue, getByText } = renderFeedbackContainer(
      `/augsburg/de/search?feedback=negative&query=${query}`,
    )
    const input = getByDisplayValue(query)
    fireEvent.change(input, { target: { value: fullSearchTerm } })

    getByText('common:privacyPolicy').click()
    fireEvent.click(getByText('feedback:send'))
    expect(mockRequest).toHaveBeenCalledTimes(1)
    expect(mockRequest).toHaveBeenCalledWith({
      routeType: SEARCH_ROUTE,
      region: 'augsburg',
      language: 'de',
      comment: '',
      contactMail: '',
      isPositiveRating: false,
      query,
      searchTerm: fullSearchTerm,
      slug: undefined,
    })
  })
})
