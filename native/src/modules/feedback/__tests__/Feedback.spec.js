// @flow

import React from 'react'
import Feedback from '../Feedback'
import lightTheme from '../../theme/constants'
import { fireEvent, render } from '@testing-library/react-native'

describe('Feedback', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const t = key => key
  const onCommentChanged = jest.fn()
  const onFeedbackContactMailChanged = jest.fn()
  const onSubmit = jest.fn()

  const buildProps = (isPositiveFeedback: boolean, isSearchFeedback: boolean, comment: string) => {
    return {
      comment,
      isPositiveFeedback,
      isSearchFeedback,
      contactMail: 'test@example.com',
      sendingStatus: 'idle',
      onCommentChanged,
      onFeedbackContactMailChanged,
      onSubmit,
      theme: lightTheme,
      t
    }
  }

  it('button should be disabled for negative feedback and no input', async () => {
    const { getByText, queryByText, queryAllByText } = render(<Feedback {...buildProps(false, false, '')} />)
    expect(getByText('send')).toBeDisabled()
    expect(getByText('negativeComment')).toBeTruthy()
    expect(queryAllByText('(optionalInfo)')).toHaveLength(1)
    expect(queryByText('positiveComment')).toBeFalsy()
    expect(queryByText('wantedInformation')).toBeFalsy()
  })

  it('button should be disabled for search feedback and no input', async () => {
    const { getByText, queryByText, queryAllByText } = render(<Feedback {...buildProps(false, true, '')} />)
    expect(getByText('send')).toBeDisabled()
    expect(getByText('wantedInformation')).toBeTruthy()
    expect(queryAllByText('(optionalInfo)')).toHaveLength(1)
    expect(queryByText('positiveComment')).toBeFalsy()
    expect(queryByText('negativeComment')).toBeFalsy()
  })

  it('button should be enabled for positive feedback and no input', async () => {
    const { getByText, queryByText, queryAllByText } = render(<Feedback {...buildProps(true, false, '')} />)
    expect(getByText('send')).not.toBeDisabled()
    expect(getByText('positiveComment')).toBeTruthy()
    expect(queryAllByText('(optionalInfo)')).toHaveLength(2)
    expect(queryByText('negativeComment')).toBeFalsy()
    expect(queryByText('wantedInformation')).toBeFalsy()
  })

  it('button should be enabled for negative feedback and input', async () => {
    const { getByText } = render(<Feedback {...buildProps(false, false, 'comment')} />)
    expect(getByText('send')).not.toBeDisabled()
  })

  it('correct text should be displayed for positive feedback and input', async () => {
    const { getByText } = render(<Feedback {...buildProps(true, false, 'comment')} />)
    expect(getByText('positiveComment')).toBeDefined()
  })

  it('correct text should be displayed for negative feedback and input', async () => {
    const { getByText } = render(<Feedback {...buildProps(false, false, 'comment')} />)
    expect(getByText('negativeComment')).toBeDefined()
  })

  it('correct text should be displayed for search feedback and input', async () => {
    const { getByText } = render(<Feedback {...buildProps(false, true, 'comment')} />)
    expect(getByText('wantedInformation')).toBeDefined()
  })

  it('onSubmit should be called with query on button press for search feedback', async () => {
    const { getByText } = render(<Feedback {...buildProps(false, true, 'My test comment')} />)
    const button = getByText('send')
    fireEvent.press(button)
    expect(onSubmit).toBeCalled()
  })

  it('should call callback on comment changed', async () => {
    const { getByDisplayValue, queryByDisplayValue } = render(
      <Feedback {...buildProps(false, false, 'my old comment')} />
    )
    expect(getByDisplayValue('my old comment')).toBeTruthy()
    expect(queryByDisplayValue('my new comment')).toBeFalsy()
    expect(onCommentChanged).not.toHaveBeenCalled()

    fireEvent.changeText(getByDisplayValue('my old comment'), 'my new comment')

    expect(onCommentChanged).toHaveBeenCalledTimes(1)
    expect(onCommentChanged).toBeCalledWith('my new comment')
  })

  it('should call callback on contact mail changed', async () => {
    const { getByDisplayValue, queryByDisplayValue } = render(<Feedback {...buildProps(false, false, 'my comment')} />)
    expect(getByDisplayValue('test@example.com')).toBeTruthy()
    expect(queryByDisplayValue('new@example.com')).toBeFalsy()
    expect(onFeedbackContactMailChanged).not.toHaveBeenCalled()

    fireEvent.changeText(getByDisplayValue('test@example.com'), 'new@example.com')

    expect(onFeedbackContactMailChanged).toHaveBeenCalledTimes(1)
    expect(onFeedbackContactMailChanged).toBeCalledWith('new@example.com')
  })
})
