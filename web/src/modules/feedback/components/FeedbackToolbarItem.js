// @flow

import React from 'react'
import { withTranslation, type TFunction } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFrown, faSmile } from '../../../modules/app/constants/icons'
import ReactTooltip from 'react-tooltip'
import { NEGATIVE_RATING, POSITIVE_RATING } from 'api-client'
import StyledToolbarItem from '../../layout/components/StyledToolbarItem'
import StyledSmallViewTip from '../../layout/components/StyledSmallViewTip'
import type { FeedbackRatingType } from '../../layout/containers/LocationLayout'
import type { ThemeType } from 'build-configs/ThemeType'
import type { StyledComponent } from 'styled-components'

type PropsType = {|
  isPositiveRatingLink: boolean,
  t: TFunction,
  openFeedbackModal: FeedbackRatingType => void,
  className?: string,
  viewportSmall: boolean
|}

// $FlowFixMe withComponent exists
const StyledFeedbackToolbarItem: StyledComponent<{||}, ThemeType, *> = StyledToolbarItem.withComponent('button')

export class FeedbackToolbarItem extends React.PureComponent<PropsType> {
  componentDidMount () {
    /* https://www.npmjs.com/package/react-tooltip#1-using-tooltip-within-the-modal-eg-react-modal- */
    ReactTooltip.rebuild()
  }

  handleLinkClick = () =>
    this.props.openFeedbackModal(this.props.isPositiveRatingLink ? POSITIVE_RATING : NEGATIVE_RATING)

  render () {
    const { t, isPositiveRatingLink, className, viewportSmall } = this.props
    const dataTip = isPositiveRatingLink ? t('positiveRating') : t('negativeRating')
    const smallViewTip = isPositiveRatingLink ? t('useful') : t('notUseful')

    return (
      <StyledFeedbackToolbarItem className={className} onClick={this.handleLinkClick} aria-label={dataTip}>
        <FontAwesomeIcon
          className={className}
          data-tip={dataTip}
          data-event='mouseover'
          data-event-off='click mouseout'
          icon={isPositiveRatingLink ? faSmile : faFrown} />
        {viewportSmall && <StyledSmallViewTip>{smallViewTip}</StyledSmallViewTip>}
      </StyledFeedbackToolbarItem>
    )
  }
}

export default withTranslation<PropsType>('feedback')(FeedbackToolbarItem)
