import { ThemeProvider as NavigationThemeProvider } from '@react-navigation/native'
import React, { ReactElement, ReactNode } from 'react'
import { ScrollView, StyleSheet, View, Modal as RNModal } from 'react-native'
import { Surface } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled, { useTheme } from 'styled-components/native'

import dimensions from '../constants/dimensions'
import { useNavigationTheme } from '../hooks/useNavigationTheme'
import Caption from './Caption'
import { HeaderBackButton } from './HeaderBox'

const styles = StyleSheet.create({
  scrollContent: {
    marginHorizontal: 20,
  },
  content: {
    paddingHorizontal: 20,
    flex: 1,
  },
  modalStyle: {
    width: '100%',
    height: '100%',
  },
})

const HeaderContainer = styled(Surface).attrs({ elevation: 1 })`
  background-color: ${props => props.theme.colors.surfaceVariant};
  height: ${dimensions.headerHeight}px;
`

type ModalProps = {
  modalVisible: boolean
  closeModal: () => void
  title?: string
  children: ReactNode
  scrollView?: boolean
}

const Modal = ({ modalVisible, closeModal, title, children, scrollView = true }: ModalProps): ReactElement => {
  const theme = useTheme()
  const navigationTheme = useNavigationTheme()
  const insets = useSafeAreaInsets()

  return (
    <RNModal visible={modalVisible} transparent onRequestClose={closeModal} style={styles.modalStyle}>
      <View style={{ flex: 1, paddingTop: insets.top }}>
        <NavigationThemeProvider value={navigationTheme}>
          {/* Clip the header shadow at the top, the screen container does the same for regular headers */}
          <View style={{ flex: 1, backgroundColor: theme.colors.background, overflow: 'hidden' }}>
            <HeaderContainer>
              <HeaderBackButton goBack={closeModal} />
            </HeaderContainer>
            {scrollView ? (
              <ScrollView style={styles.scrollContent} contentContainerStyle={{ flexGrow: 1 }}>
                {!!title && <Caption title={title} />}
                {children}
              </ScrollView>
            ) : (
              <View style={styles.content}>
                {!!title && <Caption title={title} />}
                {children}
              </View>
            )}
          </View>
        </NavigationThemeProvider>
      </View>
    </RNModal>
  )
}

export default Modal
