import React, { ReactElement } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Tooltip } from 'react-tooltip'
import styled from 'styled-components'

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
  position: absolute;
  right: -27px;
`

const TimeSlotEntry = styled.span`
  &:not(:first-child) {
    margin-top: 8px;
  }
`

const StyledIcon = styled(Icon)`
  width: 18px;
  height: 18px;
  align-self: center;
`

const TooltipTitle = styled.div`
  font-weight: 700;
  margin-bottom: 8px;
`

type AppointmentOnlyIconProps = {
  link: string | null
}

const AppointmentOnlyIcon = ({ link }: AppointmentOnlyIconProps): ReactElement => {
  const { t } = useTranslation('pois')

  return (
    <>
      <IconContainer id='apointment'>
        <StyledIcon src={NoteIcon} />
      </IconContainer>
      <Tooltip
        anchorSelect='#apointment'
        clickable
        style={{
          width: '250px',
        }}>
        <TooltipTitle>{t('appointmentNecessary')}</TooltipTitle>
        <span>
          {link ? (
            <Trans i18nKey='makeAppointmentTooltipWithLink' ns='pois'>
              This gets replaced by <Link to={link}>react-18next</Link>.
            </Trans>
          ) : (
            t('makeAppointmentTooltipWithoutLink')
          )}
        </span>
      </Tooltip>
    </>
  )
}

type OpeningEntryProps = {
  allDay: boolean
  closed: boolean
  timeSlots: TimeSlot[]
  weekday: string
  isCurrentDay: boolean
  appointmentOnly: boolean
  link: string | null
}

const OpeningEntry = ({
  allDay,
  closed,
  timeSlots,
  weekday,
  isCurrentDay,
  appointmentOnly,
  link,
}: OpeningEntryProps): ReactElement => {
  const { t } = useTranslation('pois')

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
        {appointmentOnly && <AppointmentOnlyIcon link={link} />}
      </OpeningContainer>
    </EntryContainer>
  )
}

export default OpeningEntry
