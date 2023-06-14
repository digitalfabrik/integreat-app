import { HeaderBackButton } from '@react-navigation/elements'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal, TouchableOpacity } from 'react-native'
import { Calendar } from 'react-native-calendar-events'
import styled from 'styled-components/native'

const StyledView = styled.View`
  flex: 1;
  justify-content: center;
  margin: 0 20px;
  padding: 50px 0;
`

const TitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 5px;
`

const Title = styled.Text`
  font-family: ${props => props.theme.fonts.native.decorativeFontBold};
  text-align: center;
  flex: 1;
  padding-right: 16px;
`

const CalendarButton = styled(TouchableOpacity)<{ color: string }>`
  flex: 0.1;
  background-color: ${props => props.color};
  justify-content: center;
  align-items: center;
  margin: 5px 0;
`

const ButtonText = styled.Text`
  font-family: ${props => props.theme.fonts.native.decorativeFontRegular};
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
        <TitleContainer>
          <HeaderBackButton onPress={closeOverlay} label={t('back')} />
          <Title>{t('chooseCalendar')}</Title>
        </TitleContainer>
        {calendars.map(cal => (
          <CalendarButton key={cal.id} onPress={() => chooseCalendar(cal.id)} color={cal.color}>
            <ButtonText>{cal.title}</ButtonText>
          </CalendarButton>
        ))}
      </StyledView>
    </Modal>
  )
}

export default CalendarChoice
