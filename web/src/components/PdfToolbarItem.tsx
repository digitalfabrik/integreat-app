import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import React, { FunctionComponent, ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { CategoryModel } from 'shared/api'
import config from 'translations/src/config'

import { cmsApiBaseUrl } from '../constants/urls'
import ToolbarItem, { ToolbarItemProps } from './ToolbarItem'

type CreatePdfToolbarItemProps = {
  category?: CategoryModel
  cityCode: string
  languageCode: string
  Component?: FunctionComponent<ToolbarItemProps>
}

const PdfToolbarItem = ({
  category,
  cityCode,
  languageCode,
  Component = ToolbarItem,
}: CreatePdfToolbarItemProps): ReactElement => {
  const { t } = useTranslation('categories')
  const pdfDisabled = config.hasRTLScript(languageCode)

  const pdfUrl =
    !category || category.isRoot()
      ? `${cmsApiBaseUrl}/${cityCode}/${languageCode}/wp-json/ig-mpdf/v1/pdf`
      : `${cmsApiBaseUrl}/${cityCode}/${languageCode}/wp-json/ig-mpdf/v1/pdf?url=${encodeURIComponent(category.path)}`

  return (
    <Component
      icon={<DescriptionOutlinedIcon />}
      text={t('createPdf')}
      to={pdfUrl}
      disabled={pdfDisabled}
      tooltip={pdfDisabled ? t('disabledPdf') : null}
    />
  )
}

export default PdfToolbarItem
