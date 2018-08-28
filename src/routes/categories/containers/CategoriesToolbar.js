// @flow

import React from 'react'
import { translate } from 'react-i18next'

import CategoriesMapModel from '../../../modules/endpoint/models/CategoriesMapModel'
import ToolbarItem from '../../../modules/layout/components/ToolbarItem'
import { apiUrl } from '../../../modules/endpoint/constants'
import CategoryModel from '../../../modules/endpoint/models/CategoryModel'
import type { TFunction } from 'react-i18next'
import type { LocationState } from 'redux-first-router'
import LocationToolbar from '../../../modules/layout/components/LocationToolbar'

type PropsType = {
  categories: ?CategoriesMapModel,
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
    const {t, location, categories} = this.props
    const category = categories && categories.findCategoryByPath(location.pathname)
    if (!category) {
      return null
    }
    return (
      <LocationToolbar location={location}>
        <ToolbarItem name='file-pdf-o' text={t('createPdf')} href={this.getPdfUrl(category)} />
      </LocationToolbar>
    )
  }
}

export default translate('categories')(CategoriesToolbar)
