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

// Lists implement their own scrolling and shouldn't be nested in a ScrollView
const ContentForList = styled.View`
  padding: 0 20px;
  flex: 1;
`

type ModalProps = {
  modalVisible: boolean
  closeModal: () => void
  headerTitle: string
  title?: string
  children: ReactNode
  containsList?: boolean
}

const Modal = ({
  modalVisible,
  closeModal,
  headerTitle,
  title,
  children,
  containsList = false,
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
      {containsList ? (
        <ContentForList>
          {!!title && <Caption title={title} />}
          {children}
        </ContentForList>
      ) : (
        <Content contentContainerStyle={{ flex: 1 }}>
          {!!title && <Caption title={title} />}
          {children}
        </Content>
      )}
    </Container>
  </RNModal>
)

export default Modal
