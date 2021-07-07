import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import { Feedback } from '../Feedback'
import { ThemeProvider } from 'styled-components'
import { SendingStatusType } from '../FeedbackContainer'
import buildConfig from '../../constants/buildConfig'

jest.mock('react-i18next')

describe('Feedback', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const t = (key: string): string => key

  const onCommentChanged = jest.fn()
  const onContactMailChanged = jest.fn()
  const onSubmit = jest.fn()
  const closeFeedbackModal = jest.fn()

  const buildProps = (
    isPositiveFeedback: boolean,
    comment: string,
    isSearchFeedback = false,
    sendingStatus = 'IDLE' as SendingStatusType
  ) => {
    return {
      comment,
      isPositiveFeedback,
      isSearchFeedback,
      contactMail: 'test@example.com',
      sendingStatus,
      onCommentChanged,
      onContactMailChanged,
      onSubmit,
      t,
      closeFeedbackModal
    }
  }

  it('button should be disabled for negative Feedback and no input', () => {
    const { getByText } = render(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <Feedback {...buildProps(false, '')} />
      </ThemeProvider>
    )
    expect(getByText('feedback:send')).toBeDisabled()
  })

  it('button should be enabled for positive Feedback and no input', () => {
    const { getByText } = render(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <Feedback {...buildProps(true, '')} />
      </ThemeProvider>
    )
    expect(getByText('feedback:send')).not.toBeDisabled()
  })

  it('button should be enabled for negative Feedback and input', () => {
    const { getByText } = render(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <Feedback {...buildProps(false, 'comment')} />
      </ThemeProvider>
    )
    expect(getByText('feedback:send')).not.toBeDisabled()
  })

  it('should display correct description for search', () => {
    const { getByText } = render(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <Feedback {...buildProps(false, 'comment', true)} />
      </ThemeProvider>
    )
    expect(getByText('feedback:wantedInformation')).toBeTruthy()
  })

  it('should display error', () => {
    const { getByText } = render(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <Feedback {...buildProps(false, 'comment', false, 'ERROR' as SendingStatusType)} />
      </ThemeProvider>
    )
    expect(getByText('feedback:failedSendingFeedback')).toBeTruthy()
  })

  it('onSubmit should be called on button press', async () => {
    const { getByText } = render(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <Feedback {...buildProps(false, 'comment')} />
      </ThemeProvider>
    )
    const button = getByText('feedback:send')
    fireEvent.click(button)
    expect(onSubmit).toBeCalled()
  })

  it('should call callback on contact mail changed', () => {
    const { getByDisplayValue, queryByDisplayValue } = render(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <Feedback {...buildProps(false, 'my comment')} />
      </ThemeProvider>
    )
    expect(getByDisplayValue('test@example.com')).toBeTruthy()
    expect(queryByDisplayValue('new@example.com')).toBeFalsy()
    expect(onContactMailChanged).not.toHaveBeenCalled()
    fireEvent.change(getByDisplayValue('test@example.com'), {
      target: {
        value: 'new@example.com'
      }
    })
    expect(onContactMailChanged).toHaveBeenCalledTimes(1)
    expect(onContactMailChanged).toBeCalledWith('new@example.com')
  })

  it('should call callback on comment changed', () => {
    const { getByDisplayValue, queryByDisplayValue } = render(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <Feedback {...buildProps(false, 'my comment')} />
      </ThemeProvider>
    )
    expect(getByDisplayValue('my comment')).toBeTruthy()
    expect(queryByDisplayValue('new comment')).toBeFalsy()
    expect(onCommentChanged).not.toHaveBeenCalled()
    fireEvent.change(getByDisplayValue('my comment'), {
      target: {
        value: 'new comment'
      }
    })
    expect(onCommentChanged).toHaveBeenCalledTimes(1)
    expect(onCommentChanged).toBeCalledWith('new comment')
  })
})
