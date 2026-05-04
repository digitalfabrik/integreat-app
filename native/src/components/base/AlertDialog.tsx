import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { Button, Dialog, Portal, useTheme } from 'react-native-paper'

const styles = StyleSheet.create({
  titleWrapper: {
    marginTop: 22,
    marginBottom: 18,
    marginHorizontal: 24,
  },
})

type AlertDialogProps = {
  visible: boolean
  close: () => void
  title: string | ReactElement
  children: ReactElement
}

const AlertDialog = ({ visible, close, title, children }: AlertDialogProps): ReactElement => {
  const { t } = useTranslation('common')
  const theme = useTheme()

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={close} style={{ backgroundColor: theme.colors.surfaceVariant }}>
        <View style={styles.titleWrapper}>{title}</View>
        <Dialog.Content>{children}</Dialog.Content>
        <Dialog.Actions>
          <Button onPress={close}>{t('close')}</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}

export default AlertDialog
