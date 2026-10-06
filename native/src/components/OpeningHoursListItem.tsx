import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { TouchableRipple } from 'react-native-paper'
import styled from 'styled-components/native'

import { OpeningHoursModel } from 'shared/api'

import { contentDirection } from '../constants/contentDirection'
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

const styles = StyleSheet.create({
  entryRow: {
    alignItems: 'center',
    gap: 4,
  },
})

type OpeningEntryProps = {
  openingHours: OpeningHoursModel
  weekday: string
  isCurrentDay: boolean
  appointmentUrl: string | null
}

const OpeningEntry = ({ openingHours, weekday, isCurrentDay, appointmentUrl }: OpeningEntryProps): ReactElement => {
  const { i18n, t } = useTranslation()

  const [overlayOpen, setOverlayOpen] = useState<boolean>(false)

  return (
    <EntryContainer language={i18n.language} accessible>
      <Text variant={isCurrentDay ? 'h6' : 'body2'}>{weekday}</Text>
      <View style={[styles.entryRow, { flexDirection: contentDirection(i18n.language) }]}>
        {(openingHours.openAllDay as boolean) && (
          <Text variant={isCurrentDay ? 'h6' : 'body2'}>{t($ => $.places.hours.allDay)}</Text>
        )}
        {(openingHours.closedAllDay as boolean) && (
          <Text variant={isCurrentDay ? 'h6' : 'body2'}>{t($ => $.places.hours.closed)}</Text>
        )}
        {!(openingHours.openAllDay as boolean) &&
          !(openingHours.closedAllDay as boolean) &&
          openingHours.timeSlots.length > 0 && (
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
          <View>
            <TouchableRipple borderless role='button' hitSlop={8} onPress={() => setOverlayOpen(true)}>
              <Icon size={18} source='alert-circle-outline' label={t($ => $.places.hours.appointment.required)} />
            </TouchableRipple>

            <AppointmentOnlyOverlay
              isVisible={overlayOpen}
              closeOverlay={() => setOverlayOpen(false)}
              appointmentUrl={appointmentUrl}
            />
          </View>
        )}
      </View>
    </EntryContainer>
  )
}

export default OpeningEntry
