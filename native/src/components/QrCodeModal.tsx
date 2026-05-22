import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { Button } from 'react-native-paper'
import QRCode from 'react-qr-code'

import { QR_CODE_SIZE } from 'shared'

import Modal from './Modal'
import Text from './base/Text'

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    gap: 16,
    paddingVertical: 16,
  },
  qrWrapper: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#FFF',
  },
  text: {
    textAlign: 'center',
  },
  button: {
    marginTop: 16,
    alignSelf: 'center',
  },
})

type QrCodeModalProps = {
  modalVisible: boolean
  closeModal: () => void
  title: string
  description: string
  url: string
  qrDetails: string
}

const QrCodeModal = ({
  modalVisible,
  closeModal,
  title,
  description,
  url,
  qrDetails,
}: QrCodeModalProps): ReactElement => {
  const { t } = useTranslation('layout')

  return (
    <Modal modalVisible={modalVisible} closeModal={closeModal} headerTitle={title} scrollView={false}>
      <View style={styles.content}>
        <Text>{description}</Text>
        <View style={styles.qrWrapper}>
          <QRCode value={url} size={QR_CODE_SIZE} level='H' />
        </View>
        <Text selectable style={styles.text}>
          {qrDetails}
        </Text>
      </View>
      <Button mode='outlined' onPress={closeModal} style={styles.button}>
        {t('common:close')}
      </Button>
    </Modal>
  )
}

export default QrCodeModal
