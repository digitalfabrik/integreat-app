import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { TimeSlot } from 'shared/api/types'

import { NoteIcon } from '../assets'
import Tooltip from './Tooltip'
import Icon from './base/Icon'

const fontBold = 600
const fontStandard = 400

const EntryContainer = styled.div<{ isCurrentDay: boolean }>`
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  font-weight: ${props => (props.isCurrentDay ? fontBold : fontStandard)};
  border: 1px solid red;
`
const Timeslot = styled.div`
  display: flex;
  flex-direction: column;
`

const TimeSlotEntry = styled.span`
  &:not(:first-child) {
    margin-top: 8px;
  }
`

const StyledTooltip = styled(Tooltip)`
  height: 8px;
  display: inline-block;
  z-index: 1000000000;
`

const Tip = (
  <StyledTooltip text='only by appoitment' flow='right'>
    <Icon src={NoteIcon} />
  </StyledTooltip>
)

type OpeningEntryProps = {
  allDay: boolean
  closed: boolean
  timeSlots: TimeSlot[]
  weekday: string
  isCurrentDay: boolean
}

const OpeningEntry = ({ allDay, closed, timeSlots, weekday, isCurrentDay }: OpeningEntryProps): ReactElement => {
  const { t } = useTranslation('pois')
  console.log(
    'allDay',
    allDay,
    'closed',
    closed,
    'timeSlots',
    timeSlots,
    'weekday',
    weekday,
    'isCurrentDay',
    isCurrentDay,
  )

  return (
    <EntryContainer isCurrentDay={isCurrentDay} id={`openingEntryContainer-${weekday}`}>
      <span>{weekday}</span>
      {allDay && <span>{t('allDay')}allDayy</span>}
      {closed && <span>{t('closed')}closedd</span>}
      {!allDay && !closed && timeSlots.length > 0 && (
        <Timeslot>
          {timeSlots.map(timeSlot => (
            <TimeSlotEntry key={`${weekday}-${timeSlot.start}`}>
              {timeSlot.start}-{timeSlot.end}
              {Tip}
            </TimeSlotEntry>
          ))}
        </Timeslot>
      )}
    </EntryContainer>
  )
}

export default OpeningEntry
