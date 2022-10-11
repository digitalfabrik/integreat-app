import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { CategoryModel } from 'api-client'

import { faFilePdf } from '../constants/icons'
import { cmsApiBaseUrl } from '../constants/urls'
import { FeedbackRatingType } from './FeedbackToolbarItem'
import LocationToolbar from './LocationToolbar'
import ToolbarItem from './ToolbarItem'

type CategoriesToolbarPropsType = {
  category?: CategoryModel
  cityCode: string
  languageCode: string
  openFeedbackModal: (rating: FeedbackRatingType) => void
  viewportSmall: boolean
}

const CategoriesToolbar = (props: CategoriesToolbarPropsType): ReactElement => {
  const { category, openFeedbackModal, viewportSmall, cityCode, languageCode } = props
  const { t } = useTranslation('categories')

  const pdfUrl =
    !category || category.isRoot()
      ? `${cmsApiBaseUrl}/${cityCode}/${languageCode}/wp-json/ig-mpdf/v1/pdf`
      : `${cmsApiBaseUrl}/${cityCode}/${languageCode}/wp-json/ig-mpdf/v1/pdf?url=${encodeURIComponent(category.path)}`

  return (
    <LocationToolbar openFeedbackModal={openFeedbackModal} viewportSmall={viewportSmall}>
      <ToolbarItem icon={faFilePdf} text={t('createPdf')} href={pdfUrl} viewportSmall={viewportSmall} />
    </LocationToolbar>
  )
}

export default CategoriesToolbar
