import { ThemeProvider as NavigationThemeProvider } from '@react-navigation/native'
import React, { ReactElement, ReactNode } from 'react'
import { ScrollView, StyleSheet, View, Modal as RNModal, Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from 'styled-components/native'

import dimensions from '../constants/dimensions'
import { useNavigationTheme } from '../hooks/useNavigationTheme'
import Caption from './Caption'
import HeaderBox from './HeaderBox'

const styles = StyleSheet.create({
  header: {
    height: dimensions.headerHeight,
  },
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
  const theme = useTheme()
  const navigationTheme = useNavigationTheme()
  const insets = useSafeAreaInsets()

  return (
    <RNModal visible={modalVisible} transparent onRequestClose={closeModal} style={styles.modalStyle}>
      <View style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? insets.top : 0 }}>
        <NavigationThemeProvider value={navigationTheme}>
          <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <View style={styles.header}>
              <HeaderBox goBack={closeModal} text={headerTitle} />
            </View>
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
