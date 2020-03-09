// @flow

import React from 'react'
import type { TFunction } from 'react-i18next'
import { withTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFrown, faSmile } from '../../../modules/app/constants/icons'

import ReactTooltip from 'react-tooltip'
import { NEGATIVE_RATING, POSITIVE_RATING } from '@integreat-app/integreat-api-client'
import StyledToolbarItem from '../../../modules/layout/components/StyledToolbarItem'
import type { FeedbackRatingType } from '../../layout/containers/LocationLayout'

type PropsType = {|
  isPositiveRatingLink: boolean,
  t: TFunction,
  openFeedbackModal: FeedbackRatingType => void,
  className?: string
|}

const StyledFeedbackToolbarItem = StyledToolbarItem.withComponent('div')

export class FeedbackToolbarItem extends React.PureComponent<PropsType> {
  componentDidMount () {
    /* https://www.npmjs.com/package/react-tooltip#1-using-tooltip-within-the-modal-eg-react-modal- */
    ReactTooltip.rebuild()
  }

  handleLinkClick = () => this.props.openFeedbackModal(this.props.isPositiveRatingLink ? POSITIVE_RATING : NEGATIVE_RATING)

  render () {
    const { t, isPositiveRatingLink, className } = this.props
    const dataTip = isPositiveRatingLink ? t('positiveRating') : t('negativeRating')
    return (
      <StyledFeedbackToolbarItem className={className} onClick={this.handleLinkClick}>
        <FontAwesomeIcon
          className={className}
          data-tip={dataTip}
          aria-label={dataTip}
          icon={isPositiveRatingLink ? faSmile : faFrown} />
      </StyledFeedbackToolbarItem>
    )
  }
}

export default withTranslation('feedback')(FeedbackToolbarItem)
