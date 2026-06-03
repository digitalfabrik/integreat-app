import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { Button, useTheme } from 'react-native-paper'
import { SvgXml } from 'react-native-svg'
import { DefaultTheme } from 'styled-components/native'

import { encodeQR, QR_CODE_SIZE } from 'shared'

import Modal from './Modal'
import Text from './base/Text'

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    gap: 16,
    paddingVertical: 16,
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
  const theme = useTheme() as DefaultTheme
  const svgXml = encodeQR(url, 'svg')

  return (
    <Modal modalVisible={modalVisible} closeModal={closeModal} headerTitle={title} scrollView={false}>
      <View style={styles.content}>
        <Text>{description}</Text>
        <SvgXml xml={svgXml} width={QR_CODE_SIZE} height={QR_CODE_SIZE} fill={theme.colors.onSurface} />
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
