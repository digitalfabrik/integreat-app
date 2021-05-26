// @flow

import React from 'react'
import { render, fireEvent } from '@testing-library/react'

import FeedbackComment from '../FeedbackComment'

describe('FeedbackComment', () => {
  const onCommentChanged = jest.fn()

  it('should call callback on comment changed', () => {
    const { getByDisplayValue, queryByDisplayValue } = render(
      <FeedbackComment comment='my old comment' commentMessage='message' onCommentChanged={onCommentChanged} />
    )
    expect(getByDisplayValue('my old comment')).toBeTruthy()
    expect(queryByDisplayValue('my new comment')).toBeFalsy()
    expect(onCommentChanged).not.toHaveBeenCalled()

    fireEvent.change(getByDisplayValue('my old comment'), { target: { value: 'my new comment' } })

    expect(onCommentChanged).toHaveBeenCalledTimes(1)
    expect(onCommentChanged).toBeCalledWith('my new comment')
  })
})
