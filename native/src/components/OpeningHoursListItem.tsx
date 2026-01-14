import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import { OpeningHoursModel } from 'shared/api'

import { contentDirection, isContentDirectionReversalRequired } from '../constants/contentDirection'
import AppointmentOnlyOverlay from './AppointmentOnlyOverlay'
import Icon from './base/Icon'
import Text from './base/Text'

const MARGIN_TOP = 8

const EntryContainer = styled.View<{ language: string }>`
  display: flex;
  flex-direction: ${props => contentDirection(props.language)};
  justify-content: space-between;
  padding: 4px 16px;
`

const Timeslot = styled.View`
  display: flex;
  flex-direction: column;
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

type OpeningEntryProps = {
  openingHours: OpeningHoursModel
  weekday: string
  isCurrentDay: boolean
  language: string
  appointmentUrl: string | null
}

const OpeningEntry = ({
  openingHours,
  weekday,
  isCurrentDay,
  language,
  appointmentUrl,
}: OpeningEntryProps): ReactElement => {
  const { t } = useTranslation('pois')

  const [overlayOpen, setOverlayOpen] = useState<boolean>(false)

  return (
    <EntryContainer language={language}>
      <Text variant={isCurrentDay ? 'h6' : 'body2'}>{weekday}</Text>
      {(openingHours.allDay as boolean) && <Text variant={isCurrentDay ? 'h6' : 'body2'}>{t('allDay')}</Text>}
      {(openingHours.closed as boolean) && <Text variant={isCurrentDay ? 'h6' : 'body2'}>{t('closed')}</Text>}
      {!(openingHours.allDay as boolean) && !(openingHours.closed as boolean) && openingHours.timeSlots.length > 0 && (
        <Timeslot>
          {openingHours.timeSlots.map((timeSlot, index) => (
            <Text
              key={`${weekday}-${timeSlot.start}`}
              variant={isCurrentDay ? 'h6' : 'body2'}
              style={{ marginTop: index !== 0 ? MARGIN_TOP : 0 }}>
              {timeSlot.start}-{timeSlot.end}
            </Text>
          ))}
        </Timeslot>
      )}
      {openingHours.appointmentOnly && (
        <AppointmentOnlyContainer language={language}>
          <StyledPressable role='button' onPress={() => setOverlayOpen(true)}>
            <Icon size={18} source='alert-circle-outline' label={t('appointmentNecessary')} />
          </StyledPressable>
          {overlayOpen && (
            <AppointmentOnlyOverlay closeOverlay={() => setOverlayOpen(false)} appointmentUrl={appointmentUrl} />
          )}
        </AppointmentOnlyContainer>
      )}
    </EntryContainer>
  )
}

export default OpeningEntry
