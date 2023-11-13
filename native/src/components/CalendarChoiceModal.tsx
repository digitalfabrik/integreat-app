import React, { Fragment, ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, View } from 'react-native'
import { Calendar } from 'react-native-calendar-events'
import styled from 'styled-components/native'

import Modal from './Modal'
import Pressable from './base/Pressable'
import RadioButton from './base/RadioButton'

const Heading = styled.Text`
  font-family: ${props => props.theme.fonts.native.decorativeFontBold};
  font-size: 16px;
  margin: 16px 0;
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

const SubmitButton = styled(Pressable)`
  height: 40px;
  background-color: ${props => props.theme.colors.themeColor};
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  margin: 16px;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.2;
  shadow-radius: 1.41px;
`

const SubmitButtonText = styled.Text`
  font-family: ${props => props.theme.fonts.native.decorativeFontBold};
`

type CalendarChoiceProps = {
  calendars: Calendar[]
  chooseCalendar: (id: string, recurring: boolean) => Promise<void>
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
  const [selectedCalendar, selectCalendar] = useState(calendars[0]?.id ?? '')
  const [exportAllEvents, setExportAllEvents] = useState<boolean>(false)
  return (
    <Modal modalVisible={modalVisible} closeModal={closeModal} headerTitle={eventTitle}>
      <ScrollView>
        <Heading>{t('chooseCalendar')}:</Heading>
        {calendars.map((cal, i) => (
          <Fragment key={cal.id}>
            <RadioButton
              selected={selectedCalendar === cal.id}
              select={() => selectCalendar(cal.id)}
              text={
                <View>
                  <ButtonTitle>{cal.title}</ButtonTitle>
                  <ButtonDescription>{cal.source}</ButtonDescription>
                </View>
              }
            />
            {i < calendars.length - 1 && <Divider />}
          </Fragment>
        ))}
        {recurring && (
          <>
            <Heading>{t('addToCalendar')}:</Heading>
            <RadioButton
              selected={!exportAllEvents}
              select={() => setExportAllEvents(false)}
              text={<StyledText>{t('onlyThisEvent')}</StyledText>}
            />
            <RadioButton
              selected={exportAllEvents}
              select={() => setExportAllEvents(true)}
              text={<StyledText>{t('thisAndAllFutureEvents')}</StyledText>}
            />
          </>
        )}
        <SubmitButton onPress={() => chooseCalendar(selectedCalendar, exportAllEvents)}>
          <SubmitButtonText>{t('addToCalendar')}</SubmitButtonText>
        </SubmitButton>
      </ScrollView>
    </Modal>
  )
}

export default CalendarChoiceModal
