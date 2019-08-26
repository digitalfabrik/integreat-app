// @flow

import * as React from 'react'
import { CityModel, POSITIVE_RATING } from '@integreat-app/integreat-api-client'
import styled from 'styled-components'
import type { LocationState } from 'redux-first-router'
import FeedbackThanksMessage from './FeedbackThanksMessage'
import FeedbackBoxContainer from './FeedbackBoxContainer'
import type { FeedbackRatingType } from '../../layout/containers/LocationLayout'

const Overlay = styled.div`
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
  display: flex;
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

type PropsType = {|
  cities: ?Array<CityModel>,
  title?: string,
  id?: number,
  alias?: string,
  query?: string,
  feedbackStatus: FeedbackRatingType,
  closeFeedbackModal: () => void,
  location: LocationState
|}

type StateType = {|
  feedbackSent: boolean
|}

class FeedbackModal extends React.Component<PropsType, StateType> {
  state = { feedbackSent: false }

  onSubmit = () => this.setState({ feedbackSent: true })

  closeFeedbackModal = () => {
    this.setState({ feedbackSent: false })
    this.props.closeFeedbackModal()
  }

  render () {
    const { feedbackStatus, ...otherProps } = this.props
    const { feedbackSent } = this.state

    return <ModalContainer>
      <Overlay onClick={this.closeFeedbackModal} />
      <FeedbackContainer>
        {
          feedbackSent
            ? <FeedbackThanksMessage closeFeedbackModal={this.props.closeFeedbackModal} />
            : <FeedbackBoxContainer isPositiveRatingSelected={feedbackStatus === POSITIVE_RATING}
                                    {...otherProps} onSubmit={this.onSubmit} />
        }
      </FeedbackContainer>
    </ModalContainer>
  }
}

export default FeedbackModal
