// @flow

import React from 'react'
import CategoryModel from '../../../modules/endpoint/models/CategoryModel'
import type { I18nTranslate } from '../../../flowTypes'
import { translate } from 'react-i18next'
import { Timestamp } from './CategoryTimeStamp.styles'

type Props = {
  language: string,
  category: CategoryModel,
  t: I18nTranslate
}

class CategoryTimeStamp extends React.PureComponent<Props> {
  render () {
    const {language, category, t} = this.props

    return <Timestamp>{t('lastUpdate')}{category.getLastUpdate(language)}</Timestamp>
  }
}

export default translate('categories')(CategoryTimeStamp)
