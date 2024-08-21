import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import { TimeSlot } from 'shared/api/types'

import { NoteIcon } from '../assets'
import { contentDirection, isContentDirectionReversalRequired } from '../constants/contentDirection'
import AppointmentOnlyOverlay from './AppointmentOnlyOverlay'
import Icon from './base/Icon'

const EntryContainer = styled.View<{ language: string }>`
  display: flex;
  flex-direction: ${props => contentDirection(props.language)};
  justify-content: space-between;
  padding: ${props => (isContentDirectionReversalRequired(props.language) ? '4px 26px 4px 0' : '4px 36px 4px 0')};
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

const AppointmentOnlyContainer = styled.View<{ language: string }>`
  position: absolute;
  top: 6px;
  ${props => (isContentDirectionReversalRequired(props.language) ? 'right: 3px;' : 'right: -3px;')}
`

const StyledPressable = styled.Pressable`
  width: 24px;
  height: 24px;
`

const StyledIcon = styled(Icon)`
  height: 18px;
  width: 18px;
`

type OpeningEntryProps = {
  allDay: boolean
  closed: boolean
  timeSlots: TimeSlot[]
  weekday: string
  isCurrentDay: boolean
  language: string
  appointmentOnly: boolean
  appointmentOverlayLink: string | null
}

const OpeningEntry = ({
  allDay,
  closed,
  timeSlots,
  weekday,
  isCurrentDay,
  language,
  appointmentOnly,
  appointmentOverlayLink,
}: OpeningEntryProps): ReactElement => {
  const { t } = useTranslation('pois')

  const [overlayOpen, setOverlayOpen] = useState<boolean>(false)

  return (
    <EntryContainer language={language}>
      <TimeSlotLabel isCurrentDay={isCurrentDay}>{weekday}</TimeSlotLabel>
      {allDay && <TimeSlotEntry isCurrentDay={isCurrentDay}>{t('allDay')}</TimeSlotEntry>}
      {closed && <TimeSlotEntry isCurrentDay={isCurrentDay}>{t('closed')}</TimeSlotEntry>}
      {!allDay && !closed && timeSlots.length > 0 && (
        <Timeslot>
          {timeSlots.map((timeSlot, index) => (
            <TimeSlotEntry key={`${weekday}-${timeSlot.start}`} isCurrentDay={isCurrentDay} notFirstChild={index !== 0}>
              {timeSlot.start}-{timeSlot.end}
            </TimeSlotEntry>
          ))}
        </Timeslot>
      )}
      {appointmentOnly && (
        <AppointmentOnlyContainer language={language}>
          <StyledPressable onPress={() => setOverlayOpen(true)}>
            <StyledIcon Icon={NoteIcon} label={t('appointmentNecessary')} />
          </StyledPressable>
          {overlayOpen && (
            <AppointmentOnlyOverlay
              closeOverlay={() => setOverlayOpen(false)}
              appointmentUrl={appointmentOverlayLink}
            />
          )}
        </AppointmentOnlyContainer>
      )}
    </EntryContainer>
  )
}

export default OpeningEntry
