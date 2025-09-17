import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { CATEGORIES_ROUTE } from 'shared'
import { CategoryModel } from 'shared/api'
import config from 'translations/src/config'

import { cmsApiBaseUrl } from '../constants/urls'
import CityContentToolbar from './CityContentToolbar'
import ToolbarItem from './ToolbarItem'

type CategoriesToolbarProps = {
  category?: CategoryModel
  cityCode: string
  languageCode: string
  pageTitle: string
}

const CategoriesToolbar = (props: CategoriesToolbarProps): ReactElement => {
  const { category, cityCode, languageCode, pageTitle } = props
  const { t } = useTranslation('categories')
  const pdfDisabled = config.hasRTLScript(languageCode)

  const pdfUrl =
    !category || category.isRoot()
      ? `${cmsApiBaseUrl}/${cityCode}/${languageCode}/wp-json/ig-mpdf/v1/pdf`
      : `${cmsApiBaseUrl}/${cityCode}/${languageCode}/wp-json/ig-mpdf/v1/pdf?url=${encodeURIComponent(category.path)}`

  return (
    <CityContentToolbar
      route={CATEGORIES_ROUTE}
      feedbackTarget={category && !category.isRoot() ? category.slug : undefined}
      pageTitle={pageTitle}>
      <ToolbarItem
        icon={<DescriptionOutlinedIcon />}
        text={t('createPdf')}
        to={pdfUrl}
        disabled={pdfDisabled}
        tooltip={pdfDisabled ? t('disabledPdf') : null}
      />
    </CityContentToolbar>
  )
}

export default CategoriesToolbar
