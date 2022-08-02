import { fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import { ThemeProvider } from 'styled-components'

import { CATEGORIES_ROUTE } from 'api-client'

import buildConfig from '../../constants/buildConfig'
import { renderWithRouter } from '../../testing/render'
import FeedbackModal from '../FeedbackModal'

jest.mock('react-i18next')
jest.mock('api-client', () => ({
  ...jest.requireActual('api-client'),
  createFeedbackEndpoint: () => ({
    request: () => undefined,
  }),
}))

describe('FeedbackModal', () => {
  const cityCode = 'augsburg'
  const language = 'de'
  const closeModal = jest.fn()

  it('should display thanks message after successfully submitting feedback', async () => {
    const { getByRole, getByText } = renderWithRouter(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <FeedbackModal
          cityCode={cityCode}
          language={language}
          routeType={CATEGORIES_ROUTE}
          path='augsburg/de'
          closeModal={closeModal}
          feedbackRating='up'
        />
      </ThemeProvider>
    )
    const button = getByRole('button', {
      name: 'feedback:send',
    })
    fireEvent.click(button)
    // Needed as submitFeedback is asynchronous
    await waitFor(() => expect(button).toBeEnabled())
    expect(getByText('feedback:thanksMessage')).toBeTruthy()
  })
})
