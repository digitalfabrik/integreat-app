import React, { ReactNode } from 'react'
import Toolbar from './Toolbar'
import type { FeedbackRatingType } from './LocationLayout'

type PropsType = {
  openFeedbackModal: (rating: FeedbackRatingType) => void,
  children?: ReactNode,
  viewportSmall: boolean
}

class LocationToolbar extends React.PureComponent<PropsType> {
  render() {
    const { viewportSmall, children, openFeedbackModal } = this.props

    return (
      <Toolbar viewportSmall={viewportSmall}>
        {children}
        {/* TODO IGAPP-642 */}
        {/* <FeedbackToolbarItem isPositiveRatingLink openFeedbackModal={openFeedbackModal} viewportSmall={viewportSmall} /> */}
        {/* <FeedbackToolbarItem */}
        {/*  isPositiveRatingLink={false} */}
        {/*  openFeedbackModal={openFeedbackModal} */}
        {/*  viewportSmall={viewportSmall} */}
        {/* /> */}
      </Toolbar>
    )
  }
}

export default LocationToolbar
