// @flow
import * as React from 'react'
import { translate } from 'react-i18next'
import type { TFunction } from 'react-i18next'
import styled from 'styled-components'
import { Description } from './FeedbackBox'

const CommentField = styled.textarea`
  resize: none;
`

type PropsType = {
  comment: string,
  commentMessageOverride: ?string,
  isPositiveRatingSelected: boolean,
  onCommentChanged: SyntheticInputEvent<HTMLTextAreaElement> => void,
  t: TFunction
}

export class FeedbackComment extends React.Component<PropsType> {
  render () {
    const {commentMessageOverride, isPositiveRatingSelected, comment, onCommentChanged, t} = this.props
    return (
      <React.Fragment>
        <Description>
          {commentMessageOverride || (isPositiveRatingSelected ? t('positiveComment') : t('negativeComment'))}
        </Description>
        <CommentField rows={3} value={comment} onChange={onCommentChanged} />
      </React.Fragment>
    )
  }
}

export default translate('feedback')(FeedbackComment)
