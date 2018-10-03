// @flow

import type { Node } from 'react'
import React from 'react'

import Toolbar from '../../../modules/layout/components/Toolbar'
import FeedbackLink from '../../feedback/components/FeedbackLink'
import type { FeedbackRatingType } from '../containers/LocationLayout'

type PropsType = {|
  openFeedbackModal: FeedbackRatingType => void,
  children?: Node
|}

class LocationToolbar extends React.PureComponent<PropsType> {
  render () {
    const {children, openFeedbackModal} = this.props

    return (
      <Toolbar>
        {children}
        <FeedbackLink isPositiveRatingLink openFeedbackModal={openFeedbackModal} />
        <FeedbackLink isPositiveRatingLink={false} openFeedbackModal={openFeedbackModal} />
        {/* todo: Add these functionalities:
                <ToolbarItem name='bookmark-o' text='Merken'href={this.getPdfFetchPath()} />
                <ToolbarItem name='share' text='Teilen' href={this.getPdfFetchPath()} />
                <ToolbarItem name='audio-description' text='Sprachausgabe' href={this.getPdfFetchPath()} /> */}
      </Toolbar>
    )
  }
}

export default LocationToolbar
