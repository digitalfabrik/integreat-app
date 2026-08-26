import ListItem from '@mui/material/ListItem'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import type { TypographyVariant } from 'build-configs/TypographyType'
import { OpeningHoursModel } from 'shared/api'

import AppointmentOnlyIcon from './AppointmentOnlyIcon'

const StyledListItem = styled(ListItem)({
  justifyContent: 'space-between',
})

type OpeningHoursListItemProps = {
  openingHours: OpeningHoursModel
  weekday: string
  isCurrentDay: boolean
  appointmentUrl: string | null
  variant?: TypographyVariant | undefined
}

const OpeningHoursListItem = ({
  openingHours,
  weekday,
  isCurrentDay,
  appointmentUrl,
  variant,
}: OpeningHoursListItemProps): ReactElement => {
  const { t } = useTranslation('places')
  const fontWeight = isCurrentDay ? 'bold' : 'normal'

  return (
    <StyledListItem disablePadding>
      <Typography variant={variant} sx={{ fontWeight }}>
        {weekday}
      </Typography>
      <Stack direction='row' sx={{ alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
        {openingHours.openAllDay && (
          <Typography variant={variant} sx={{ fontWeight, alignSelf: 'flex-end' }}>
            {t('allDay')}
          </Typography>
        )}
        {openingHours.closedAllDay && (
          <Typography variant={variant} sx={{ fontWeight, alignSelf: 'flex-end' }}>
            {t('closed')}
          </Typography>
        )}
        {!openingHours.openAllDay && !openingHours.closedAllDay && openingHours.timeSlots.length > 0 && (
          <Stack sx={{ justifyContent: 'flex-end' }}>
            {openingHours.timeSlots.map(timeSlot => (
              <Typography
                variant={variant}
                key={`${weekday}-${timeSlot.start}`}
                sx={{ fontWeight, alignSelf: 'flex-end' }}>
                {timeSlot.start}-{timeSlot.end}
              </Typography>
            ))}
          </Stack>
        )}
        {openingHours.appointmentOnly && <AppointmentOnlyIcon appointmentUrl={appointmentUrl} />}
      </Stack>
    </StyledListItem>
  )
}

export default OpeningHoursListItem
