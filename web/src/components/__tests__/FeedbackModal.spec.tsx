import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import { MemoryRouter } from 'react-router-dom'
import buildConfig from '../../constants/buildConfig'
import { CATEGORIES_ROUTE } from 'api-client'
import FeedbackModal from '../FeedbackModal'

jest.mock('react-i18next')
jest.mock('api-client', () => {
  return {
    ...jest.requireActual('api-client'),
    createFeedbackEndpoint: () => ({
      request: () => {}
    })
  }
})

describe('FeedbackModal', () => {
  const cityCode = 'augsburg'
  const language = 'de'
  const closeModal = jest.fn()

  it('should display thanks message after successfully submitting feedback', async () => {
    const { getByRole, getByText } = render(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <FeedbackModal
          cityCode={cityCode}
          language={language}
          routeType={CATEGORIES_ROUTE}
          path='augsburg/de'
          closeModal={closeModal}
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
    expect(getByText('feedback:thanksMessage')).toBeTruthy()
  })
})
