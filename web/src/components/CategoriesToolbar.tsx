import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { CategoryModel } from 'api-client'

import { PdfIcon } from '../assets'
import { cmsApiBaseUrl } from '../constants/urls'
import CityContentToolbar from './CityContentToolbar'
import ToolbarItem from './ToolbarItem'

type CategoriesToolbarProps = {
  category?: CategoryModel
  cityCode: string
  languageCode: string
  openFeedbackModal: React.Dispatch<React.SetStateAction<boolean>>
  hasDivider: boolean
}

const CategoriesToolbar = (props: CategoriesToolbarProps): ReactElement => {
  const { category, openFeedbackModal, cityCode, languageCode, hasDivider } = props
  const { t } = useTranslation('categories')

  const pdfUrl =
    !category || category.isRoot()
      ? `${cmsApiBaseUrl}/${cityCode}/${languageCode}/wp-json/ig-mpdf/v1/pdf`
      : `${cmsApiBaseUrl}/${cityCode}/${languageCode}/wp-json/ig-mpdf/v1/pdf?url=${encodeURIComponent(category.path)}`

  return (
    <CityContentToolbar openFeedbackModal={openFeedbackModal} hasDivider={hasDivider}>
      <ToolbarItem icon={PdfIcon} text={t('createPdf')} href={pdfUrl} />
    </CityContentToolbar>
  )
}

export default CategoriesToolbar
