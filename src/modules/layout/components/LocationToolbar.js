// @flow

import type { Node } from 'react'
import React from 'react'

import Toolbar from '../../../modules/layout/components/Toolbar'
import FeedbackToolbarItem from '../../feedback/components/FeedbackToolbarItem'
import type { FeedbackRatingType } from '../containers/LocationLayout'

type PropsType = {|
  openFeedbackModal: FeedbackRatingType => void,
  children?: Node,
  viewportSmall: boolean
|}

class LocationToolbar extends React.PureComponent<PropsType> {
  render () {
    const { viewportSmall, children, openFeedbackModal } = this.props

    return (
      <Toolbar viewportSmall={viewportSmall}>
        {children}
        <FeedbackToolbarItem isPositiveRatingLink openFeedbackModal={openFeedbackModal} viewportSmall={viewportSmall} />
        <FeedbackToolbarItem isPositiveRatingLink={false} openFeedbackModal={openFeedbackModal} viewportSmall={viewportSmall} />
        {/* todo: Add these functionalities:
                <ToolbarItem name='bookmark-o' text='Merken'href={this.getPdfFetchPath()} />
                <ToolbarItem name='share' text='Teilen' href={this.getPdfFetchPath()} />
                <ToolbarItem name='audio-description' text='Sprachausgabe' href={this.getPdfFetchPath()} /> */}
      </Toolbar>
    )
  }
}

export default LocationToolbar
