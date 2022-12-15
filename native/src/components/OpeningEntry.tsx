import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import { TimeSlot } from 'api-client/src/types'

import { contentDirection } from '../constants/contentDirection'

const EntryContainer = styled.View<{ language: string }>`
  display: flex;
  flex-direction: ${props => contentDirection(props.language)};
  justify-content: space-between;
  padding: ${props => (contentDirection(props.language) === 'row' ? '4px 36px 4px 0' : '4px 26px 4px 0')};
`
const Timeslot = styled.View`
  display: flex;
  flex-direction: column;
`

const TimeSlotEntry = styled.Text<{ isCurrentDay: boolean; notFirstChild?: boolean }>`
  font-family: ${props =>
    props.isCurrentDay ? props.theme.fonts.native.contentFontBold : props.theme.fonts.native.contentFontRegular};
  ${props => props.notFirstChild && 'margin-top: 8px'};
`

const TimeSlotLabel = styled.Text<{ isCurrentDay: boolean }>`
  font-family: ${props =>
    props.isCurrentDay ? props.theme.fonts.native.contentFontBold : props.theme.fonts.native.contentFontRegular};
`

type OpeningEntryProps = {
  allDay: boolean
  closed: boolean
  timeSlots: TimeSlot[]
  weekday: string
  isCurrentDay: boolean
  language: string
}

const OpeningEntry = ({
  allDay,
  closed,
  timeSlots,
  weekday,
  isCurrentDay,
  language,
}: OpeningEntryProps): ReactElement => {
  const { t } = useTranslation('pois')

  return (
    <EntryContainer language={language}>
      <TimeSlotLabel isCurrentDay={isCurrentDay}>{weekday}</TimeSlotLabel>
      {allDay && <TimeSlotEntry isCurrentDay={isCurrentDay}>{t('openingHoursAllDay')}</TimeSlotEntry>}
      {closed && <TimeSlotEntry isCurrentDay={isCurrentDay}>{t('openingHoursClosed')}</TimeSlotEntry>}
      {!allDay && !closed && timeSlots.length > 0 && (
        <Timeslot>
          {timeSlots.map((timeSlot, index) => (
            <TimeSlotEntry key={`${weekday}-${timeSlot.start}`} isCurrentDay={isCurrentDay} notFirstChild={index !== 0}>
              {timeSlot.start}-{timeSlot.end}
            </TimeSlotEntry>
          ))}
        </Timeslot>
      )}
    </EntryContainer>
  )
}

export default OpeningEntry
