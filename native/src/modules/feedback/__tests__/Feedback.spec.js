// @flow

import React from 'react'
import Feedback from '../Feedback'
import lightTheme from '../../theme/constants'
import { fireEvent, render } from '@testing-library/react-native'
import type { FeedbackOriginType } from '../FeedbackContainer'

describe('Feedback', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const t = key => key
  const onCommentChanged = jest.fn()
  const onFeedbackContactMailChanged = jest.fn()
  const onSubmit = jest.fn()

  const buildProps = (feedbackOrigin: FeedbackOriginType, comment: string) => {
    return {
      comment,
      feedbackOrigin,
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
    const { getByText } = render(<Feedback {...buildProps('negative', '')} />)
    expect(getByText('send')).toBeDisabled()
  })

  it('button should be disabled for no search results Feedback and no input', async () => {
    const { getByText } = render(<Feedback {...buildProps('searchNothingFound', '')} />)
    expect(getByText('send')).toBeDisabled()
  })

  it('button should be disabled for deficient search results Feedback and no input', async () => {
    const { getByText } = render(<Feedback {...buildProps('searchInformationNotFound', '')} />)
    expect(getByText('send')).toBeDisabled()
  })

  it('button should be enabled for positive Feedback and no input', async () => {
    const { getByText } = render(<Feedback {...buildProps('positive', '')} />)
    expect(getByText('send')).not.toBeDisabled()
  })

  it('button should be enabled for negative Feedback and input', async () => {
    const { getByText } = render(<Feedback {...buildProps('negative', 'comment')} />)
    expect(getByText('send')).not.toBeDisabled()
  })

  it('correct Text should be displayed for positive Feedback and input', async () => {
    const { getByText } = render(<Feedback {...buildProps('positive', 'comment')} />)
    expect(getByText('positiveComment')).toBeDefined()
  })

  it('correct Text should be displayed for negative Feedback and input', async () => {
    const { getByText } = render(<Feedback {...buildProps('negative', 'comment')} />)
    expect(getByText('negativeComment')).toBeDefined()
  })

  it('correct Text should be displayed for no search results Feedback and input', async () => {
    const { getByText } = render(<Feedback {...buildProps('searchNothingFound', 'comment')} />)
    expect(getByText('wantedInformation')).toBeDefined()
    expect(getByText('nothingFound')).toBeDefined()
  })

  it('correct Text should be displayed for deficient search results Feedback and input', async () => {
    const { getByText } = render(<Feedback {...buildProps('searchInformationNotFound', 'comment')} />)
    expect(getByText('wantedInformation')).toBeDefined()
  })

  it('onSubmit should be called with query on button press for search Feedback', async () => {
    const { getByText } = render(<Feedback {...buildProps('searchNothingFound', 'My test comment')} />)
    const button = getByText('send')
    fireEvent.press(button)
    expect(onSubmit).toBeCalled()
  })

  it('should call callback on comment changed', async () => {
    const { getByDisplayValue, queryByDisplayValue } = render(
      <Feedback {...buildProps('negative', 'my old comment')} />
    )
    expect(getByDisplayValue('my old comment')).toBeTruthy()
    expect(queryByDisplayValue('my new comment')).toBeFalsy()
    expect(onCommentChanged).not.toHaveBeenCalled()

    fireEvent.changeText(getByDisplayValue('my old comment'), 'my new comment')

    expect(onCommentChanged).toHaveBeenCalledTimes(1)
    expect(onCommentChanged).toBeCalledWith('my new comment')
  })

  it('should call callback on contact mail changed', async () => {
    const { getByDisplayValue, queryByDisplayValue } = render(<Feedback {...buildProps('negative', 'my comment')} />)
    expect(getByDisplayValue('test@example.com')).toBeTruthy()
    expect(queryByDisplayValue('new@example.com')).toBeFalsy()
    expect(onFeedbackContactMailChanged).not.toHaveBeenCalled()

    fireEvent.changeText(getByDisplayValue('test@example.com'), 'new@example.com')

    expect(onFeedbackContactMailChanged).toHaveBeenCalledTimes(1)
    expect(onFeedbackContactMailChanged).toBeCalledWith('new@example.com')
  })
})
