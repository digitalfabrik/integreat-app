// @flow

import * as React from 'react'
import 'react-dropdown/style.css'

import type { TFunction } from 'react-i18next'
import { translate } from 'react-i18next'
import FeedbackEndpoint, { SEARCH_FEEDBACK_TYPE } from '../../../modules/endpoint/FeedbackEndpoint'
import type { LocationState } from 'redux-first-router'
import { Description, StyledFeedbackBox, SubmitButton } from '../../../modules/feedback/components/FeedbackBox'
import FeedbackComment from '../../../modules/feedback/components/FeedbackComment'

export const StyledSubmitButton = SubmitButton.withComponent('div')

type PropsType = {|
  query?: string,
  location: LocationState,
  t: TFunction
|}

type StateType = {|
  comment: string,
  feedbackSent: boolean
|}

export class NothingFoundFeedbackBox extends React.Component<PropsType, StateType> {
  constructor (props: PropsType) {
    super(props)
    this.state = {comment: '', feedbackSent: false}
  }

  onCommentChanged = (event: SyntheticInputEvent<HTMLTextAreaElement>) => this.setState({comment: event.target.value})

  onSubmit = () => {
    const {query, location} = this.props
    const {city, language} = location.payload
    const {comment} = this.state
    FeedbackEndpoint.postData({
      feedbackType: SEARCH_FEEDBACK_TYPE,
      isPositiveRating: false,
      comment,
      city,
      language,
      query
    })

    this.setState({feedbackSent: true})
  }

  render () {
    const {feedbackSent, comment} = this.state
    const {t} = this.props

    return <StyledFeedbackBox>
      {
        feedbackSent
          ? <Description>{t('thanksMessage')}</Description>
          : <>
            <FeedbackComment
              comment={comment}
              commentMessage={t('wantedInformation')}
              onCommentChanged={this.onCommentChanged} />
            <StyledSubmitButton onClick={this.onSubmit}>{t('send')}</StyledSubmitButton>
          </>
      }
    </StyledFeedbackBox>
  }
}

export default translate('feedback')(NothingFoundFeedbackBox)
