// @flow

import React from 'react'
import type { TFunction } from 'react-i18next'
import { translate } from 'react-i18next'
import CleanLink from '../../../modules/common/components/CleanLink'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFrown, faSmile } from 'modules/app/constants/icons'

import ReactTooltip from 'react-tooltip'
import { NEGATIVE_RATING, POSITIVE_RATING } from '../../../modules/endpoint/FeedbackEndpoint'
import type { LocationState } from 'redux-first-router'
import { goToFeedback } from '../../../modules/app/routes/feedback'
import { StyledToolbarItem } from '../../../modules/layout/components/ToolbarItem'

const StyledLink = StyledToolbarItem.withComponent(CleanLink)

type PropsType = {|
  isPositiveRatingLink: boolean,
  t: TFunction,
  location: LocationState,
  className?: string
|}

export class FeedbackLink extends React.PureComponent<PropsType> {
  componentDidMount () {
    /* https://www.npmjs.com/package/react-tooltip#1-using-tooltip-within-the-modal-eg-react-modal- */
    ReactTooltip.rebuild()
  }

  render () {
    const {t, isPositiveRatingLink, location, className} = this.props
    return (
      <StyledLink
        className={className}
        to={goToFeedback(location, isPositiveRatingLink ? POSITIVE_RATING : NEGATIVE_RATING)}>
        <FontAwesomeIcon
          className={className}
          data-tip={isPositiveRatingLink ? t('positiveRating') : t('negativeRating')}
          icon={isPositiveRatingLink ? faSmile : faFrown} />
      </StyledLink>
    )
  }
}

export default translate('feedback')(FeedbackLink)
