import { NavigationContainer } from '@react-navigation/native'
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

  it('button should be disabled and note should be shown without feedback and no comment', async () => {
    const { getByText, queryByText } = render(
      <NavigationContainer>
        <Feedback {...buildProps(null, '')} />
      </NavigationContainer>,
    )
    expect(getByText('send')).toBeDisabled()
    expect(queryByText('searchTermDescription')).toBeFalsy()
    expect(getByText('headline')).toBeTruthy()
    expect(getByText('note')).toBeTruthy()
  })

  it('button should be enabled for search feedback and no input', async () => {
    const { getByText, queryByText } = render(
      <NavigationContainer>
        <Feedback {...buildProps(null, '', 'query')} />
      </NavigationContainer>,
    )
    expect(getByText('send')).not.toBeDisabled()
    expect(getByText('searchTermDescription')).toBeTruthy()
    expect(queryByText('note')).toBeFalsy()
  })

  it('button should be enabled for positive feedback and no input', async () => {
    const { getByText, queryByText } = render(
      <NavigationContainer>
        <Feedback {...buildProps(true, '')} />
      </NavigationContainer>,
    )
    expect(getByText('send')).not.toBeDisabled()
    expect(queryByText('searchTermDescription')).toBeFalsy()
    expect(getByText('note')).toBeTruthy()
  })

  it('button should be enabled for no feedback but comment', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <Feedback {...buildProps(null, 'comment')} />
      </NavigationContainer>,
    )
    expect(getByText('send')).not.toBeDisabled()
    expect(getByText('note')).toBeTruthy()
  })

  it('correct text should be displayed for search feedback and input', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <Feedback {...buildProps(false, 'comment', 'query')} />
      </NavigationContainer>,
    )
    expect(getByText('searchTermDescription')).toBeDefined()
  })

  it('onSubmit should be called with query on button press for search feedback', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <Feedback {...buildProps(false, 'My test comment', 'query')} />
      </NavigationContainer>,
    )
    const button = getByText('send')
    fireEvent.press(button)
    expect(onSubmit).toHaveBeenCalled()
  })

  it('should call callback on comment changed', async () => {
    const { getByDisplayValue, queryByDisplayValue } = render(
      <NavigationContainer>
        <Feedback {...buildProps(false, 'my old comment')} />
      </NavigationContainer>,
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
      <NavigationContainer>
        <Feedback {...buildProps(false, 'my comment')} />
      </NavigationContainer>,
    )
    expect(getByDisplayValue('test@example.com')).toBeTruthy()
    expect(queryByDisplayValue('new@example.com')).toBeFalsy()
    expect(onFeedbackContactMailChanged).not.toHaveBeenCalled()
    fireEvent.changeText(getByDisplayValue('test@example.com'), 'new@example.com')
    expect(onFeedbackContactMailChanged).toHaveBeenCalledTimes(1)
    expect(onFeedbackContactMailChanged).toHaveBeenCalledWith('new@example.com')
  })
})
