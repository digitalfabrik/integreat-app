// @flow

import * as React from 'react'
import { CityModel, POSITIVE_RATING } from '@integreat-app/integreat-api-client'
import styled, { withTheme } from 'styled-components'
import type { LocationState } from 'redux-first-router'
import FeedbackThanksMessage from './FeedbackThanksMessage'
import FeedbackBoxContainer from './FeedbackBoxContainer'
import type { FeedbackRatingType } from '../../layout/containers/LocationLayout'
import FocusTrap from 'focus-trap-react'
import type { ThemeType } from '../../theme/constants/theme'

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
  path?: string,
  alias?: string,
  query?: string,
  feedbackStatus: FeedbackRatingType,
  closeFeedbackModal: () => void,
  location: LocationState,
  theme: ThemeType
|}

type SendingStatusType = 'IDLE' | 'SUCCESS' | 'ERROR'

type StateType = {|
  feedbackSent: SendingStatusType
|}

export class FeedbackModal extends React.Component<PropsType, StateType> {
  state = { feedbackSent: 'IDLE' }

  handleSubmit = (value: SendingStatusType) => {
    this.setState({ feedbackSent: value })
  }

  handleOverlayClick = () => {
    this.setState({ feedbackSent: 'IDLE' })
    this.props.closeFeedbackModal()
  }

  render () {
    const { theme, feedbackStatus, ...otherProps } = this.props
    const { feedbackSent } = this.state

    let boxContainer
    if (['IDLE', 'ERROR'].includes(feedbackSent)) {
      boxContainer = <FeedbackBoxContainer isPositiveRatingSelected={feedbackStatus === POSITIVE_RATING}
                                   {...otherProps}
                                   onSubmit={this.handleSubmit}
                                   feedbackSent={feedbackSent}
                                   theme={theme} />
    } else if (['SUCCESS'].includes(feedbackSent)) {
      boxContainer = <FeedbackThanksMessage closeFeedbackModal={this.props.closeFeedbackModal} />
    }

    return <FocusTrap>
      <ModalContainer role='dialog' aria-modal theme={theme}>
        <Overlay onClick={this.handleOverlayClick} />
        <FeedbackContainer theme={theme}>
          {boxContainer}
        </FeedbackContainer>
      </ModalContainer>
    </FocusTrap>
  }
}

export default withTheme(FeedbackModal)
