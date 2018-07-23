// @flow

import React from 'react'
import { translate } from 'react-i18next'

import Toolbar from '../../../modules/layout/components/Toolbar'
import CategoriesMapModel from '../../../modules/endpoint/models/CategoriesMapModel'
import ToolbarItem from '../../../modules/layout/components/ToolbarItem'
import { apiUrl } from '../../../modules/endpoint/constants'
import CategoryModel from '../../../modules/endpoint/models/CategoryModel'
import type { TFunction } from 'react-i18next'

type PropsType = {
  city: string,
  language: string,
  categories: CategoriesMapModel,
  pathname: string,
  t: TFunction
}

export class CategoriesToolbar extends React.PureComponent<PropsType> {
  getPdfUrl (category: CategoryModel): string {
    if (category.id === 0) {
      return `${apiUrl}/${this.props.city}/${this.props.language}/wp-json/ig-mpdf/v1/pdf`
    } else {
      return `${apiUrl}/${this.props.city}/${this.props.language}/wp-json/ig-mpdf/v1/pdf?url=${category.path}`
    }
  }

  render () {
    const category = this.props.categories.findCategoryByPath(this.props.pathname)
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
