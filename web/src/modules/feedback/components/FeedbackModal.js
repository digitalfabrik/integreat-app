// @flow

import * as React from 'react'
import { POSITIVE_RATING } from 'api-client'
import styled, { type StyledComponent } from 'styled-components'
import type { LocationState } from 'redux-first-router'
import FeedbackThanksMessage from './FeedbackThanksMessage'
import FeedbackBoxContainer from './FeedbackBoxContainer'
import type { FeedbackRatingType } from '../../layout/containers/LocationLayout'
import FocusTrap from 'focus-trap-react'
import type { ThemeType } from 'build-configs/ThemeType'
import dimensions from '../../theme/constants/dimensions'

const Overlay: StyledComponent<{||}, ThemeType, *> = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: ${props => props.theme.colors.textSecondaryColor};
  opacity: 0.9;
`

const ModalContainer: StyledComponent<{||}, ThemeType, *> = styled.div`
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

const FeedbackContainer: StyledComponent<{||}, ThemeType, *> = styled.div`
  position: relative;
  display: flex;
  background-color: ${props => props.theme.colors.backgroundColor};

  @media ${dimensions.smallViewport} {
    width: 100%;
    height: 100%;
    align-items: flex-start;
    justify-content: center;
  }
`
type PropsType = {|
  path?: string,
  alias?: string,
  feedbackRating: FeedbackRatingType,
  closeFeedbackModal: () => void,
  location: LocationState
|}

export type SendingStatusType = 'IDLE' | 'SUCCESS' | 'ERROR'

type StateType = {|
  sendingStatus: SendingStatusType
|}

export class FeedbackModal extends React.Component<PropsType, StateType> {
  state = { sendingStatus: 'IDLE' }

  handleSubmit = (sendingStatus: SendingStatusType) => {
    this.setState({ sendingStatus: sendingStatus })
  }

  handleOverlayClick = () => {
    this.setState({ sendingStatus: 'IDLE' })
    this.props.closeFeedbackModal()
  }

  renderContent(): React.Node {
    const { feedbackRating, ...otherProps } = this.props
    const { sendingStatus } = this.state

    if (['IDLE', 'ERROR'].includes(sendingStatus)) {
      return (
        <FeedbackBoxContainer
          isPositiveRatingSelected={feedbackRating === POSITIVE_RATING}
          onSubmit={this.handleSubmit}
          sendingStatus={sendingStatus}
          {...otherProps}
        />
      )
    } else {
      return <FeedbackThanksMessage closeFeedbackModal={this.props.closeFeedbackModal} />
    }
  }

  render() {
    return (
      <FocusTrap>
        <ModalContainer role='dialog' aria-modal>
          <Overlay onClick={this.handleOverlayClick} />
          <FeedbackContainer>{this.renderContent()}</FeedbackContainer>
        </ModalContainer>
      </FocusTrap>
    )
  }
}

export default FeedbackModal
