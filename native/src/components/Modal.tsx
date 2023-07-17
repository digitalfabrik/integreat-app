import React, { ReactElement, ReactNode } from 'react'
import { Modal as RNModal } from 'react-native'
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

const Content = styled.ScrollView`
  padding: 0 20px;
`

type ModalProps = {
  modalVisible: boolean
  closeModal: () => void
  headerTitle: string
  title: string
  children: ReactNode
}

const Modal = ({ modalVisible, closeModal, headerTitle, title, children }: ModalProps): ReactElement => (
  <RNModal
    visible={modalVisible}
    onRequestClose={closeModal}
    animationType='fade'
    supportedOrientations={['portrait', 'landscape']}>
    <Container>
      <Header>
        <HeaderBox goBack={closeModal} text={headerTitle} />
      </Header>
      <Content contentContainerStyle={{ flex: 1 }}>
        <Caption title={title} />
        {children}
      </Content>
    </Container>
  </RNModal>
)

export default Modal
