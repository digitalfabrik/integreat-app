import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { Description } from './Feedback'

const CommentField = styled.textarea`
  resize: none;
`
const RequiredText = styled.span`
  color: red;
  font-size: 1.5em;
`
type PropsType = {
  comment: string
  commentMessage: string
  required?: boolean
  onCommentChanged: (comment: string) => void
}

class FeedbackComment extends React.PureComponent<PropsType> {
  render(): ReactNode {
    const { commentMessage, comment, onCommentChanged, required } = this.props
    return (
      <>
        <Description>
          {commentMessage}
          {required && <RequiredText>*</RequiredText>}
        </Description>
        <CommentField rows={7} value={comment} onChange={event => onCommentChanged(event.target.value)} />
      </>
    )
  }
}

export default FeedbackComment
