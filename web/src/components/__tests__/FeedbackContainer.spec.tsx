import { fireEvent } from '@testing-library/react'
import React from 'react'
import { useSearchParams } from 'react-router'

import { RATING_NEGATIVE, RATING_POSITIVE, SEARCH_ROUTE } from 'shared'

import { renderAllRoutes } from '../../testing/render'
import FeedbackContainer from '../FeedbackContainer'

const FeedbackOpener = ({ rating }: { rating: string }) => {
  const [, setSearchParams] = useSearchParams()
  return (
    <button type='button' onClick={() => setSearchParams({ feedback: rating })}>
      reopen
    </button>
  )
}

const mockRequest = jest.fn()
jest.mock('shared/api', () => ({
  ...jest.requireActual('shared/api'),
  createFeedbackEndpoint: () => ({
    request: mockRequest,
  }),
}))

describe('FeedbackContainer', () => {
  beforeEach(jest.clearAllMocks)

  const renderFeedbackContainer = (path: string, opener?: React.ReactElement) =>
    renderAllRoutes(path, {
      RegionContentElement: (
        <>
          <FeedbackContainer slug={null} />
          {opener}
        </>
      ),
    })

  it('should display dialog when feedback query param is set', () => {
    const { getByText, queryByText } = renderFeedbackContainer('/augsburg/de?feedback=positive')

    expect(getByText('feedback:description')).toBeTruthy()
    expect(queryByText('feedback:thanks.title')).toBeFalsy()
  })

  it('should not be visible without feedback query param', () => {
    const { queryByText } = renderFeedbackContainer('/augsburg/de')

    expect(queryByText('feedback:description')).toBeNull()
  })

  it('should display search term field on search route', () => {
    const { getByLabelText } = renderFeedbackContainer('/augsburg/de/search?feedback=positive&query=test')

    expect(getByLabelText('feedback:search.wantedInformation')).toBeTruthy()
  })

  it('should display success snackbar after submit', async () => {
    const { findByText, getByText } = renderFeedbackContainer('/augsburg/de?feedback=true')

    fireEvent.click(getByText('feedback:rating.useful'))
    getByText('common:privacy.confirmation').click()
    fireEvent.click(getByText('common:actions.send'))

    expect(await findByText('feedback:thanks.description')).toBeTruthy()
  })

  it('should send query for search', async () => {
    const query = 'zeugnis'
    const { getByText } = renderFeedbackContainer(`/augsburg/de/search?feedback=positive&query=${query}`)

    getByText('common:privacy.confirmation').click()
    fireEvent.click(getByText('common:actions.send'))
    expect(mockRequest).toHaveBeenCalledTimes(1)
    expect(mockRequest).toHaveBeenCalledWith({
      routeType: SEARCH_ROUTE,
      region: 'augsburg',
      language: 'de',
      comment: '',
      contactMail: '',
      rating: RATING_POSITIVE,
      query,
      searchTerm: query,
      slug: undefined,
    })
  })

  it('should clear comment and contact mail when the dialog is closed', () => {
    const { getByLabelText, getByText, queryByText } = renderFeedbackContainer(
      '/augsburg/de?feedback=positive',
      <FeedbackOpener rating='positive' />,
    )

    fireEvent.change(getByLabelText('feedback:comment.title'), { target: { value: 'my comment' } })
    fireEvent.change(getByLabelText('feedback:contactEmail'), { target: { value: 'me@example.com' } })

    fireEvent.click(getByLabelText('common:actions.close'))
    expect(queryByText('feedback:description')).toBeNull()

    fireEvent.click(getByText('reopen'))
    expect(getByLabelText('feedback:comment.title')).toHaveValue('')
    expect(getByLabelText('feedback:contactEmail')).toHaveValue('')
  })

  it('should clear comment and contact mail after submitting', async () => {
    const { getByLabelText, getByText, findByText, findByLabelText } = renderFeedbackContainer(
      '/augsburg/de?feedback=positive',
      <FeedbackOpener rating='positive' />,
    )

    fireEvent.change(getByLabelText('feedback:comment.title'), { target: { value: 'my comment' } })
    fireEvent.change(getByLabelText('feedback:contactEmail'), { target: { value: 'me@example.com' } })
    getByText('common:privacy.confirmation').click()
    fireEvent.click(getByText('common:actions.send'))

    expect(await findByText('feedback:thanks.description')).toBeTruthy()

    fireEvent.click(getByText('reopen'))
    // The form re-renders behind the success snackbar's transition, so wait for it instead of asserting immediately
    expect(await findByLabelText('feedback:comment.title')).toHaveValue('')
    expect(await findByLabelText('feedback:contactEmail')).toHaveValue('')
  })

  it('should send original search term if updated', () => {
    const query = 'Zeugnis'
    const fullSearchTerm = 'Zeugnisübergabe'
    const { getByDisplayValue, getByText } = renderFeedbackContainer(
      `/augsburg/de/search?feedback=negative&query=${query}`,
    )
    const input = getByDisplayValue(query)
    fireEvent.change(input, { target: { value: fullSearchTerm } })

    getByText('common:privacy.confirmation').click()
    fireEvent.click(getByText('common:actions.send'))
    expect(mockRequest).toHaveBeenCalledTimes(1)
    expect(mockRequest).toHaveBeenCalledWith({
      routeType: SEARCH_ROUTE,
      region: 'augsburg',
      language: 'de',
      comment: '',
      contactMail: '',
      rating: RATING_NEGATIVE,
      query,
      searchTerm: fullSearchTerm,
      slug: undefined,
    })
  })
})
