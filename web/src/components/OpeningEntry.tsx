import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { TimeSlot } from 'shared/api/types'

import AppointmentOnlyIcon from './AppointmentOnlyIcon'

const fontBold = 600
const fontStandard = 400

const EntryContainer = styled.div<{ $isCurrentDay: boolean }>`
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  font-weight: ${props => (props.$isCurrentDay ? fontBold : fontStandard)};
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
  &:not(:first-child) {
    margin-top: 8px;
  }
`

type OpeningEntryProps = {
  allDay: boolean
  closed: boolean
  timeSlots: TimeSlot[]
  weekday: string
  isCurrentDay: boolean
  appointmentOnly: boolean
  appointmentOverlayLink: string | null
}

const OpeningEntry = ({
  allDay,
  closed,
  timeSlots,
  weekday,
  isCurrentDay,
  appointmentOnly,
  appointmentOverlayLink,
}: OpeningEntryProps): ReactElement => {
  const { t } = useTranslation('pois')

  return (
    <EntryContainer $isCurrentDay={isCurrentDay} id={`openingEntryContainer-${weekday}`}>
      <span>{weekday}</span>
      <OpeningContainer>
        {allDay && <span>{t('allDay')}</span>}
        {closed && <span>{t('closed')}</span>}
        {!allDay && !closed && timeSlots.length > 0 && (
          <Timeslot>
            {timeSlots.map(timeSlot => (
              <TimeSlotEntry key={`${weekday}-${timeSlot.start}`}>
                {timeSlot.start}-{timeSlot.end}
              </TimeSlotEntry>
            ))}
          </Timeslot>
        )}
        {appointmentOnly && <AppointmentOnlyIcon appointmentUrl={appointmentOverlayLink} />}
      </OpeningContainer>
    </EntryContainer>
  )
}

export default OpeningEntry
