// @flow

import React from 'react'
import { translate } from 'react-i18next'
import ToolbarButton from './ToolbarButton'
import type { TFunction } from 'react-i18next'

type PropsType = {
  isPositiveRating: boolean,
  onClick: () => void,
  t: TFunction
}

export class FeedbackButton extends React.PureComponent<PropsType> {
  render () {
    const {t, isPositiveRating, onClick} = this.props

    if (isPositiveRating) {
      return <ToolbarButton name='smile-o' text={t('positiveRating')} onClick={onClick} />
    } else {
      return <ToolbarButton name='frown-o' text={t('negativeRating')} onClick={onClick} />
    }
  }
}

export default translate('feedback')(FeedbackButton)
