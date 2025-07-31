import styled from '@emotion/styled'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { OpeningHoursModel } from 'shared/api'

import AppointmentOnlyIcon from './AppointmentOnlyIcon'

const fontBold = 600
const fontStandard = 400

const EntryContainer = styled.div<{ isCurrentDay: boolean }>`
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  font-weight: ${props => (props.isCurrentDay ? fontBold : fontStandard)};
  position: relative;
`

const Timeslot = styled.div`
  display: flex;
  flex-direction: column;
`

const OpeningContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const TimeSlotEntry = styled.span`
  &:not(:first-of-type) {
    margin-top: 8px;
  }
`

type OpeningEntryProps = {
  openingHours: OpeningHoursModel
  weekday: string
  isCurrentDay: boolean
  appointmentUrl: string | null
}

const OpeningEntry = ({ openingHours, weekday, isCurrentDay, appointmentUrl }: OpeningEntryProps): ReactElement => {
  const { t } = useTranslation('pois')

  return (
    <EntryContainer isCurrentDay={isCurrentDay} id={`openingEntryContainer-${weekday}`}>
      <span>{weekday}</span>
      <OpeningContainer>
        {openingHours.allDay && <span>{t('allDay')}</span>}
        {openingHours.closed && <span>{t('closed')}</span>}
        {!openingHours.allDay && !openingHours.closed && openingHours.timeSlots.length > 0 && (
          <Timeslot>
            {openingHours.timeSlots.map(timeSlot => (
              <TimeSlotEntry key={`${weekday}-${timeSlot.start}`}>
                {timeSlot.start}-{timeSlot.end}
              </TimeSlotEntry>
            ))}
          </Timeslot>
        )}
        {openingHours.appointmentOnly && <AppointmentOnlyIcon appointmentUrl={appointmentUrl} />}
      </OpeningContainer>
    </EntryContainer>
  )
}

export default OpeningEntry
