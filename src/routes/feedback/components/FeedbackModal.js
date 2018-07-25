// @flow

import React from 'react'
import Modal from 'react-modal'
import Feedback from './Feedback'
import CityModel from '../../../modules/endpoint/models/CityModel'
import FeedbackButton from '../../../modules/layout/components/FeedbackButton'

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
        <Modal
          isOpen={isOpen}
          onRequestClose={this.closeFeedback}
          contentLabel='Example Modal'>
          <Feedback {...this.props} />
        </Modal>
      </div>
    )
  }
}

export default FeedbackModal
