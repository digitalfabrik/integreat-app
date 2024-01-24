import { fireEvent } from '@testing-library/react'
import React from 'react'

import { UiDirectionType } from 'translations'

import { renderWithTheme } from '../../testing/render'
import Feedback from '../Feedback'
import { SendingStatusType } from '../FeedbackContainer'

jest.mock('react-inlinesvg')
jest.mock('react-i18next')

describe('Feedback', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const t = (key: string): string => key

  const onCommentChanged = jest.fn()
  const onFeedbackChanged = jest.fn()
  const onContactMailChangedDummy = jest.fn()
  const onSubmit = jest.fn()
  const closeFeedbackModal = jest.fn()
  const setSearchTerm = jest.fn()

  const buildProps = (
    isPositiveFeedback: boolean | null,
    comment: string,
    searchTerm?: string,
    sendingStatus: SendingStatusType = 'idle',
    onContactMailChanged = onContactMailChangedDummy,
  ) => ({
    comment,
    isPositiveFeedback,
    contactMail: 'test@example.com',
    sendingStatus,
    searchTerm,
    onCommentChanged,
    onFeedbackChanged,
    onContactMailChanged,
    onSubmit,
    t,
    closeFeedbackModal,
    setSearchTerm,
    direction: 'ltr' as UiDirectionType,
  })

  it('button should be disabled for no rating and no input', () => {
    const { getByText } = renderWithTheme(<Feedback {...buildProps(null, '')} />)
    expect(getByText('feedback:send')).toBeDisabled()
  })

  it('note should be shown for no rating and no input', () => {
    const { getByText } = renderWithTheme(<Feedback {...buildProps(null, '')} />)
    expect(getByText('feedback:note')).toBeTruthy()
  })

  it('button should be enabled for positive Feedback and no input', () => {
    const { getByText } = renderWithTheme(<Feedback {...buildProps(true, '')} />)
    expect(getByText('feedback:send')).toBeEnabled()
  })

  it('button should be enabled for negative Feedback and no input', () => {
    const { getByText } = renderWithTheme(<Feedback {...buildProps(true, '')} />)
    expect(getByText('feedback:send')).toBeEnabled()
  })

  it('button should be enabled no rating and input', () => {
    const { getByText } = renderWithTheme(<Feedback {...buildProps(null, 'comment')} />)
    expect(getByText('feedback:send')).toBeEnabled()
  })

  it('should display correct description for search', () => {
    const { getByText } = renderWithTheme(<Feedback {...buildProps(false, 'comment', 'query')} />)
    expect(getByText('feedback:wantedInformation')).toBeTruthy()
  })

  it('should display error', () => {
    const { getByText } = renderWithTheme(<Feedback {...buildProps(false, 'comment', undefined, 'failed')} />)
    expect(getByText('feedback:failedSendingFeedback')).toBeTruthy()
  })

  it('onSubmit should be called on button press', async () => {
    const { getByText } = renderWithTheme(<Feedback {...buildProps(false, 'comment')} />)
    const button = getByText('feedback:send')
    fireEvent.click(button)
    expect(onSubmit).toHaveBeenCalled()
  })

  it('should call callback on contact mail changed', () => {
    const onContactMailChanged = jest.fn()
    const { getByDisplayValue, queryByDisplayValue } = renderWithTheme(
      <Feedback {...buildProps(false, 'my comment', undefined, 'idle', onContactMailChanged)} />,
    )
    expect(getByDisplayValue('test@example.com')).toBeTruthy()
    expect(queryByDisplayValue('new@example.com')).toBeFalsy()
    expect(onContactMailChanged).not.toHaveBeenCalled()
    fireEvent.change(getByDisplayValue('test@example.com'), {
      target: {
        value: 'new@example.com',
      },
    })
    expect(onContactMailChanged).toHaveBeenCalledTimes(1)
    expect(onContactMailChanged).toHaveBeenCalledWith('new@example.com')
  })

  it('should call callback on comment changed', () => {
    const { getByDisplayValue, queryByDisplayValue } = renderWithTheme(
      <Feedback {...buildProps(false, 'my comment')} />,
    )
    expect(getByDisplayValue('my comment')).toBeTruthy()
    expect(queryByDisplayValue('new comment')).toBeFalsy()
    expect(onCommentChanged).not.toHaveBeenCalled()
    fireEvent.change(getByDisplayValue('my comment'), {
      target: {
        value: 'new comment',
      },
    })
    expect(onCommentChanged).toHaveBeenCalledTimes(1)
    expect(onCommentChanged).toHaveBeenCalledWith('new comment')
  })
})
