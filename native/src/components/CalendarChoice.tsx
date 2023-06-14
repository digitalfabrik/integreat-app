import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal, TouchableOpacity } from 'react-native'
import { Calendar } from 'react-native-calendar-events'
import styled from 'styled-components/native'

const StyledView = styled.View`
  flex: 1;
  justify-content: center;
`

const Title = styled.Text`
  font-family: ${props => props.theme.fonts.native.decorativeFontBold};
  text-align: center;
  padding-top: 70px;
  padding-bottom: 20px;
`

const CalendarButton = styled(TouchableOpacity)<{ color: string }>`
  flex: 0.1;
  background-color: ${props => props.color};
  justify-content: center;
  align-items: center;
  margin: 5px 20px;
`

const ButtonText = styled.Text`
  font-family: ${props => props.theme.fonts.native.decorativeFontRegular};
`

const CloseButton = styled(TouchableOpacity)`
  flex: 0.05;
  justify-content: center;
  align-items: center;
  margin: 5px 20px;
  padding-bottom: 20px;
`

type CalendarChoiceProps = {
  calendars: Calendar[]
  chooseCalendar: (id: string) => void
  overlayVisible: boolean
  closeOverlay: () => void
}

const CalendarChoice = ({
  calendars,
  chooseCalendar,
  overlayVisible,
  closeOverlay,
}: CalendarChoiceProps): ReactElement => {
  const { t } = useTranslation('events')
  return (
    <Modal visible={overlayVisible} onRequestClose={closeOverlay} animationType='fade'>
      <StyledView>
        <Title>{t('chooseCalendar')}</Title>
        {calendars.map(cal => (
          <CalendarButton key={cal.id} onPress={() => chooseCalendar(cal.id)} color={cal.color}>
            <ButtonText>{cal.title}</ButtonText>
          </CalendarButton>
        ))}
        <CloseButton onPress={closeOverlay}>
          <ButtonText>{t('close')}</ButtonText>
        </CloseButton>
      </StyledView>
    </Modal>
  )
}

export default CalendarChoice
