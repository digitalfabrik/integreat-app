import React from 'react'
import { FeedbackThanksMessage } from '../FeedbackThanksMessage'
import { render } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import buildConfig from '../../constants/buildConfig'

describe('FeedbackThanksMessage', () => {
  const onCloseFeedbackModal = jest.fn()

  it('should display information sending information', () => {
    const t = (key: string): string => key

    const { getByText } = render(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <FeedbackThanksMessage closeFeedbackModal={onCloseFeedbackModal} t={t} />
      </ThemeProvider>
    )
    expect(getByText('feedbackSent')).toBeTruthy()
    expect(getByText('thanksMessage')).toBeTruthy()
  })
})
