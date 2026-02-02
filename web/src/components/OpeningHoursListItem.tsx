import ListItem from '@mui/material/ListItem'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { OpeningHoursModel } from 'shared/api'

import { TypographyVariant } from '../../../build-configs/TypographyType'
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
  const { t } = useTranslation('pois')
  const fontWeight = isCurrentDay ? 'bold' : 'normal'

  return (
    <StyledListItem disablePadding>
      <Typography variant={variant} fontWeight={fontWeight}>
        {weekday}
      </Typography>
      <Stack direction='row' alignItems='center' justifyContent='flex-end' gap={1}>
        {openingHours.openAllDay && (
          <Typography variant={variant} fontWeight={fontWeight} sx={{ alignSelf: 'flex-end' }}>
            {t('allDay')}
          </Typography>
        )}
        {openingHours.closedAllDay && (
          <Typography variant={variant} fontWeight={fontWeight} sx={{ alignSelf: 'flex-end' }}>
            {t('closed')}
          </Typography>
        )}
        {!openingHours.openAllDay && !openingHours.closedAllDay && openingHours.timeSlots.length > 0 && (
          <Stack sx={{ justifyContent: 'flex-end' }}>
            {openingHours.timeSlots.map(timeSlot => (
              <Typography
                variant={variant}
                fontWeight={fontWeight}
                key={`${weekday}-${timeSlot.start}`}
                sx={{ alignSelf: 'flex-end' }}>
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
