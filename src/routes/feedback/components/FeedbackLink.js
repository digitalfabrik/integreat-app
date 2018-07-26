// @flow

import React from 'react'
import { translate } from 'react-i18next'
import type { TFunction } from 'react-i18next'
import CleanLink from '../../../modules/common/components/CleanLink'
import FontAwesome from 'react-fontawesome'
import ReactTooltip from 'react-tooltip'
import { NEGATIVE_RATING, POSITIVE_RATING } from '../../../modules/endpoint/FeedbackEndpoint'

type PropsType = {
  isPositiveRatingLink: boolean,
  t: TFunction,
  pathname: string,
  className: ?string
}

export class FeedbackLink extends React.PureComponent<PropsType> {
  componentDidMount () {
    /* https://www.npmjs.com/package/react-tooltip#1-using-tooltip-within-the-modal-eg-react-modal- */
    ReactTooltip.rebuild()
  }

  render () {
    const {t, isPositiveRatingLink, pathname, className} = this.props

    return (
      <CleanLink
        className={className}
        to={`${pathname}?feedback=${isPositiveRatingLink ? POSITIVE_RATING : NEGATIVE_RATING}`}>
        <FontAwesome
          className={className}
          data-tip={isPositiveRatingLink ? t('positiveRating') : t('negativeRating')}
          name={isPositiveRatingLink ? 'smile-o' : 'frown-o'} />
      </CleanLink>
    )
  }
}

export default translate('feedback')(FeedbackLink)
