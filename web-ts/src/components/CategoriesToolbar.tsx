import React, { ReactElement } from 'react'
import { faFilePdf } from '../constants/icons'
import { CategoryModel } from 'api-client'
import ToolbarItem from './ToolbarItem'
import LocationToolbar from './LocationToolbar'
import { cmsApiBaseUrl } from '../constants/urls'
import { FeedbackRatingType } from './FeedbackToolbarItem'
import { useTranslation } from 'react-i18next'

type PropsType = {
  category: CategoryModel
  cityCode: string
  languageCode: string
  openFeedbackModal: (rating: FeedbackRatingType) => void
  viewportSmall: boolean
}

const CategoriesToolbar = (props: PropsType): ReactElement => {
  const { category, openFeedbackModal, viewportSmall, cityCode, languageCode } = props
  const { t } = useTranslation('categories')

  const pdfUrl = category.isRoot() ?
    `${cmsApiBaseUrl}/${cityCode}/${languageCode}/wp-json/ig-mpdf/v1/pdf`
    : `${cmsApiBaseUrl}/${cityCode}/${languageCode}/wp-json/ig-mpdf/v1/pdf?url=${encodeURIComponent(category.path)}`

  return (
    <LocationToolbar openFeedbackModal={openFeedbackModal} viewportSmall={viewportSmall}>
      <ToolbarItem
        icon={faFilePdf}
        text={t('createPdf')}
        href={pdfUrl}
        viewportSmall={viewportSmall}
      />
    </LocationToolbar>
  )
}

export default CategoriesToolbar
