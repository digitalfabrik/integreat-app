// @flow

import * as React from 'react'
import styled from 'styled-components'
import { Description } from './FeedbackBox'

const CommentField = styled.textarea`
  resize: none;
`

type PropsType = {|
  comment: string,
  commentMessage: string,
  onCommentChanged: SyntheticInputEvent<HTMLTextAreaElement> => void
|}

class FeedbackComment extends React.Component<PropsType> {
  render () {
    const {commentMessage, comment, onCommentChanged} = this.props
    return (
      <>
        <Description>{commentMessage}</Description>
        <CommentField rows={3} value={comment} onChange={onCommentChanged} />
      </>
    )
  }
}

export default FeedbackComment
