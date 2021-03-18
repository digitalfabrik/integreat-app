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
  const dummy = jest.fn()
  const submit = jest.fn()

  const buildProps = (isPositiveFeedback: boolean, comment: string) => {
    return {
      comment,
      isPositiveFeedback,
      contactMail: 'test@mail.de',
      selectedFeedbackIndex: 1,
      sendingStatus: 'idle',
      feedbackOptions: [],
      onCommentChanged: dummy,
      onFeedbackContactMailChanged: dummy,
      onFeedbackOptionChanged: dummy,
      onSubmit: submit,
      theme: lightTheme,
      t
    }
  }

  it('Button should be disabled for negative Feedback and no input', async () => {
    const { getByText } = render(<FeedbackModal {...buildProps(false, '')} />)
    expect(getByText('send')).toBeDisabled()
  })

  it('Button should be enabled for positive Feedback and no input', async () => {
    const { getByText } = render(<FeedbackModal {...buildProps(true, '')} />)
    expect(getByText('send')).not.toBeDisabled()
  })

  it('Button should be enabled for negative Feedback and input', async () => {
    const { getByText } = render(<FeedbackModal {...buildProps(false, 'comment')} />)
    expect(getByText('send')).not.toBeDisabled()
  })

  it('On Submit should be called on button press', async () => {
    const { getByText } = render(<FeedbackModal {...buildProps(false, 'My test comment')} />)
    const button = getByText('send')
    fireEvent.press(button)

    expect(submit).toBeCalled()
  })
})
