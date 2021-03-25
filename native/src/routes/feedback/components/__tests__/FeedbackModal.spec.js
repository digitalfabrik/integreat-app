// @flow

import React from 'react'
import FeedbackModal from '../FeedbackModal'
import lightTheme from '../../../../modules/theme/constants'
import { fireEvent, render } from '@testing-library/react-native'

describe('FeedbackModal', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const t = key => key
  const onCommentChanged = jest.fn()
  const onFeedbackContactMailChanged = jest.fn()
  const onSubmit = jest.fn()

  const buildProps = (isPositiveFeedback: boolean, comment: string) => {
    return {
      comment,
      isPositiveFeedback,
      contactMail: 'test@example.com',
      sendingStatus: 'idle',
      onCommentChanged,
      onFeedbackContactMailChanged,
      onSubmit,
      theme: lightTheme,
      t
    }
  }

  it('button should be disabled for negative Feedback and no input', async () => {
    const { getByText } = render(<FeedbackModal {...buildProps(false, '')} />)
    expect(getByText('send')).toBeDisabled()
  })

  it('button should be enabled for positive Feedback and no input', async () => {
    const { getByText } = render(<FeedbackModal {...buildProps(true, '')} />)
    expect(getByText('send')).not.toBeDisabled()
  })

  it('button should be enabled for negative Feedback and input', async () => {
    const { getByText } = render(<FeedbackModal {...buildProps(false, 'comment')} />)
    expect(getByText('send')).not.toBeDisabled()
  })

  it('onSubmit should be called on button press', async () => {
    const { getByText } = render(<FeedbackModal {...buildProps(false, 'My test comment')} />)
    const button = getByText('send')
    fireEvent.press(button)

    expect(onSubmit).toBeCalled()
  })

  it('should call callback on comment changed', async () => {
    const { getByDisplayValue, queryByDisplayValue } = render(
      <FeedbackModal {...buildProps(false, 'my old comment')} />
    )
    expect(getByDisplayValue('my old comment')).toBeTruthy()
    expect(queryByDisplayValue('my new comment')).toBeFalsy()
    expect(onCommentChanged).not.toHaveBeenCalled()

    fireEvent.changeText(getByDisplayValue('my old comment'), 'my new comment')

    expect(onCommentChanged).toHaveBeenCalledTimes(1)
    expect(onCommentChanged).toBeCalledWith('my new comment')
  })

  it('should call callback on contact mail changed', async () => {
    const { getByDisplayValue, queryByDisplayValue } = render(<FeedbackModal {...buildProps(false, 'my comment')} />)
    expect(getByDisplayValue('test@example.com')).toBeTruthy()
    expect(queryByDisplayValue('new@example.com')).toBeFalsy()
    expect(onFeedbackContactMailChanged).not.toHaveBeenCalled()

    fireEvent.changeText(getByDisplayValue('test@example.com'), 'new@example.com')

    expect(onFeedbackContactMailChanged).toHaveBeenCalledTimes(1)
    expect(onFeedbackContactMailChanged).toBeCalledWith('new@example.com')
  })
})
