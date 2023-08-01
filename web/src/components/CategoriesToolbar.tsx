import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { CATEGORIES_ROUTE, CategoryModel, CityModel } from 'api-client'

import { PdfIcon } from '../assets'
import { cmsApiBaseUrl } from '../constants/urls'
import CityContentToolbar from './CityContentToolbar'
import ToolbarItem from './ToolbarItem'

type CategoriesToolbarProps = {
  category?: CategoryModel
  cityCode: string
  languageCode: string
  city: CityModel
}

const CategoriesToolbar = (props: CategoriesToolbarProps): ReactElement => {
  const { category, cityCode, languageCode, city } = props
  const { t } = useTranslation('categories')

  const pdfUrl =
    !category || category.isRoot()
      ? `${cmsApiBaseUrl}/${cityCode}/${languageCode}/wp-json/ig-mpdf/v1/pdf`
      : `${cmsApiBaseUrl}/${cityCode}/${languageCode}/wp-json/ig-mpdf/v1/pdf?url=${encodeURIComponent(category.path)}`

  const pageTitle = `${!category || category.isRoot() ? t('dashboard:localInformation') : category.title} - ${
    city.name
  }`

  return (
    <CityContentToolbar
      languageCode={languageCode}
      route={CATEGORIES_ROUTE}
      feedbackTarget={category && !category.isRoot() ? category.slug : undefined}
      title={pageTitle}>
      <ToolbarItem icon={PdfIcon} text={t('createPdf')} href={pdfUrl} />
    </CityContentToolbar>
  )
}

export default CategoriesToolbar
