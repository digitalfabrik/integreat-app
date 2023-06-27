import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal, TouchableOpacity } from 'react-native'
import { Calendar } from 'react-native-calendar-events'
import styled from 'styled-components/native'

import dimensions from '../constants/dimensions'
import HeaderBox from './HeaderBox'

const Container = styled.SafeAreaView`
  flex: 1;
`

const Header = styled.View`
  height: ${dimensions.headerHeight}px;
`

const ButtonContainer = styled.ScrollView`
  margin: 0 20px;
  padding: 50px 0;
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
      <Container>
        <Header>
          <HeaderBox goBack={closeOverlay} text={t('chooseCalendar')} textCentered />
        </Header>
        <ButtonContainer
          contentContainerStyle={{
            flex: 1,
            justifyContent: 'center',
          }}>
          {calendars.map(cal => (
            <CalendarButton key={cal.id} onPress={() => chooseCalendar(cal.id)} color={cal.color}>
              <ButtonText>{cal.title}</ButtonText>
            </CalendarButton>
          ))}
        </ButtonContainer>
      </Container>
    </Modal>
  )
}

export default CalendarChoice
