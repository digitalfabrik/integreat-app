// @flow

import * as React from 'react'

import type { TFunction } from 'react-i18next'
import { withTranslation } from 'react-i18next'
import { createFeedbackEndpoint, SEARCH_FEEDBACK_TYPE } from '@integreat-app/integreat-api-client'
import type { LocationState } from 'redux-first-router'
import { Description, StyledFeedbackBox, SubmitButton } from '../../../modules/feedback/components/FeedbackBox'
import FeedbackComment from '../../../modules/feedback/components/FeedbackComment'
import { cmsApiBaseUrl } from '../../../modules/app/constants/urls'

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
    this.state = { comment: '', feedbackSent: false }
  }

  handleCommentChanged = (event: SyntheticInputEvent<HTMLTextAreaElement>) =>
    this.setState({ comment: event.target.value })

  handleSubmit = () => {
    const { query, location } = this.props
    const { city, language } = location.payload
    const { comment } = this.state
    createFeedbackEndpoint(cmsApiBaseUrl).request({
      feedbackType: SEARCH_FEEDBACK_TYPE,
      isPositiveRating: false,
      comment,
      city,
      language,
      query
    })

    this.setState({ feedbackSent: true })
  }

  render () {
    const { feedbackSent, comment } = this.state
    const { t } = this.props

    return <StyledFeedbackBox>
      {
        feedbackSent
          ? <Description>{t('thanksMessage')}</Description>
          : <>
            <FeedbackComment
              comment={comment}
              commentMessage={t('wantedInformation')}
              onCommentChanged={this.handleCommentChanged} />
            <StyledSubmitButton onClick={this.handleSubmit}>{t('send')}</StyledSubmitButton>
          </>
      }
    </StyledFeedbackBox>
  }
}

export default withTranslation('feedback')(NothingFoundFeedbackBox)
