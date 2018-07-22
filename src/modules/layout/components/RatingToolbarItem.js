// @flow

import React from 'react'
import { translate } from 'react-i18next'
import ToolbarButton from './ToolbarButton'
import type { TFunction } from 'react-i18next'
import categoriesFeedbackEndpoint from '../../endpoint/endpoints/feedback/categoriesFeedback'

type PropsType = {
  city: string,
  language: string,
  pageId: number,
  isPositiveRating: boolean,
  t: TFunction
}

class RatingToolbarItem extends React.PureComponent<PropsType> {
  onClick = () => {
    const {pageId, isPositiveRating, city, language} = this.props
    categoriesFeedbackEndpoint.postData({
      city: city,
      language: language,
      isPositiveRating: isPositiveRating,
      id: pageId
    })
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
