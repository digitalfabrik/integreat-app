import ListItem from '@mui/material/ListItem'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

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
}

const OpeningHoursListItem = ({
  openingHours,
  weekday,
  isCurrentDay,
  appointmentUrl,
}: OpeningHoursListItemProps): ReactElement => {
  const { t } = useTranslation('pois')
  const fontWeight = isCurrentDay ? 'bold' : 'normal'

  return (
    <StyledListItem disablePadding>
      <Typography fontWeight={fontWeight}>{weekday}</Typography>
      <Stack direction='row' alignItems='center' gap={1}>
        {openingHours.allDay && <Typography fontWeight={fontWeight}>{t('allDay')}</Typography>}
        {openingHours.closed && <Typography fontWeight={fontWeight}>{t('closed')}</Typography>}
        {!openingHours.allDay && !openingHours.closed && openingHours.timeSlots.length > 0 && (
          <Stack>
            {openingHours.timeSlots.map(timeSlot => (
              <Typography fontWeight={fontWeight} key={`${weekday}-${timeSlot.start}`}>
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
