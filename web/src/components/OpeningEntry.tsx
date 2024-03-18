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
  align-items: center;
  padding: 4px 0;
  font-weight: ${props => (props.isCurrentDay ? fontBold : fontStandard)};
`
const Timeslot = styled.div`
  /* display: flex;
  flex-direction: row; */
`

const TimeSlotEntry = styled.span`
  &:not(:first-child) {
    margin-top: 8px;
  }
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
`

type OpeningEntryProps = {
  allDay: boolean
  closed: boolean
  timeSlots: TimeSlot[]
  weekday: string
  isCurrentDay: boolean
}

const OpeningEntry = ({ allDay, closed, timeSlots, weekday, isCurrentDay }: OpeningEntryProps): ReactElement => {
  const { t } = useTranslation('pois')

  return (
    <EntryContainer isCurrentDay={isCurrentDay} id={`openingEntryContainer-${weekday}`}>
      <span>{weekday}</span>
      {allDay && <span>{t('allDay')}</span>}
      {closed && <span>{t('closed')}</span>}
      {!allDay && !closed && timeSlots.length > 0 && (
        <Timeslot>
          {timeSlots.map(timeSlot => (
            <TimeSlotEntry key={`${weekday}-${timeSlot.start}`}>
              {timeSlot.start}-{timeSlot.end}
              <Tooltip text='only by appointment' flow='up'>
                <Icon src={NoteIcon} />
              </Tooltip>
            </TimeSlotEntry>
          ))}
        </Timeslot>
      )}
    </EntryContainer>
  )
}

export default OpeningEntry
