import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { ReactElement, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { NEGATIVE_RATING, POSITIVE_RATING } from 'api-client'

import { faFrown, faSmile } from '../constants/icons'
import StyledSmallViewTip from './StyledSmallViewTip'
import StyledToolbarItem from './StyledToolbarItem'
import Tooltip from './Tooltip'

export type FeedbackRatingType = 'up' | 'down'

type PropsType = {
  isPositiveRatingLink: boolean
  openFeedbackModal: (rating: FeedbackRatingType) => void
  className?: string
  viewportSmall: boolean
}

const StyledFeedbackToolbarItem = StyledToolbarItem.withComponent('button')

const FeedbackToolbarItem = ({
  openFeedbackModal,
  isPositiveRatingLink,
  className,
  viewportSmall,
}: PropsType): ReactElement => {
  const { t } = useTranslation('feedback')
  const handleLinkClick = useCallback(
    () => openFeedbackModal(isPositiveRatingLink ? POSITIVE_RATING : NEGATIVE_RATING),
    [isPositiveRatingLink, openFeedbackModal]
  )
  const dataTip = isPositiveRatingLink ? t('positiveRating') : t('negativeRating')
  const smallViewTip = isPositiveRatingLink ? t('useful') : t('notUseful')
  return (
    <Tooltip text={viewportSmall ? null : dataTip} flow='up' mediumViewportFlow='right' smallViewportFlow='down'>
      <StyledFeedbackToolbarItem className={className} onClick={handleLinkClick} aria-label={dataTip}>
        <FontAwesomeIcon className={className} icon={isPositiveRatingLink ? faSmile : faFrown} />
        {viewportSmall && <StyledSmallViewTip>{smallViewTip}</StyledSmallViewTip>}
      </StyledFeedbackToolbarItem>
    </Tooltip>
  )
}

export default FeedbackToolbarItem
