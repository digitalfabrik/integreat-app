import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import { Rating, RATING_NEGATIVE, RATING_POSITIVE } from 'shared'

import render from '../../testing/render'
import Feedback from '../Feedback'

jest.mock('styled-components')

describe('Feedback', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const onCommentChanged = jest.fn()
  const onFeedbackContactMailChanged = jest.fn()
  const onSubmit = jest.fn()
  const setRating = jest.fn()
  const setSearchTerm = jest.fn()

  const buildProps = (rating: Rating | null, comment: string, searchTerm?: string) => ({
    language: 'en',
    comment,
    rating,
    searchTerm,
    contactMail: 'test@example.com',
    sendingStatus: 'idle' as const,
    onCommentChanged,
    onFeedbackContactMailChanged,
    onSubmit,
    setRating,
    setSearchTerm,
  })

  it('button should be disabled if privacy policy is not accepted', async () => {
    const { getByText } = render(<Feedback {...buildProps(RATING_POSITIVE, 'comment', 'query')} />)

    expect(getByText('feedback:send')).toBeDisabled()
  })

  it('button should be disabled and note should be shown without feedback and no comment', async () => {
    const { getByText, queryByText } = render(<Feedback {...buildProps(null, '')} />)
    fireEvent.press(getByText('common:privacyPolicy'))
    expect(getByText('feedback:send')).toBeDisabled()
    expect(queryByText('feedback:searchTermDescription')).toBeFalsy()
    expect(getByText('feedback:headline')).toBeTruthy()
    expect(getByText('feedback:noteFillFeedback')).toBeTruthy()
  })

  it('button should be enabled for search feedback and no input', async () => {
    const { getByText, queryByText, getAllByText } = render(<Feedback {...buildProps(null, '', 'query')} />)
    fireEvent.press(getByText('common:privacyPolicy'))
    expect(getByText('feedback:send')).not.toBeDisabled()
    expect(getAllByText('feedback:searchTermDescription')[0]).toBeTruthy()
    expect(queryByText('feedback:noteFillFeedback')).toBeFalsy()
  })

  it('button should be enabled for positive feedback and no input', async () => {
    const { getByText, queryByText } = render(<Feedback {...buildProps(RATING_POSITIVE, '')} />)
    fireEvent.press(getByText('common:privacyPolicy'))
    expect(getByText('feedback:send')).not.toBeDisabled()
    expect(queryByText('feedback:searchTermDescription')).toBeFalsy()
    expect(queryByText('feedback:note')).toBeFalsy()
  })

  it('button should be enabled for no feedback but comment', async () => {
    const { getByText, queryByText } = render(<Feedback {...buildProps(null, 'comment')} />)
    fireEvent.press(getByText('common:privacyPolicy'))
    expect(getByText('feedback:send')).not.toBeDisabled()
    expect(queryByText('feedback:note')).toBeFalsy()
  })

  it('correct text should be displayed for search feedback and input', async () => {
    const { getAllByText } = render(<Feedback {...buildProps(RATING_NEGATIVE, 'comment', 'query')} />)
    expect(getAllByText('feedback:searchTermDescription')[0]).toBeDefined()
  })

  it('onSubmit should be called with query on button press for search feedback', async () => {
    const { getByText } = render(<Feedback {...buildProps(RATING_NEGATIVE, 'My test comment', 'query')} />)
    fireEvent.press(getByText('common:privacyPolicy'))
    const button = getByText('feedback:send')
    fireEvent.press(button)
    expect(onSubmit).toHaveBeenCalled()
  })

  it('should call callback on comment changed', async () => {
    const { getByDisplayValue, queryByDisplayValue } = render(
      <Feedback {...buildProps(RATING_NEGATIVE, 'my old comment')} />,
    )
    expect(getByDisplayValue('my old comment')).toBeTruthy()
    expect(queryByDisplayValue('my new comment')).toBeFalsy()
    expect(onCommentChanged).not.toHaveBeenCalled()
    fireEvent.changeText(getByDisplayValue('my old comment'), 'my new comment')
    expect(onCommentChanged).toHaveBeenCalledTimes(1)
    expect(onCommentChanged).toHaveBeenCalledWith('my new comment')
  })

  it('should call callback on contact mail changed', async () => {
    const { getByDisplayValue, queryByDisplayValue } = render(
      <Feedback {...buildProps(RATING_NEGATIVE, 'my comment')} />,
    )
    expect(getByDisplayValue('test@example.com')).toBeTruthy()
    expect(queryByDisplayValue('new@example.com')).toBeFalsy()
    expect(onFeedbackContactMailChanged).not.toHaveBeenCalled()
    fireEvent.changeText(getByDisplayValue('test@example.com'), 'new@example.com')
    expect(onFeedbackContactMailChanged).toHaveBeenCalledTimes(1)
    expect(onFeedbackContactMailChanged).toHaveBeenCalledWith('new@example.com')
  })
})
