// @flow

import React from 'react'
import type { TFunction } from 'react-i18next'
import { translate } from 'react-i18next'
import { faFilePdf } from 'modules/app/constants/icons'

import CategoriesMapModel from '../../../modules/endpoint/models/CategoriesMapModel'
import ToolbarItem from '../../../modules/layout/components/ToolbarItem'
import { apiUrl } from '../../../modules/endpoint/constants'
import CategoryModel from '../../../modules/endpoint/models/CategoryModel'
import type { LocationState } from 'redux-first-router'
import LocationToolbar from '../../../modules/layout/components/LocationToolbar'
import type { FeedbackRatingType } from '../../../modules/layout/containers/LocationLayout'

type PropsType = {|
  categories: ?CategoriesMapModel,
  location: LocationState,
  openFeedbackModal: FeedbackRatingType => void,
  t: TFunction
|}

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
    const {t, location, categories, openFeedbackModal} = this.props
    const category = categories && categories.findCategoryByPath(location.pathname)
    if (!category) {
      return null
    }
    return (
      <LocationToolbar openFeedbackModal={openFeedbackModal}>
        <ToolbarItem icon={faFilePdf} text={t('createPdf')} href={this.getPdfUrl(category)} />
      </LocationToolbar>
    )
  }
}

export default translate('categories')(CategoriesToolbar)
