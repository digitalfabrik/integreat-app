import { DateTime } from 'luxon'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { weekdays } from 'shared'
import { OpeningHoursModel } from 'shared/api'

import OpeningHoursListItem from './OpeningHoursListItem'

type HoursListProps = {
  hours: OpeningHoursModel[]
  appointmentUrl: string | null
}

const HoursList = ({ hours, appointmentUrl }: HoursListProps): ReactElement => {
  const { t } = useTranslation('pois')

  return (
    <>
      {hours.map((openingHours, index) => (
        <OpeningHoursListItem
          key={weekdays[index]}
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          weekday={t(weekdays[index]!)}
          isCurrentDay={index === DateTime.now().weekday - 1}
          appointmentUrl={appointmentUrl}
          openingHours={openingHours}
        />
      ))}
    </>
  )
}

export default HoursList
