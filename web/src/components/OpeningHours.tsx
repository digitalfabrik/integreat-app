import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { weekdays } from 'shared'
import { OpeningHoursModel } from 'shared/api'

import HoursList from './HoursList'
import Accordion from './base/Accordion'
import Link from './base/Link'

type OpeningHoursTitleProps = {
  isCurrentlyOpen: boolean
  label?: string
}

const OpeningHoursTitle = ({ isCurrentlyOpen, label }: OpeningHoursTitleProps) => {
  const { t } = useTranslation('pois')
  return (
    <Stack direction='row' justifyContent='space-between' alignItems='center' width='100%' gap={1} paddingInlineEnd={1}>
      <Typography component='h2' variant='subtitle1'>
        {t('openingHours')}
      </Typography>
      <Typography variant='subtitle1' color={isCurrentlyOpen ? 'success' : 'error'}>
        {t(label ?? (isCurrentlyOpen ? 'opened' : 'closed'))}
      </Typography>
    </Stack>
  )
}

type OpeningHoursProps = {
  isCurrentlyOpen: boolean
  openingHours: OpeningHoursModel[] | null
  isTemporarilyClosed: boolean
  appointmentUrl: string | null
}

const OpeningHours = ({
  isCurrentlyOpen,
  openingHours,
  isTemporarilyClosed,
  appointmentUrl,
}: OpeningHoursProps): ReactElement | null => {
  const { t } = useTranslation('pois')
  const appointmentOnly = !openingHours && !!appointmentUrl

  const AppointmentLink = appointmentUrl ? (
    <Button component={Link} to={appointmentUrl} endIcon={<OpenInNewIcon />}>
      {t('makeAppointment')}
    </Button>
  ) : null

  if (isTemporarilyClosed || appointmentOnly) {
    const label = isTemporarilyClosed ? 'temporarilyClosed' : 'onlyWithAppointment'
    return (
      <>
        <OpeningHoursTitle isCurrentlyOpen={isCurrentlyOpen} label={label} />
        {AppointmentLink}
      </>
    )
  }

  if (openingHours?.length !== weekdays.length) {
    return null
  }

  return (
    <>
      <Accordion
        id='hours'
        title={<OpeningHoursTitle isCurrentlyOpen={isCurrentlyOpen} />}
        defaultCollapsed={!isCurrentlyOpen}>
        <HoursList hours={openingHours} appointmentUrl={appointmentUrl} />
      </Accordion>
      {AppointmentLink}
    </>
  )
}

export default React.memo(OpeningHours)
