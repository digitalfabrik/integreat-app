// @flow

import React, { useCallback } from 'react'
import { withTranslation, type TFunction } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFrown, faSmile } from '../../../modules/app/constants/icons'
import { NEGATIVE_RATING, POSITIVE_RATING } from 'api-client'
import StyledToolbarItem from '../../layout/components/StyledToolbarItem'
import StyledSmallViewTip from '../../layout/components/StyledSmallViewTip'
import type { FeedbackRatingType } from '../../layout/containers/LocationLayout'
import type { ThemeType } from 'build-configs/ThemeType'
import type { StyledComponent } from 'styled-components'
import Tooltip from '../../common/components/Tooltip'

type PropsType = {|
  isPositiveRatingLink: boolean,
  t: TFunction,
  openFeedbackModal: FeedbackRatingType => void,
  className?: string,
  viewportSmall: boolean
|}

// $FlowFixMe withComponent exists
const StyledFeedbackToolbarItem: StyledComponent<{||}, ThemeType, *> = StyledToolbarItem.withComponent('button')

const FeedbackToolbarItem = ({ openFeedbackModal, t, isPositiveRatingLink, className, viewportSmall }: PropsType) => {
  const handleLinkClick = useCallback(() =>
    openFeedbackModal(isPositiveRatingLink ? POSITIVE_RATING : NEGATIVE_RATING),
  [isPositiveRatingLink, openFeedbackModal])

  const dataTip = isPositiveRatingLink ? t('positiveRating') : t('negativeRating')
  const smallViewTip = isPositiveRatingLink ? t('useful') : t('notUseful')

  return (
    <Tooltip text={viewportSmall ? null : dataTip} flow='up' mediumViewportFlow='right' smallViewportFlow='down'>
      <StyledFeedbackToolbarItem className={className} onClick={handleLinkClick} aria-label={dataTip}>
        <FontAwesomeIcon
          className={className}
          icon={isPositiveRatingLink ? faSmile : faFrown} />
        {viewportSmall && <StyledSmallViewTip>{smallViewTip}</StyledSmallViewTip>}
      </StyledFeedbackToolbarItem>
    </Tooltip>
  )
}

export default withTranslation<PropsType>('feedback')(FeedbackToolbarItem)
