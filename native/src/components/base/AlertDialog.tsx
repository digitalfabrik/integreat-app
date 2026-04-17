import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Dialog, Portal, useTheme } from 'react-native-paper'

import { TypographyVariant } from 'build-configs/TypographyType'

import Text from './Text'

type AlertDialogProps = {
  visible: boolean
  onDismiss: () => void
  title: string
  children: ReactElement
  titleTextVariant?: TypographyVariant
}

const AlertDialog = ({ visible, onDismiss, title, children, titleTextVariant }: AlertDialogProps): ReactElement => {
  const { t } = useTranslation('common')
  const theme = useTheme()

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={{ backgroundColor: theme.colors.surfaceVariant }}>
        <Text variant={titleTextVariant} style={{ marginTop: 22, marginBottom: 18, marginHorizontal: 24 }}>
          {title}
        </Text>
        <Dialog.Content>{children}</Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>{t('close')}</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}

export default AlertDialog
