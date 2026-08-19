import AccessibleIcon from '@mui/icons-material/Accessible'
import NotAccessibleIcon from '@mui/icons-material/NotAccessible'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { PlaceModel } from 'shared/api'

import Link from './base/Link'
import Svg from './base/Svg'

const PlaceChips = ({ place }: { place: PlaceModel }): ReactElement => {
  const { t } = useTranslation(['common'])
  const { category } = place

  return (
    <Stack sx={{ flexDirection: 'row', flexWrap: 'wrap', gap: 1 }}>
      <Chip icon={<Svg src={category.icon} />} label={category.name} variant='outlined' />
      {place.organization !== null && (
        <Chip
          component={Link}
          to={place.organization.url}
          label={place.organization.name}
          variant='outlined'
          clickable
        />
      )}
      {place.barrierFree === true && <Chip icon={<AccessibleIcon />} label={t($ => $.accessible)} variant='outlined' />}
      {place.barrierFree === false && (
        <Chip icon={<NotAccessibleIcon />} label={t($ => $.notAccessible)} variant='outlined' />
      )}
    </Stack>
  )
}

export default PlaceChips
