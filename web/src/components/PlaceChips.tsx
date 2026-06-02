import AccessibleIcon from '@mui/icons-material/Accessible'
import NotAccessibleIcon from '@mui/icons-material/NotAccessible'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { PoiModel } from 'shared/api'

import Link from './base/Link'
import Svg from './base/Svg'

const PoiChips = ({ poi }: { poi: PoiModel }): ReactElement => {
  const { t } = useTranslation()
  const { category } = poi

  return (
    <Stack flexDirection='row' flexWrap='wrap' gap={1}>
      <Chip icon={<Svg src={category.icon} />} label={category.name} variant='outlined' />
      {poi.organization !== null && (
        <Chip component={Link} to={poi.organization.url} label={poi.organization.name} variant='outlined' clickable />
      )}
      {poi.barrierFree === true && <Chip icon={<AccessibleIcon />} label={t('common:accessible')} variant='outlined' />}
      {poi.barrierFree === false && (
        <Chip icon={<NotAccessibleIcon />} label={t('common:notAccessible')} variant='outlined' />
      )}
    </Stack>
  )
}

export default PoiChips
