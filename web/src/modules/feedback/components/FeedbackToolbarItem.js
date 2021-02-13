// @flow

import React from 'react'
import type { TFunction } from 'react-i18next'
import { withTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFrown, faSmile } from '../../../modules/app/constants/icons'
import { NEGATIVE_RATING, POSITIVE_RATING } from 'api-client'
import StyledToolbarItem from '../../layout/components/StyledToolbarItem'
import StyledSmallViewTip from '../../layout/components/StyledSmallViewTip'
import type { FeedbackRatingType } from '../../layout/containers/LocationLayout'
import Tooltip from '../../common/components/Tooltip'

type PropsType = {|
  isPositiveRatingLink: boolean,
  t: TFunction,
  openFeedbackModal: FeedbackRatingType => void,
  className?: string,
  viewportSmall: boolean
|}

const StyledFeedbackToolbarItem = StyledToolbarItem.withComponent('button')

export class FeedbackToolbarItem extends React.PureComponent<PropsType> {
  handleLinkClick = () =>
    this.props.openFeedbackModal(this.props.isPositiveRatingLink ? POSITIVE_RATING : NEGATIVE_RATING)

  render () {
    const { t, isPositiveRatingLink, className, viewportSmall } = this.props
    const dataTip = isPositiveRatingLink ? t('positiveRating') : t('negativeRating')
    const smallViewTip = isPositiveRatingLink ? t('useful') : t('notUseful')

    return (
      <Tooltip text={dataTip} direction={'up'} lowWidthFallback={'right'}>
        <StyledFeedbackToolbarItem className={className} onClick={this.handleLinkClick} aria-label={dataTip}>
          <FontAwesomeIcon
            className={className}
            icon={isPositiveRatingLink ? faSmile : faFrown} />
          {viewportSmall && <StyledSmallViewTip>{smallViewTip}</StyledSmallViewTip>}
        </StyledFeedbackToolbarItem>
      </Tooltip>
    )
  }
}

export default withTranslation('feedback')(FeedbackToolbarItem)
