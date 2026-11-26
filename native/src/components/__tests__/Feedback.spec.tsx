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

  it('should handle taps while the keyboard is open', async () => {
    const { container } = await render(<Feedback {...buildProps(RATING_POSITIVE, 'comment')} />)
    const scrollViews = container.queryAll(instance => instance.type === 'RCTScrollView')

    expect(scrollViews).toHaveLength(1)
    expect(scrollViews[0]!.props.keyboardShouldPersistTaps).toBe('handled')
  })

  it('button should be disabled if privacy policy is not accepted', async () => {
    const { getByText } = await render(<Feedback {...buildProps(RATING_POSITIVE, 'comment', 'query')} />)

    expect(getByText('common:actions.send')).toBeDisabled()
  })

  it('button should be disabled and note should be shown without feedback and no comment', async () => {
    const { getByText, queryByText } = await render(<Feedback {...buildProps(null, '')} />)
    await fireEvent.press(getByText('common:privacy.confirmation'))
    expect(getByText('common:actions.send')).toBeDisabled()
    expect(queryByText('feedback:search.searchTermDescription')).toBeFalsy()
    expect(getByText('feedback:title')).toBeTruthy()
    expect(getByText('feedback:required')).toBeTruthy()
  })

  it('button should be enabled for search feedback and no input', async () => {
    const { getByText, queryByText, getAllByText } = await render(<Feedback {...buildProps(null, '', 'query')} />)
    await fireEvent.press(getByText('common:privacy.confirmation'))
    expect(getByText('common:actions.send')).not.toBeDisabled()
    expect(getAllByText('feedback:search.searchTermDescription')[0]).toBeTruthy()
    expect(queryByText('feedback:required')).toBeFalsy()
  })

  it('button should be enabled for positive feedback and no input', async () => {
    const { getByText, queryByText } = await render(<Feedback {...buildProps(RATING_POSITIVE, '')} />)
    await fireEvent.press(getByText('common:privacy.confirmation'))
    expect(getByText('common:actions.send')).not.toBeDisabled()
    expect(queryByText('feedback:search.searchTermDescription')).toBeFalsy()
    expect(queryByText('feedback:note')).toBeFalsy()
  })

  it('button should be enabled for no feedback but comment', async () => {
    const { getByText, queryByText } = await render(<Feedback {...buildProps(null, 'comment')} />)
    await fireEvent.press(getByText('common:privacy.confirmation'))
    expect(getByText('common:actions.send')).not.toBeDisabled()
    expect(queryByText('feedback:note')).toBeFalsy()
  })

  it('correct text should be displayed for search feedback and input', async () => {
    const { getAllByText } = await render(<Feedback {...buildProps(RATING_NEGATIVE, 'comment', 'query')} />)
    expect(getAllByText('feedback:search.searchTermDescription')[0]).toBeDefined()
  })

  it('onSubmit should be called with query on button press for search feedback', async () => {
    const { getByText } = await render(<Feedback {...buildProps(RATING_NEGATIVE, 'My test comment', 'query')} />)
    await fireEvent.press(getByText('common:privacy.confirmation'))
    const button = getByText('common:actions.send')
    await fireEvent.press(button)
    expect(onSubmit).toHaveBeenCalled()
  })

  it('should call callback on comment changed', async () => {
    const { getByDisplayValue, queryByDisplayValue } = await render(
      <Feedback {...buildProps(RATING_NEGATIVE, 'my old comment')} />,
    )
    expect(getByDisplayValue('my old comment')).toBeTruthy()
    expect(queryByDisplayValue('my new comment')).toBeFalsy()
    expect(onCommentChanged).not.toHaveBeenCalled()
    await fireEvent.changeText(getByDisplayValue('my old comment'), 'my new comment')
    expect(onCommentChanged).toHaveBeenCalledTimes(1)
    expect(onCommentChanged).toHaveBeenCalledWith('my new comment')
  })

  it('should call callback on contact mail changed', async () => {
    const { getByDisplayValue, queryByDisplayValue } = await render(
      <Feedback {...buildProps(RATING_NEGATIVE, 'my comment')} />,
    )
    expect(getByDisplayValue('test@example.com')).toBeTruthy()
    expect(queryByDisplayValue('new@example.com')).toBeFalsy()
    expect(onFeedbackContactMailChanged).not.toHaveBeenCalled()
    await fireEvent.changeText(getByDisplayValue('test@example.com'), 'new@example.com')
    expect(onFeedbackContactMailChanged).toHaveBeenCalledTimes(1)
    expect(onFeedbackContactMailChanged).toHaveBeenCalledWith('new@example.com')
  })
})
