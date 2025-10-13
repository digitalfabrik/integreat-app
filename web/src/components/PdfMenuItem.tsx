import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { CategoryModel } from 'shared/api'
import config from 'translations/src/config'

import { cmsApiBaseUrl } from '../constants/urls'
import MenuItem from './MenuItem'

type PdfMenuItemProps = {
  category?: CategoryModel
  cityCode: string
  languageCode: string
  closeMenu?: () => void
}

const PdfMenuItem = ({ category, cityCode, languageCode, closeMenu, ...other }: PdfMenuItemProps): ReactElement => {
  const { t } = useTranslation('categories')
  const pdfDisabled = config.hasRTLScript(languageCode)

  const pdfUrl =
    !category || category.isRoot()
      ? `${cmsApiBaseUrl}/${cityCode}/${languageCode}/wp-json/ig-mpdf/v1/pdf`
      : `${cmsApiBaseUrl}/${cityCode}/${languageCode}/wp-json/ig-mpdf/v1/pdf?url=${encodeURIComponent(category.path)}`

  return (
    <MenuItem
      icon={<DescriptionOutlinedIcon fontSize='small' />}
      text={t('createPdf')}
      to={pdfUrl}
      disabled={pdfDisabled}
      tooltip={pdfDisabled ? t('disabledPdf') : null}
      closeMenu={closeMenu}
      {...other}
    />
  )
}

export default PdfMenuItem
