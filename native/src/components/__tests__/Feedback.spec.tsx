import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import render from '../../testing/render'
import Feedback from '../Feedback'

jest.mock('styled-components')
jest.mock('react-i18next')

describe('Feedback', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const onCommentChanged = jest.fn()
  const onFeedbackContactMailChanged = jest.fn()
  const onSubmit = jest.fn()
  const setIsPositiveFeedback = jest.fn()
  const setSearchTerm = jest.fn()

  const buildProps = (isPositiveFeedback: boolean | null, comment: string, searchTerm?: string) => ({
    language: 'en',
    comment,
    isPositiveFeedback,
    searchTerm,
    contactMail: 'test@example.com',
    sendingStatus: 'idle' as const,
    onCommentChanged,
    onFeedbackContactMailChanged,
    onSubmit,
    setIsPositiveFeedback,
    setSearchTerm,
  })

  it('button should be disabled if privacy policy is not accepted', async () => {
    const { getByText } = render(<Feedback {...buildProps(true, 'comment', 'query')} />)

    expect(getByText('send')).toBeDisabled()
  })

  it('button should be disabled and note should be shown without feedback and no comment', async () => {
    const { getByText, queryByText } = render(<Feedback {...buildProps(null, '')} />)
    fireEvent.press(getByText('common:privacyPolicy'))
    expect(getByText('send')).toBeDisabled()
    expect(queryByText('searchTermDescription')).toBeFalsy()
    expect(getByText('headline')).toBeTruthy()
    expect(getByText('noteFillFeedback')).toBeTruthy()
  })

  it('button should be enabled for search feedback and no input', async () => {
    const { getByText, queryByText, getAllByText } = render(<Feedback {...buildProps(null, '', 'query')} />)
    fireEvent.press(getByText('common:privacyPolicy'))
    expect(getByText('send')).not.toBeDisabled()
    expect(getAllByText('searchTermDescription')[0]).toBeTruthy()
    expect(queryByText('noteFillFeedback')).toBeFalsy()
  })

  it('button should be enabled for positive feedback and no input', async () => {
    const { getByText, queryByText } = render(<Feedback {...buildProps(true, '')} />)
    fireEvent.press(getByText('common:privacyPolicy'))
    expect(getByText('send')).not.toBeDisabled()
    expect(queryByText('searchTermDescription')).toBeFalsy()
    expect(queryByText('note')).toBeFalsy()
  })

  it('button should be enabled for no feedback but comment', async () => {
    const { getByText, queryByText } = render(<Feedback {...buildProps(null, 'comment')} />)
    fireEvent.press(getByText('common:privacyPolicy'))
    expect(getByText('send')).not.toBeDisabled()
    expect(queryByText('note')).toBeFalsy()
  })

  it('correct text should be displayed for search feedback and input', async () => {
    const { getAllByText } = render(<Feedback {...buildProps(false, 'comment', 'query')} />)
    expect(getAllByText('searchTermDescription')[0]).toBeDefined()
  })

  it('onSubmit should be called with query on button press for search feedback', async () => {
    const { getByText } = render(<Feedback {...buildProps(false, 'My test comment', 'query')} />)
    fireEvent.press(getByText('common:privacyPolicy'))
    const button = getByText('send')
    fireEvent.press(button)
    expect(onSubmit).toHaveBeenCalled()
  })

  it('should call callback on comment changed', async () => {
    const { getByDisplayValue, queryByDisplayValue } = render(<Feedback {...buildProps(false, 'my old comment')} />)
    expect(getByDisplayValue('my old comment')).toBeTruthy()
    expect(queryByDisplayValue('my new comment')).toBeFalsy()
    expect(onCommentChanged).not.toHaveBeenCalled()
    fireEvent.changeText(getByDisplayValue('my old comment'), 'my new comment')
    expect(onCommentChanged).toHaveBeenCalledTimes(1)
    expect(onCommentChanged).toHaveBeenCalledWith('my new comment')
  })

  it('should call callback on contact mail changed', async () => {
    const { getByDisplayValue, queryByDisplayValue } = render(<Feedback {...buildProps(false, 'my comment')} />)
    expect(getByDisplayValue('test@example.com')).toBeTruthy()
    expect(queryByDisplayValue('new@example.com')).toBeFalsy()
    expect(onFeedbackContactMailChanged).not.toHaveBeenCalled()
    fireEvent.changeText(getByDisplayValue('test@example.com'), 'new@example.com')
    expect(onFeedbackContactMailChanged).toHaveBeenCalledTimes(1)
    expect(onFeedbackContactMailChanged).toHaveBeenCalledWith('new@example.com')
  })
})
