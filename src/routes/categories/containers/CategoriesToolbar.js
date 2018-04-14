// @flow

import React from 'react'
import { translate } from 'react-i18next'

import Toolbar from '../../../modules/layout/components/Toolbar'
import CategoriesMapModel from '../../../modules/endpoint/models/CategoriesMapModel'
import ToolbarItem from '../../../modules/layout/components/ToolbarItem'
import { apiUrl } from '../../../modules/endpoint/constants'
import CategoryModel from '../../../modules/endpoint/models/CategoryModel'
import type { I18nTranslate } from '../../../flowTypes'

type Props = {
  city: string,
  language: string,
  categories: CategoriesMapModel,
  pathname: string,
  t: I18nTranslate
}

export class CategoriesToolbar extends React.PureComponent<Props> {
  getPdfUrl (category: CategoryModel) {
    if (category.id === 0) {
      return `${apiUrl}/${this.props.city}/${this.props.language}/wp-json/ig-mpdf/v1/pdf`
    } else {
      return `${apiUrl}/${this.props.city}/${this.props.language}/wp-json/ig-mpdf/v1/pdf?url=${category.url}`
    }
  }

  render () {
    const category = this.props.categories.findCategoryByUrl(this.props.pathname)
    if (!category) {
      return null
    }
    return <Toolbar>
      <ToolbarItem name='file-pdf-o' text={this.props.t('createPdf')} href={this.getPdfUrl(category)} />
      {/* todo: Add these functionalities:
              <ToolbarItem name='bookmark-o' text='Merken'href={this.getPdfFetchPath()} />
              <ToolbarItem name='share' text='Teilen' href={this.getPdfFetchPath()} />
              <ToolbarItem name='audio-description' text='Sprachausgabe' href={this.getPdfFetchPath()} /> */}
    </Toolbar>
  }
}

export default translate('categories')(CategoriesToolbar)
