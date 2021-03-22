// @flow

import type { Node } from 'react'
import React from 'react'

import Toolbar from '../../../modules/layout/components/Toolbar'
import FeedbackToolbarItem from '../../feedback/components/FeedbackToolbarItem'
import type { FeedbackRatingType } from '../containers/LocationLayout'
import type { UiDirectionType } from '../../i18n/types/UiDirectionType'

type PropsType = {|
  openFeedbackModal: FeedbackRatingType => void,
  children?: Node,
  viewportSmall: boolean,
  direction: UiDirectionType
|}

class LocationToolbar extends React.PureComponent<PropsType> {
  render() {
    const { viewportSmall, children, openFeedbackModal, direction } = this.props

    return (
      <Toolbar viewportSmall={viewportSmall}>
        {children}
        <FeedbackToolbarItem
          isPositiveRatingLink
          openFeedbackModal={openFeedbackModal}
          viewportSmall={viewportSmall}
          direction={direction}
        />
        <FeedbackToolbarItem
          isPositiveRatingLink={false}
          openFeedbackModal={openFeedbackModal}
          viewportSmall={viewportSmall}
          direction={direction}
        />
      </Toolbar>
    )
  }
}

export default LocationToolbar
