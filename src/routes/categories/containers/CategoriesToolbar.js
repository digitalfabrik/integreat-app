// @flow

import React from 'react'
import { translate } from 'react-i18next'

import Toolbar from '../../../modules/layout/components/toolbar/Toolbar'
import CategoriesMapModel from '../../../modules/endpoint/models/CategoriesMapModel'
import ToolbarAnchor from '../../../modules/layout/components/toolbar/ToolbarAnchor'
import { apiUrl } from '../../../modules/endpoint/constants'
import CategoryModel from '../../../modules/endpoint/models/CategoryModel'
import type { TFunction } from 'react-i18next'
import RatingToolbarItem from '../../../modules/layout/components/toolbar/ToolbarRatingItem'

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
    const {t, city, language} = this.props
    const category = this.props.categories.findCategoryByPath(this.props.pathname)
    if (!category) {
      return null
    }
    return <Toolbar>
      <ToolbarAnchor name='file-pdf-o' text={t('createPdf')} href={this.getPdfUrl(category)} />
      <RatingToolbarItem pageId={category.id} city={city} language={language} isPositiveRating />
      <RatingToolbarItem pageId={category.id} city={city} language={language} isPositiveRating={false} />
      {/* todo: Add these functionalities:
              <ToolbarItem name='bookmark-o' text='Merken'href={this.getPdfFetchPath()} />
              <ToolbarItem name='share' text='Teilen' href={this.getPdfFetchPath()} />
              <ToolbarItem name='audio-description' text='Sprachausgabe' href={this.getPdfFetchPath()} /> */}
    </Toolbar>
  }
}

export default translate('categories')(CategoriesToolbar)
