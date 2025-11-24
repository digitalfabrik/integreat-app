import AccessTimeIcon from '@mui/icons-material/AccessTime'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { isCurrentlyOpen, weekdays } from 'shared'
import { OpeningHoursModel } from 'shared/api'

import HoursList from './HoursList'
import Accordion from './base/Accordion'

type OfficeHoursProps = {
  officeHours: OpeningHoursModel[] | null
}

const OfficeHours = ({ officeHours }: OfficeHoursProps): ReactElement | null => {
  const { t } = useTranslation('pois')

  if (!officeHours || officeHours.length !== weekdays.length) {
    return null
  }

  const allDayOpen = officeHours.every(hours => hours.allDay)
  const allDayClosed = officeHours.every(hours => hours.closed)
  const currentlyOpen = isCurrentlyOpen(officeHours)

  if (allDayOpen) {
    return (
      <Stack direction='row' alignItems='center' gap={1}>
        <AccessTimeIcon fontSize='small' />
        <Typography variant='body2'>{t('allDay')}</Typography>
      </Stack>
    )
  }

  if (allDayClosed) {
    return (
      <Stack direction='row' alignItems='center' gap={1}>
        <AccessTimeIcon fontSize='small' />
        <Typography variant='body2'>{t('temporarilyClosed')}</Typography>
      </Stack>
    )
  }

  return (
    <Accordion
      id='office-hours'
      title={
        <Stack direction='row' alignItems='center' gap={1}>
          <AccessTimeIcon fontSize='small' />
          <Typography color='primary' variant='body2'>
            {t(currentlyOpen === true ? 'opened' : 'closed')}
          </Typography>
        </Stack>
      }
      defaultCollapsed>
      <HoursList variant='body3' hours={officeHours} />
    </Accordion>
  )
}

export default OfficeHours
