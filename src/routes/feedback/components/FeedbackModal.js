// @flow

import React from 'react'
import Feedback from './Feedback'
import CityModel from '../../../modules/endpoint/models/CityModel'
import FeedbackButton from '../../../modules/layout/components/FeedbackButton'
import styled from 'styled-components'

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: ${props => props.theme.colors.textSecondaryColor};
  opacity: 0.9;
  z-index: 3;
`

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
`

const FeedbackContainer = styled.div`
  background-color: ${props => props.theme.colors.backgroundColor};
  z-index: 4;
`

type PropsType = {
  cities: Array<CityModel>,
  city: string,
  language: string,
  id?: number,
  title: string,
  alias?: string,
  query?: string,
  route: string,
  isPositiveRating: boolean
}

type StateType = {
  isOpen: boolean
}

class FeedbackModal extends React.Component<PropsType, StateType> {
  state = {isOpen: false}

  openFeedback = () => this.setState({isOpen: true})
  closeFeedback = () => this.setState({isOpen: false})

  render () {
    const {isPositiveRating} = this.props
    const {isOpen} = this.state
    return (
      <div>
        <FeedbackButton isPositiveRating={isPositiveRating} onClick={this.openFeedback} />
        <ModalContainer isOpen={isOpen}>
          <FeedbackContainer>
            <Feedback {...this.props} />
          </FeedbackContainer>
          <Overlay />
        </ModalContainer>
      </div>
    )
  }
}

export default FeedbackModal
