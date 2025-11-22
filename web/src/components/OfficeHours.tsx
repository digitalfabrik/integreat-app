import AccessTimeIcon from '@mui/icons-material/AccessTime'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
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
  const theme = useTheme()

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
    <>
      <Stack direction='row' alignItems='center' gap={1}>
        <AccessTimeIcon fontSize='small' />
        <Typography variant='body2'>{t(currentlyOpen === true ? 'opened' : 'closed')}</Typography>
      </Stack>
      <Accordion
        id='office-hours'
        iconColor={theme.palette.primary.main}
        title={
          <Typography color='primary' variant='body2'>
            {t('showHours')}
          </Typography>
        }
        titleOnExpand={
          <Typography color='primary' variant='body2'>
            {t('showLessHours')}
          </Typography>
        }
        defaultCollapsed>
        <HoursList variant='body3' hours={officeHours} />
      </Accordion>
    </>
  )
}

export default OfficeHours
