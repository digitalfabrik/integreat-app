// @flow

import * as React from 'react'
import FeedbackBox from './FeedbackBox'
import CityModel from '../../../modules/endpoint/models/CityModel'
import styled from 'styled-components'
import CleanLink from '../../../modules/common/components/CleanLink'
import type { LocationState } from 'redux-first-router'
import { goToFeedback } from '../../../modules/app/routes/feedback'
import FeedbackThanksMessage from './FeedbackThanksMessage'
import { NEGATIVE_RATING, POSITIVE_RATING } from '../../../modules/endpoint/FeedbackEndpoint'

const Overlay = styled(CleanLink)`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: ${props => props.theme.colors.textSecondaryColor};
  opacity: 0.9;
`

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2;
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
`

const FeedbackContainer = styled.div`
  position: relative;
  display: flex;
  background-color: ${props => props.theme.colors.backgroundColor};
  
  @media ${props => props.theme.dimensions.smallViewport} {
    width: 100%;
    height: 100%;
    align-items: flex-start;
    justify-content: center;
  }
`

export const FEEDBACK_SENT = 'sent'

type PropsType = {
  cities: ?Array<CityModel>,
  title?: string,
  id?: number,
  alias?: string,
  query?: string,
  feedbackType: string,
  location: LocationState,
  commentMessageOverride?: string
}

class FeedbackModal extends React.Component<PropsType> {
  renderModalContent = (): React.Node => {
    const {feedbackType} = this.props

    if (feedbackType === FEEDBACK_SENT) {
      return <FeedbackThanksMessage location={location} />
    } else if (feedbackType === POSITIVE_RATING || feedbackType === NEGATIVE_RATING) {
      return <FeedbackBox isPositiveRatingSelected={feedbackType === POSITIVE_RATING}
                          isOpen={!!feedbackType}
                          {...this.props} />
    } else {
      return null
    }
  }

  render () {
    const {location, feedbackType} = this.props
    return (
      <div>
        <ModalContainer isOpen={!!feedbackType}>
          <Overlay to={goToFeedback(location)} />
          <FeedbackContainer>
            {this.renderModalContent()}
          </FeedbackContainer>
        </ModalContainer>
      </div>
    )
  }
}

export default FeedbackModal
