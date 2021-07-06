import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import { Feedback } from '../Feedback'
import { ThemeProvider } from 'styled-components'
import { SendingStatusType } from '../FeedbackModal'
import buildConfig from '../../constants/buildConfig'

describe('FeedbackBox', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const t = (key: string): string => key

  const onCommentChanged = jest.fn()
  const onContactMailChanged = jest.fn()
  const onSubmit = jest.fn()
  const closeFeedbackModal = jest.fn()

  const buildProps = (isPositiveRatingSelected: boolean, comment: string) => {
    return {
      comment,
      isPositiveRatingSelected,
      contactMail: 'test@example.com',
      sendingStatus: 'IDLE' as SendingStatusType,
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
    expect(getByText('send')).toBeDisabled()
  })

  it('button should be enabled for positive Feedback and no input', () => {
    const { getByText } = render(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <Feedback {...buildProps(true, '')} />
      </ThemeProvider>
    )
    expect(getByText('send')).not.toBeDisabled()
  })

  it('button should be enabled for negative Feedback and input', () => {
    const { getByText } = render(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <Feedback {...buildProps(false, 'comment')} />
      </ThemeProvider>
    )
    expect(getByText('send')).not.toBeDisabled()
  })

  it('onSubmit should be called on button press', async () => {
    const { getByText } = render(
      <ThemeProvider theme={buildConfig().lightTheme}>
        <Feedback {...buildProps(false, 'comment')} />
      </ThemeProvider>
    )
    const button = getByText('send')
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
})
