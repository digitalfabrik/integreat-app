import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { TouchableRipple } from 'react-native-paper'
import styled from 'styled-components/native'

import { OpeningHoursModel } from 'shared/api'

import { isRTLText } from '../constants/contentDirection'
import AppointmentOnlyOverlay from './AppointmentOnlyOverlay'
import Icon from './base/Icon'
import Text from './base/Text'

const MARGIN_TOP = 8

const EntryContainer = styled.View<{ weekday: string }>`
  display: flex;
  flex-direction: ${props => (isRTLText(props.weekday) ? 'row-reverse' : 'row')};
  justify-content: space-between;
  padding: 4px 16px;
`

const Timeslot = styled.View`
  display: flex;
  flex-direction: column;
`

const AppointmentOnlyContainer = styled.View<{ weekday: string }>`
  top: 6px;
  padding: 0 4px;
  ${props => (isRTLText(props.weekday) ? 'right: -3px' : 'right: 3px;')};
`

type OpeningEntryProps = {
  openingHours: OpeningHoursModel
  weekday: string
  isCurrentDay: boolean
  appointmentUrl: string | null
}

const OpeningEntry = ({ openingHours, weekday, isCurrentDay, appointmentUrl }: OpeningEntryProps): ReactElement => {
  const { t } = useTranslation('pois')

  const [overlayOpen, setOverlayOpen] = useState<boolean>(false)

  return (
    <EntryContainer weekday={weekday}>
      <Text variant={isCurrentDay ? 'h6' : 'body2'}>{weekday}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {(openingHours.openAllDay as boolean) && <Text variant={isCurrentDay ? 'h6' : 'body2'}>{t('allDay')}</Text>}
        {(openingHours.closedAllDay as boolean) && <Text variant={isCurrentDay ? 'h6' : 'body2'}>{t('closed')}</Text>}
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
          <AppointmentOnlyContainer weekday={weekday}>
            <TouchableRipple borderless role='button' onPress={() => setOverlayOpen(true)}>
              <Icon
                style={{ height: 24, width: 24 }}
                size={18}
                source='alert-circle-outline'
                label={t('appointmentNecessary')}
              />
            </TouchableRipple>

            <AppointmentOnlyOverlay
              isVisible={overlayOpen}
              closeOverlay={() => setOverlayOpen(false)}
              appointmentUrl={appointmentUrl}
            />
          </AppointmentOnlyContainer>
        )}
      </View>
    </EntryContainer>
  )
}

export default OpeningEntry
