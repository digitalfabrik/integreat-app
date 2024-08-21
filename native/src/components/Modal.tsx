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

const ScrollContent = styled.ScrollView`
  padding: 0 20px;
`

const Content = styled.View`
  padding: 0 20px;
  flex: 1;
`

type ModalProps = {
  modalVisible: boolean
  closeModal: () => void
  headerTitle: string
  title?: string
  children: ReactNode
  scrollView?: boolean
}

const Modal = ({
  modalVisible,
  closeModal,
  headerTitle,
  title,
  children,
  scrollView = true,
}: ModalProps): ReactElement => (
  <RNModal
    visible={modalVisible}
    onRequestClose={closeModal}
    animationType='fade'
    supportedOrientations={['portrait', 'landscape']}>
    <Container>
      <Header>
        <HeaderBox goBack={closeModal} text={headerTitle} />
      </Header>
      {scrollView ? (
        <ScrollContent contentContainerStyle={{ flexGrow: 1 }}>
          {!!title && <Caption title={title} />}
          {children}
        </ScrollContent>
      ) : (
        <Content>
          {!!title && <Caption title={title} />}
          {children}
        </Content>
      )}
    </Container>
  </RNModal>
)

export default Modal
