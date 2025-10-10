import { fireEvent } from '@testing-library/react'
import React from 'react'

import { Rating, SendingStatusType } from 'shared'

import { renderWithTheme } from '../../testing/render'
import Feedback from '../Feedback'

jest.mock('react-inlinesvg')
jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: (namespace?: string) => ({
    t: (key: string) => (namespace ? `${namespace}:${key}` : key),
  }),
  Trans: ({ i18nKey }: { i18nKey: string }) => i18nKey,
}))

describe('Feedback', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const onCommentChanged = jest.fn()
  const setRating = jest.fn()
  const onContactMailChangedDummy = jest.fn()
  const onSubmit = jest.fn()
  const closeFeedback = jest.fn()
  const setSearchTerm = jest.fn()

  const buildProps = ({
    rating = null,
    comment = '',
    searchTerm,
    sendingStatus = 'idle',
    onContactMailChanged = onContactMailChangedDummy,
    noResults = false,
  }: {
    language?: string
    rating?: Rating | null
    comment?: string
    searchTerm?: string
    sendingStatus?: SendingStatusType
    onContactMailChanged?: (mail: string) => void
    noResults?: boolean
  }) => ({
    comment,
    language: 'en',
    rating,
    contactMail: 'test@example.com',
    sendingStatus,
    searchTerm,
    onCommentChanged,
    setRating,
    onContactMailChanged,
    onSubmit,
    closeFeedback,
    setSearchTerm,
    noResults,
  })

  it('should show error when submitting without rating and input', () => {
    const { getByText, queryByText } = renderWithTheme(<Feedback {...buildProps({})} />)

    const button = getByText('feedback:send')
    expect(button).toBeEnabled()
    expect(queryByText('feedback:noteFillFeedback')).toBeNull()
    fireEvent.click(button)
    expect(getByText('feedback:noteFillFeedback')).toBeTruthy()
  })

  it('should show error for missing rating and input when submitted', () => {
    const { getByText } = renderWithTheme(<Feedback {...buildProps({ language: 'en' })} />)
    fireEvent.click(getByText('feedback:send'))
    expect(getByText('feedback:noteFillFeedback')).toBeTruthy()
  })

  it('should show error if privacy policy is not accepted', () => {
    const { getByText } = renderWithTheme(<Feedback {...buildProps({ rating: 'positive' })} />)

    const button = getByText('feedback:send')
    expect(button).toBeEnabled()
    fireEvent.click(button)
    expect(getByText('feedback:common:notePrivacyPolicy')).toBeTruthy()
  })

  it('should display correct description for search', () => {
    const { getByLabelText, queryByText } = renderWithTheme(
      <Feedback {...buildProps({ rating: 'negative', comment: 'comment', searchTerm: 'query' })} />,
    )
    expect(getByLabelText('feedback:wantedInformation')).toBeInTheDocument()
    expect(queryByText('error:search:nothingFound')).toBeFalsy()
  })

  it('should show not found error', () => {
    const { getByLabelText } = renderWithTheme(
      <Feedback
        {...buildProps({
          language: 'en',
          rating: 'negative',
          comment: 'comment',
          searchTerm: 'query',
          noResults: true,
        })}
      />,
    )
    expect(getByLabelText('feedback:wantedInformation')).toBeTruthy()
  })

  it('onSubmit should be called on button press', async () => {
    const { getByText } = renderWithTheme(<Feedback {...buildProps({ rating: 'negative', comment: 'comment' })} />)
    const button = getByText('feedback:send')
    getByText('common:privacyPolicy').click()
    fireEvent.click(button)
    expect(onSubmit).toHaveBeenCalled()
  })

  it('should call callback on contact mail changed', () => {
    const onContactMailChanged = jest.fn()
    const { getByDisplayValue, queryByDisplayValue } = renderWithTheme(
      <Feedback {...buildProps({ rating: 'negative', comment: 'my comment', onContactMailChanged })} />,
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
      <Feedback {...buildProps({ rating: 'negative', comment: 'my comment' })} />,
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
