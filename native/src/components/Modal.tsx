import { ThemeProvider as NavigationThemeProvider } from '@react-navigation/native'
import React, { ReactElement, ReactNode } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Modal as PaperModal, Portal } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
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

  return (
    <Portal>
      <NavigationThemeProvider value={navigationTheme}>
        <PaperModal
          visible={modalVisible}
          onDismiss={closeModal}
          contentContainerStyle={{ flex: 1 }}
          style={{ margin: 0 }}>
          <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
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
          </SafeAreaView>
        </PaperModal>
      </NavigationThemeProvider>
    </Portal>
  )
}

export default Modal
