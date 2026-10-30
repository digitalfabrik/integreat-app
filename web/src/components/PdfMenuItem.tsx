import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { getPdfUrl } from 'shared'
import { CategoryModel } from 'shared/api'

import { cmsApiBaseUrl } from '../constants/urls'
import MenuItem from './MenuItem'

type PdfMenuItemProps = {
  category?: CategoryModel
  regionCode: string
  languageCode: string
  closeMenu?: () => void
}

const PdfMenuItem = ({ category, regionCode, languageCode, closeMenu, ...other }: PdfMenuItemProps): ReactElement => {
  const { t } = useTranslation()

  const pdfUrl = getPdfUrl({ cmsUrl: cmsApiBaseUrl, regionCode, languageCode, categoryPath: category?.path })

  return (
    <MenuItem
      icon={<DescriptionOutlinedIcon fontSize='small' />}
      text={t($ => $.categories.pdf.create)}
      to={pdfUrl}
      closeMenu={closeMenu}
      {...other}
    />
  )
}

export default PdfMenuItem
