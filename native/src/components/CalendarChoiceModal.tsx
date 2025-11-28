import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList } from 'react-native'
import { Calendar } from 'react-native-calendar-events'
import { Divider, RadioButton } from 'react-native-paper'
import styled from 'styled-components/native'

import Modal from './Modal'
import TextButton from './base/TextButton'

const Heading = styled.Text`
  font-family: ${props => props.theme.legacy.fonts.native.decorativeFontBold};
  font-size: 16px;
  margin: 16px 0;
  color: ${props => props.theme.legacy.colors.textColor};
`

// styled-components doesn't have the right types for FlatList
const StyledList = styled(FlatList as typeof FlatList<Calendar>)`
  flex-grow: 0;
`

type CalendarChoiceProps = {
  calendars: Calendar[]
  chooseCalendar: (id: string | undefined, recurring: boolean) => Promise<void>
  modalVisible: boolean
  closeModal: () => void
  eventTitle: string
  recurring: boolean
}

const CalendarChoiceModal = ({
  calendars,
  chooseCalendar,
  modalVisible,
  closeModal,
  eventTitle,
  recurring,
}: CalendarChoiceProps): ReactElement => {
  const { t } = useTranslation('events')
  const [selectedCalendarId, setSelectedCalendarId] = useState<string | undefined>(calendars[0]?.id ?? undefined)
  const [exportAllEvents, setExportAllEvents] = useState<boolean>(false)
  const calendarCount = calendars.length

  return (
    <Modal modalVisible={modalVisible} closeModal={closeModal} headerTitle={eventTitle} scrollView={false}>
      <Heading>{t('chooseCalendar')}</Heading>
      <RadioButton.Group onValueChange={setSelectedCalendarId} value={selectedCalendarId ?? ''}>
        <StyledList
          role='list'
          data={calendars}
          renderItem={({ item, index }) => (
            <>
              <RadioButton.Item label={`${item.title} - ${item.source}`} value={item.id} mode='android' />
              {index < calendarCount - 1 && <Divider />}
            </>
          )}
        />
      </RadioButton.Group>
      {recurring && (
        <>
          <Heading>{t('addToCalendar')}</Heading>
          <RadioButton.Group
            onValueChange={value => setExportAllEvents(value === 'true')}
            value={exportAllEvents.toString()}>
            <RadioButton.Item mode='android' label={t('onlyThisEvent')} value='false' />
            <RadioButton.Item mode='android' label={t('thisAndAllFutureEvents')} value='true' />
          </RadioButton.Group>
        </>
      )}
      <TextButton onPress={() => chooseCalendar(selectedCalendarId, exportAllEvents)} text={t('addToCalendar')} />
    </Modal>
  )
}

export default CalendarChoiceModal
