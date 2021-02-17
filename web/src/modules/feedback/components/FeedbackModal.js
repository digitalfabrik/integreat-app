// @flow

import * as React from 'react'
import { CityModel, OfferModel, POSITIVE_RATING } from 'api-client'
import styled, { withTheme } from 'styled-components'
import type { LocationState } from 'redux-first-router'
import FeedbackThanksMessage from './FeedbackThanksMessage'
import FeedbackBoxContainer from './FeedbackBoxContainer'
import type { FeedbackRatingType } from '../../layout/containers/LocationLayout'
import FocusTrap from 'focus-trap-react'
import type { ThemeType } from 'build-configs/ThemeType'
import dimensions from '../../theme/constants/dimensions'

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

  @media ${dimensions.smallViewport} {
    width: 100%;
    height: 100%;
    align-items: flex-start;
    justify-content: center;
  }
`
type PropsType = {|
  cities: ?Array<CityModel>,
  offers: ?Array<OfferModel>,
  title?: string,
  path?: string,
  alias?: string,
  query?: string,
  feedbackRating: FeedbackRatingType,
  closeFeedbackModal: () => void,
  location: LocationState,
  theme: ThemeType
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

  renderContent (): React.Node {
    const { theme, feedbackRating, ...otherProps } = this.props
    const { sendingStatus } = this.state

    if (['IDLE', 'ERROR'].includes(sendingStatus)) {
      return <FeedbackBoxContainer isPositiveRatingSelected={feedbackRating === POSITIVE_RATING}
                                   onSubmit={this.handleSubmit}
                                   sendingStatus={sendingStatus}
                                   theme={theme}
                                   {...otherProps} />
    } else {
      return <FeedbackThanksMessage closeFeedbackModal={this.props.closeFeedbackModal} />
    }
  }

  render () {
    const { theme } = this.props
    return <FocusTrap>
      <ModalContainer role='dialog' aria-modal theme={theme}>
        <Overlay onClick={this.handleOverlayClick} />
        <FeedbackContainer theme={theme}>
          {this.renderContent()}
        </FeedbackContainer>
      </ModalContainer>
    </FocusTrap>
  }
}

export default withTheme(FeedbackModal)
