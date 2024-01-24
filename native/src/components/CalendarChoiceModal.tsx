import React, { Fragment, ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, View } from 'react-native'
import { Calendar } from 'react-native-calendar-events'
import styled from 'styled-components/native'

import Modal from './Modal'
import RadioButton from './base/RadioButton'
import TextButton from './base/TextButton'

const Heading = styled.Text`
  font-family: ${props => props.theme.fonts.native.decorativeFontBold};
  font-size: 16px;
  margin: 16px 0;
`

// styled-components doesn't have the right types for FlatList
const StyledList = styled(FlatList as typeof FlatList<Calendar>)`
  flex-grow: 0;
`

const ButtonTitle = styled.Text`
  font-family: ${props => props.theme.fonts.native.decorativeFontBold};
`

const ButtonDescription = styled.Text`
  font-family: ${props => props.theme.fonts.native.contentFontRegular};
  color: ${props => props.theme.colors.textSecondaryColor};
`

const Divider = styled.View`
  background-color: ${props => props.theme.colors.textDecorationColor};
  height: 1px;
  margin: 8px 0;
`

const StyledText = styled.Text`
  font-family: ${props => props.theme.fonts.native.decorativeFontRegular};
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
      <StyledList
        data={calendars}
        renderItem={({ item, index }) => (
          <>
            <RadioButton selected={selectedCalendarId === item.id} select={() => setSelectedCalendarId(item.id)}>
              <View>
                <ButtonTitle>{item.title}</ButtonTitle>
                <ButtonDescription>{item.source}</ButtonDescription>
              </View>
            </RadioButton>
            {index < calendarCount - 1 && <Divider />}
          </>
        )}
      />
      {recurring && (
        <>
          <Heading>{t('addToCalendar')}</Heading>
          <RadioButton selected={!exportAllEvents} select={() => setExportAllEvents(false)}>
            <StyledText>{t('onlyThisEvent')}</StyledText>
          </RadioButton>
          <RadioButton selected={exportAllEvents} select={() => setExportAllEvents(true)}>
            <StyledText>{t('thisAndAllFutureEvents')}</StyledText>
          </RadioButton>
        </>
      )}
      <TextButton onPress={() => chooseCalendar(selectedCalendarId, exportAllEvents)} text={t('addToCalendar')} />
    </Modal>
  )
}

export default CalendarChoiceModal
