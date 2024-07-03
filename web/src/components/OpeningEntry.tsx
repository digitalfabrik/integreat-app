import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Tooltip } from 'react-tooltip'
import styled, { useTheme } from 'styled-components'

import { TimeSlot } from 'shared/api/types'

import { NoteIcon } from '../assets'
import Icon from './base/Icon'

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

const IconContainer = styled.button`
  padding: 0;
  border: none;
  background-color: transparent;
  align-self: center;
  width: 18px;
  height: 18px;
`

const TimeSlotEntry = styled.span`
  &:not(:first-child) {
    margin-top: 8px;
  }
`

const StyledIcon = styled(Icon)<{ $opacity: boolean }>`
  width: 18px;
  height: 18px;
  align-self: center;
  opacity: ${props => (props.$opacity ? '1' : '0')};
`

type OpeningEntryProps = {
  allDay: boolean
  closed: boolean
  timeSlots: TimeSlot[]
  weekday: string
  isCurrentDay: boolean
  appointmentOnly: boolean
}

const OpeningEntry = ({
  allDay,
  closed,
  timeSlots,
  weekday,
  isCurrentDay,
  appointmentOnly,
}: OpeningEntryProps): ReactElement => {
  const { t } = useTranslation('pois')
  const theme = useTheme()

  return (
    <EntryContainer isCurrentDay={isCurrentDay} id={`openingEntryContainer-${weekday}`}>
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
        {/* TODO: Put into a separate component */}
        {appointmentOnly && (
          <>
            <IconContainer id='apointment'>
              <StyledIcon src={NoteIcon} $opacity={appointmentOnly} />
            </IconContainer>
            <Tooltip
              anchorSelect='#apointment'
              clickable
              style={{
                background: theme.colors.textSecondaryColor,
                color: theme.colors.backgroundColor,
                width: '200px',
              }}>
              <div>
                Vereinbare an diesem Tag einen Termin über <Link to='https://google.com'>diese Website</Link> oder
                telefonisch.
              </div>
            </Tooltip>
          </>
        )}
      </OpeningContainer>
    </EntryContainer>
  )
}

export default OpeningEntry
