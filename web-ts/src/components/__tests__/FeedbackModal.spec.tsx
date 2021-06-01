import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { FeedbackModal } from '../FeedbackModal'
import { ThemeProvider } from 'styled-components'
import { MemoryRouter } from 'react-router-dom'
import { Routes } from '../../routes/App'
import buildConfig from '../../constants/buildConfig'

jest.mock('react-i18next')
jest.mock('api-client', () => {
  return {
    ...jest.requireActual('api-client'),
    createFeedbackEndpoint: () => ({
      request: () => {}
    })
  }
})

jest.mock('../FeedbackThanksMessage', () => {
  return () => <div>Thanks</div>
})

describe('FeedbackModal', () => {
  const city = 'augsburg'
  const language = 'de'

  const closeFeedbackModal = jest.fn()

  it('should display thanks message after successfully submitting feedback', async () => {
    const { getByRole, getByText } = render(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <FeedbackModal
          city={city}
          language={language}
          routeType={Routes.CATEGORIES_ROUTE}
          path='augsburg/de'
          closeFeedbackModal={closeFeedbackModal}
          feedbackRating='up'
        />
      </ThemeProvider>,
      { wrapper: MemoryRouter }
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
