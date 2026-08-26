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
  const { t } = useTranslation()
  return (
    <Stack
      direction='row'
      sx={{ justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: 1, paddingInlineEnd: 1 }}>
      <Typography component='h2' variant='subtitle1'>
        {t($ => $.places.openingHours)}
      </Typography>
      <Typography variant='subtitle1' color={isCurrentlyOpen ? 'success' : 'error'}>
        {label ?? t($ => (isCurrentlyOpen ? $.places.opened : $.places.closed))}
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
  const { t } = useTranslation()
  const appointmentOnly = !openingHours && !!appointmentUrl

  const AppointmentLink = appointmentUrl ? (
    <Button component={Link} to={appointmentUrl} endIcon={<OpenInNewIcon />}>
      {t($ => $.places.makeAppointment)}
    </Button>
  ) : null

  if (isTemporarilyClosed || appointmentOnly) {
    const label = t($ => (isTemporarilyClosed ? $.places.temporarilyClosed : $.places.onlyWithAppointment))
    return (
      <Stack sx={{ paddingBlock: 1, gap: 1 }}>
        <OpeningHoursTitle isCurrentlyOpen={isCurrentlyOpen} label={label} />
        {AppointmentLink}
      </Stack>
    )
  }

  if (openingHours?.length !== weekdays.length) {
    return null
  }

  return (
    <>
      <Accordion id='hours' title={<OpeningHoursTitle isCurrentlyOpen={isCurrentlyOpen} />} defaultCollapsed>
        <HoursList hours={openingHours} appointmentUrl={appointmentUrl} />
      </Accordion>
      {AppointmentLink}
    </>
  )
}

export default React.memo(OpeningHours)
