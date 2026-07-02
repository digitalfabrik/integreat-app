import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Dialog, Portal, useTheme } from 'react-native-paper'

type AlertDialogProps = {
  visible: boolean
  close: () => void
  title: string | ReactElement
  children: ReactElement
  actions: ReactElement[]
}

const AlertDialog = ({ visible, close, title, children, actions }: AlertDialogProps): ReactElement => {
  const theme = useTheme()

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={close} style={{ backgroundColor: theme.colors.surfaceVariant }}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>{children}</Dialog.Content>
        <Dialog.Actions>{actions}</Dialog.Actions>
      </Dialog>
    </Portal>
  )
}

type SimpleAlertDialogProps = {
  visible: boolean
  close: () => void
  title: string | ReactElement
  children: ReactElement
}

export const SimpleAlertDialog = ({ visible, close, title, children }: SimpleAlertDialogProps): ReactElement => {
  const { t } = useTranslation('common')

  return (
    <AlertDialog
      visible={visible}
      close={close}
      title={title}
      actions={[
        <Button key='close' onPress={close}>
          {t('close')}
        </Button>,
      ]}>
      {children}
    </AlertDialog>
  )
}

export default AlertDialog
