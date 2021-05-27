import React from 'react'
import { FeedbackThanksMessage } from '../FeedbackThanksMessage'
import { render } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import { lightTheme } from 'build-configs/integreat/theme'

describe('FeedbackThanksMessage', () => {
  const onCloseFeedbackModal = jest.fn()
  it('should display information sending information', () => {
    const t = (key: string | null | undefined): string => key || ''

    const { getByText } = render(
      <ThemeProvider theme={lightTheme}>
        <FeedbackThanksMessage closeFeedbackModal={onCloseFeedbackModal} t={t} />
      </ThemeProvider>
    )
    expect(getByText('feedbackSent')).toBeTruthy()
    expect(getByText('thanksMessage')).toBeTruthy()
  })
})
