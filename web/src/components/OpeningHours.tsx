import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { DateTime } from 'luxon'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { weekdays } from 'shared'
import { OpeningHoursModel } from 'shared/api'

import Collapsible from './Collapsible'
import OpeningEntry from './OpeningEntry'
import Link from './base/Link'

const StyledList = styled(List)({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
})

type OpeningHoursTitleProps = {
  isCurrentlyOpen: boolean
  label?: string
}

const OpeningHoursTitle = ({ isCurrentlyOpen, label }: OpeningHoursTitleProps) => {
  const { t } = useTranslation('pois')
  return (
    <Stack direction='row' justifyContent='space-between' alignItems='center' width='100%' gap={1} paddingInlineEnd={1}>
      <Typography variant='title3'>{t('openingHours')}</Typography>
      <Typography variant='label1' color={isCurrentlyOpen ? 'success' : 'error'}>
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
      <Collapsible title={<OpeningHoursTitle isCurrentlyOpen={isCurrentlyOpen} />} defaultCollapsed={!isCurrentlyOpen}>
        <StyledList disablePadding>
          {openingHours.map((openingHours, index) => (
            <OpeningEntry
              key={weekdays[index]}
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              weekday={t(weekdays[index]!.toLowerCase())}
              openingHours={openingHours}
              isCurrentDay={index === DateTime.now().weekday - 1}
              appointmentUrl={appointmentUrl}
            />
          ))}
        </StyledList>
      </Collapsible>
      {AppointmentLink}
    </>
  )
}

export default React.memo(OpeningHours)
