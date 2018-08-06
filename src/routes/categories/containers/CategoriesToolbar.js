// @flow

import React from 'react'
import { translate } from 'react-i18next'

import Toolbar from '../../../modules/layout/components/Toolbar'
import CategoriesMapModel from '../../../modules/endpoint/models/CategoriesMapModel'
import ToolbarItem from '../../../modules/layout/components/ToolbarItem'
import { apiUrl } from '../../../modules/endpoint/constants'
import CategoryModel from '../../../modules/endpoint/models/CategoryModel'
import type { TFunction } from 'react-i18next'
import FeedbackLink from '../../feedback/components/FeedbackLink'
import type { LocationState } from 'redux-first-router'

type PropsType = {
  categories: CategoriesMapModel,
  location: LocationState,
  t: TFunction
}

export class CategoriesToolbar extends React.PureComponent<PropsType> {
  getPdfUrl (category: CategoryModel): string {
    const {city, language} = this.props.location.payload

    if (category.id === 0) {
      return `${apiUrl}/${city}/${language}/wp-json/ig-mpdf/v1/pdf`
    } else {
      return `${apiUrl}/${city}/${language}/wp-json/ig-mpdf/v1/pdf?url=${category.path}`
    }
  }

  render () {
    const {t, location} = this.props
    const category = this.props.categories.findCategoryByPath(location.pathname)
    if (!category) {
      return null
    }
    return <Toolbar>
      <ToolbarItem name='file-pdf-o' text={t('createPdf')} href={this.getPdfUrl(category)} />
      <FeedbackLink isPositiveRatingLink location={location} />
      <FeedbackLink isPositiveRatingLink={false} location={location} />
      {/* todo: Add these functionalities:
              <ToolbarItem name='bookmark-o' text='Merken'href={this.getPdfFetchPath()} />
              <ToolbarItem name='share' text='Teilen' href={this.getPdfFetchPath()} />
              <ToolbarItem name='audio-description' text='Sprachausgabe' href={this.getPdfFetchPath()} /> */}
    </Toolbar>
  }
}

export default translate('categories')(CategoriesToolbar)
