import List from '@mui/material/List'
import { styled } from '@mui/material/styles'
import { DateTime } from 'luxon'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { weekdays } from 'shared'
import { OpeningHoursModel } from 'shared/api'

import { TypographyVariant } from '../../../build-configs/TypographyType'
import OpeningHoursListItem from './OpeningHoursListItem'

const StyledList = styled(List)({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
})

type HoursListProps = {
  hours: OpeningHoursModel[]
  appointmentUrl?: string | null
  variant?: TypographyVariant | undefined
}

const HoursList = ({ hours, appointmentUrl = null, variant }: HoursListProps): ReactElement => {
  const { t } = useTranslation('pois')

  return (
    <StyledList disablePadding>
      {hours.map((openingHours, index) => (
        <OpeningHoursListItem
          variant={variant}
          key={weekdays[index]}
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          weekday={t(weekdays[index]!.toLowerCase())}
          openingHours={openingHours}
          isCurrentDay={index === DateTime.now().weekday - 1}
          appointmentUrl={appointmentUrl}
        />
      ))}
    </StyledList>
  )
}

export default HoursList
