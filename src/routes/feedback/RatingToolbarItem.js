// @flow

import React from 'react'
import { translate } from 'react-i18next'
import ToolbarButton from '../../modules/layout/components/ToolbarButton'
import type { TFunction } from 'react-i18next'

type PropsType = {
  isPositiveRating: boolean,
  t: TFunction
}

class RatingToolbarItem extends React.PureComponent<PropsType> {
  onClick = () => {

  }

  render () {
    const {t, isPositiveRating} = this.props

    if (isPositiveRating) {
      return <ToolbarButton name='smile-o' text={t('positiveRating')} onClick={this.onClick} />
    } else {
      return <ToolbarButton name='frown-o' text={t('negativeRating')} onClick={this.onClick} />
    }
  }
}

export default translate('categories')(RatingToolbarItem)
