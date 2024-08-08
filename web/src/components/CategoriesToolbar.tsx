import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { CATEGORIES_ROUTE } from 'shared'
import { CategoryModel } from 'shared/api'
import { config } from 'translations'
import { FontType } from 'translations/src/config'

import { PdfIcon } from '../assets'
import { cmsApiBaseUrl } from '../constants/urls'
import CityContentToolbar from './CityContentToolbar'
import ToolbarItem from './ToolbarItem'

type CategoriesToolbarProps = {
  category?: CategoryModel
  cityCode: string
  languageCode: string
  pageTitle: string
}

type LanguageType = { code: string; rtl: boolean; additionalFont?: FontType }

const CategoriesToolbar = (props: CategoriesToolbarProps): ReactElement => {
  const { category, cityCode, languageCode, pageTitle } = props
  const { t } = useTranslation('categories')
  const [supportedRtlLanguages, setSupportedRtlLanguages] = useState([])

  const pdfUrl =
    !category || category.isRoot()
      ? `${cmsApiBaseUrl}/${cityCode}/${languageCode}/wp-json/ig-mpdf/v1/pdf`
      : `${cmsApiBaseUrl}/${cityCode}/${languageCode}/wp-json/ig-mpdf/v1/pdf?url=${encodeURIComponent(category.path)}`

  useEffect(() => {
    const { supportedLanguages } = config
    const rtl = Object.keys(supportedLanguages).map(key => ({ code: key, ...supportedLanguages[key] }))
    setSupportedRtlLanguages(rtl.filter(lang => lang.rtl === true) as [])
  }, [languageCode])

  return (
    <CityContentToolbar
      route={CATEGORIES_ROUTE}
      feedbackTarget={category && !category.isRoot() ? category.slug : undefined}
      pageTitle={pageTitle}>
      <ToolbarItem
        icon={PdfIcon}
        text={t('createPdf')}
        href={pdfUrl}
        isDisabled={supportedRtlLanguages.some((language: LanguageType) => language.code === languageCode)}
      />
    </CityContentToolbar>
  )
}

export default CategoriesToolbar
