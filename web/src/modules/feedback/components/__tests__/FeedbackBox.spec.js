// @flow

import React from 'react'
import { render } from '@testing-library/react'
import { FeedbackBox } from '../FeedbackBox'

describe('FeedbackBox', () => {
  const t = (key: ?string): string => key || ''
  const onCommentChanged = jest.fn()
  const onContactMailChanged = jest.fn()
  const onSubmit = jest.fn()
  const closeFeedbackModal = jest.fn()

  const buildProps = (isPositiveFeedback: boolean, comment: string) => {
    return {
      comment,
      isPositiveFeedback,
      contactMail: 'test@example.com',
      sendingStatuse: 'IDLE',
      onCommentChanged,
      onContactMailChanged,
      onSubmit,
      t,
      closeFeedbackModal
    }
  }

  it('should display comment and contact mail', () => {
    const comment = 'Some Comment'
    const contactMail = 'xyz@iga.de'
    const { getByText } = render(
      <FeedbackBox
        isPositiveRatingSelected={false}
        contactMail={contactMail}
        comment={comment}
        onCommentChanged={onCommentChanged}
        onContactMailChanged={onContactMailChanged}
        onSubmit={onSubmit}
        sendingStatus='SUCCESS'
        t={t}
        closeFeedbackModal={() => {}}
      />
    )

    expect(getByText(contactMail)).toBeTruthy()
    expect(getByText(comment)).toBeTruthy()
  })

  it('should call callback on contact mail changed', () => {
    const comment = 'Some Comment'
    const contactMail = 'xyz@iga.de'

    const { getByText } = render(
      <FeedbackBox
        isPositiveRatingSelected={false}
        contactMail={contactMail}
        comment={comment}
        onCommentChanged={onCommentChanged}
        onContactMailChanged={onContactMailChanged}
        onSubmit={onSubmit}
        sendingStatus='SUCCESS'
        t={t}
        closeFeedbackModal={() => {}}
      />
    )

    expect(getByText(contactMail)).toBeTruthy()
    expect(getByText(comment)).toBeTruthy()
  })
})
