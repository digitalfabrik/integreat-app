import { fireEvent, render, waitFor } from '@testing-library/react'
import React from 'react'
import { createMemoryRouter, RouterProvider } from 'react-router'

import { SEARCH_ROUTE } from 'shared'

import SearchFeedback from '../SearchFeedback'

const mockRequest = jest.fn()
jest.mock('shared/api', () => ({
  ...jest.requireActual('shared/api'),
  createFeedbackEndpoint: () => ({ request: mockRequest }),
}))

const mockRegion = { chatEnabled: true }

jest.mock('../../hooks/useQueryFromEndpoint', () => ({
  __esModule: true,
  default: () => ({ data: mockRegion }),
}))

const searchText = 'test'

const renderSearchFeedback = (noResults: boolean, isChatEnabled: boolean) => {
  const router = createMemoryRouter(
    [
      {
        path: '/:regionCode/:languageCode',
        element: <SearchFeedback noResults={noResults} isChatEnabled={isChatEnabled} />,
      },
    ],
    { initialEntries: [`/augsburg/de?query=${searchText}`] },
  )
  return { router, ...render(<RouterProvider router={router} />) }
}

describe('SearchFeedback', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockRegion.chatEnabled = true
  })

  describe('with results', () => {
    it('should set feedback query param on button click', () => {
      const { getByText, router } = renderSearchFeedback(false, false)

      expect(router.state.location.search).toBe(`?query=${searchText}`)
      fireEvent.click(getByText('feedback:search.informUs'))
      expect(router.state.location.search).toContain(`?query=${searchText}`)
    })
  })

  describe('without results', () => {
    it('should render search hints and the chat option if chat is enabled', () => {
      const { getByText, queryByText } = renderSearchFeedback(true, true)

      expect(getByText('feedback:search.tryOptions')).toBeTruthy()
      expect(getByText('feedback:search.options.useSearchTerm')).toBeTruthy()
      expect(getByText('feedback:search.options.useSingleWord')).toBeTruthy()
      expect(queryByText(/feedback:search\.options\.askChat/)).toBeTruthy()
    })

    it('should hide the chat option if chat is disabled for the region', () => {
      mockRegion.chatEnabled = false
      const { queryByText } = renderSearchFeedback(true, false)

      expect(queryByText('feedback:search.options.askChat')).toBeNull()
    })

    it('should submit negative feedback and show the success alert', async () => {
      mockRequest.mockResolvedValueOnce(null)
      const { getByText, router } = renderSearchFeedback(true, true)

      fireEvent.click(getByText('feedback:search.informUs'))

      await waitFor(() => expect(getByText('feedback:thanks.title')).toBeTruthy())
      expect(mockRequest).toHaveBeenCalledTimes(1)
      expect(mockRequest).toHaveBeenCalledWith({
        routeType: SEARCH_ROUTE,
        region: 'augsburg',
        language: 'de',
        comment: '',
        contactMail: '',
        searchTerm: searchText,
        rating: 'negative',
      })
      expect(router.state.location.search).not.toContain('feedback=')
    })

    it('should show the error alert if the request fails', async () => {
      mockRequest.mockRejectedValueOnce(new Error('network'))
      const { getByText, queryByText } = renderSearchFeedback(true, true)

      fireEvent.click(getByText('feedback:search.informUs'))

      await waitFor(() => expect(getByText('error:unknownError')).toBeTruthy())
      expect(queryByText('feedback:thanks.title')).toBeNull()
    })

    it('should close the alert on dismiss', async () => {
      mockRequest.mockResolvedValueOnce(null)
      const { getByText, queryByText, getByLabelText } = renderSearchFeedback(true, true)

      fireEvent.click(getByText('feedback:search.informUs'))
      await waitFor(() => expect(getByText('feedback:thanks.title')).toBeTruthy())

      fireEvent.click(getByLabelText('Close'))
      expect(queryByText('feedback:thanks.title')).toBeNull()
    })
  })
})
