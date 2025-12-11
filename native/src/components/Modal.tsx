import React, { ReactElement, ReactNode } from 'react'
import { Platform, Modal as RNModal, View } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import styled from 'styled-components/native'

import dimensions from '../constants/dimensions'
import Caption from './Caption'
import HeaderBox from './HeaderBox'

const Container = styled(SafeAreaView)<{ paddingTop: number }>`
  flex: 1;
  background-color: ${props => props.theme.legacy.colors.backgroundColor};
  padding-top: ${props => props.paddingTop}px;
`

const Header = styled.View`
  height: ${dimensions.headerHeight}px;
`

const ScrollContent = styled.ScrollView`
  margin: 0 20px;
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
}: ModalProps): ReactElement => {
  const insets = useSafeAreaInsets()
  return (
    // View needs to stay until https://github.com/digitalfabrik/integreat-app/issues/3331 is done
    <View>
      <RNModal
        visible={modalVisible}
        onRequestClose={closeModal}
        animationType='fade'
        supportedOrientations={['portrait', 'landscape']}>
        <Container paddingTop={Platform.OS === 'ios' ? insets.top : 0} edges={['right', 'bottom', 'left']}>
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
    </View>
  )
}

export default Modal
