import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal, TouchableOpacity } from 'react-native'
import { Calendar } from 'react-native-calendar-events'
import styled from 'styled-components/native'

import dimensions from '../constants/dimensions'
import Caption from './Caption'
import HeaderBox from './HeaderBox'

const Container = styled.SafeAreaView`
  flex: 1;
`

const Header = styled.View`
  height: ${dimensions.headerHeight}px;
`

const Content = styled.ScrollView.attrs(() => ({
  contentContainerStyle: {
    flex: 1,
  },
}))`
  margin: 0 20px;
  padding: 50px 0;
`

const CalendarButton = styled(TouchableOpacity)<{ color: string }>`
  background-color: ${props => props.color};
  justify-content: center;
  align-items: center;
  margin: 5px 0;
  height: ${dimensions.headerHeight}px;
`

const ButtonText = styled.Text`
  font-family: ${props => props.theme.fonts.native.decorativeFontRegular};
`

type CalendarChoiceProps = {
  calendars: Calendar[]
  chooseCalendar: (id: string) => Promise<void>
  modalVisible: boolean
  closeModal: () => void
  eventTitle: string
}

const CalendarChoiceModal = ({
  calendars,
  chooseCalendar,
  modalVisible,
  closeModal,
  eventTitle,
}: CalendarChoiceProps): ReactElement => {
  const { t } = useTranslation('events')
  return (
    <Modal
      visible={modalVisible}
      onRequestClose={closeModal}
      animationType='fade'
      supportedOrientations={['portrait', 'landscape']}>
      <Container>
        <Header>
          <HeaderBox goBack={closeModal} text={eventTitle} />
        </Header>
        <Content>
          <Caption title={t('chooseCalendar')} />
          {calendars.map(cal => (
            <CalendarButton key={cal.id} onPress={() => chooseCalendar(cal.id)} color={cal.color}>
              <ButtonText>{cal.title}</ButtonText>
            </CalendarButton>
          ))}
        </Content>
      </Container>
    </Modal>
  )
}

export default CalendarChoiceModal
