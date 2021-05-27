import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { FeedbackModal } from '../FeedbackModal'
import { ThemeProvider } from 'styled-components'
import { lightTheme } from 'build-configs/integreat/theme'

jest.mock('react-i18next')
jest.mock('api-client', () => {
  return {
    ...jest.requireActual('api-client'),
    createFeedbackEndpoint: (baseUrl: string) => ({
      request: () => {}
    })
  }
})
jest.mock('../FeedbackThanksMessage', () => {
  return () => <div>Thanks</div>
})
describe('FeedbackModal', () => {
  const closeFeedbackModal = jest.fn()
  it('should display thanks message after successfully submitting feedback', async () => {
    const { getByRole, getByText } = render(
      <ThemeProvider theme={lightTheme}>
        <FeedbackModal path='augsburg/de' closeFeedbackModal={closeFeedbackModal} feedbackRating='up' />
      </ThemeProvider>
    )
    const button = getByRole('button', {
      name: 'feedback:send'
    })
    fireEvent.click(button)
    // Needed as submitFeedback is asynchronous
    await waitFor(() => expect(button).not.toBeDisabled())
    expect(getByText('Thanks')).toBeTruthy()
  })
})
