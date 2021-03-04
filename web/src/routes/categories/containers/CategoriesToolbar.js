// @flow

import React from 'react'
import { withTranslation, type TFunction } from 'react-i18next'
import { faFilePdf } from '../../../modules/app/constants/icons'
import { CategoriesMapModel, CategoryModel } from 'api-client'
import ToolbarItem from '../../../modules/layout/components/ToolbarItem'
import type { LocationState } from 'redux-first-router'
import LocationToolbar from '../../../modules/layout/components/LocationToolbar'
import type { FeedbackRatingType } from '../../../modules/layout/containers/LocationLayout'
import { cmsApiBaseUrl } from '../../../modules/app/constants/urls'

type PropsType = {|
  categories: ?CategoriesMapModel,
  location: LocationState,
  openFeedbackModal: FeedbackRatingType => void,
  t: TFunction,
  viewportSmall: boolean
|}

export class CategoriesToolbar extends React.PureComponent<PropsType> {
  getPdfUrl (category: CategoryModel): string {
    const { city, language } = this.props.location.payload

    if (category.isRoot()) {
      return `${cmsApiBaseUrl}/${city}/${language}/wp-json/ig-mpdf/v1/pdf`
    } else {
      return `${cmsApiBaseUrl}/${city}/${language}/wp-json/ig-mpdf/v1/pdf?url=${encodeURIComponent(category.path)}`
    }
  }

  render () {
    const { t, location, categories, openFeedbackModal, viewportSmall } = this.props
    const category = categories && categories.findCategoryByPath(location.pathname)
    if (!category) {
      return null
    }
    return (
      <LocationToolbar openFeedbackModal={openFeedbackModal} viewportSmall={viewportSmall}>
        <ToolbarItem icon={faFilePdf} text={t('createPdf')} href={this.getPdfUrl(category)} viewportSmall={viewportSmall} />
      </LocationToolbar>
    )
  }
}

export default withTranslation<PropsType>('categories')(CategoriesToolbar)
