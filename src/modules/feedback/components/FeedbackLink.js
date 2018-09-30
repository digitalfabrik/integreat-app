// @flow

import React from 'react'
import type { TFunction } from 'react-i18next'
import { translate } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFrown, faSmile } from 'modules/app/constants/icons'

import ReactTooltip from 'react-tooltip'
import { NEGATIVE_RATING, POSITIVE_RATING } from '../../../modules/endpoint/FeedbackEndpoint'
import { StyledToolbarItem } from '../../../modules/layout/components/ToolbarItem'
import type { FeedbackRatingType } from '../../layout/containers/LocationLayout'

type PropsType = {
  isPositiveRatingLink: boolean,
  t: TFunction,
  openFeedbackModal: FeedbackRatingType => void,
  className?: string
}

const FeedbackToolbarItem = StyledToolbarItem.withComponent('div')

export class FeedbackLink extends React.PureComponent<PropsType> {
  componentDidMount () {
    /* https://www.npmjs.com/package/react-tooltip#1-using-tooltip-within-the-modal-eg-react-modal- */
    ReactTooltip.rebuild()
  }

  onLinkClick = () => this.props.openFeedbackModal(this.props.isPositiveRatingLink ? POSITIVE_RATING : NEGATIVE_RATING)

  render () {
    const {t, isPositiveRatingLink, className} = this.props
    return (
      <FeedbackToolbarItem
        className={className}
        onClick={this.onLinkClick}>
        <FontAwesomeIcon
          className={className}
          data-tip={isPositiveRatingLink ? t('positiveRating') : t('negativeRating')}
          icon={isPositiveRatingLink ? faSmile : faFrown} />
      </FeedbackToolbarItem>
    )
  }
}

export default translate('feedback')(FeedbackLink)
