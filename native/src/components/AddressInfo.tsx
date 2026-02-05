import Clipboard from '@react-native-clipboard/clipboard'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform } from 'react-native'
import { TouchableRipple } from 'react-native-paper'
import styled, { useTheme } from 'styled-components/native'

import { getExternalMapsLink } from 'shared'
import { LocationModel } from 'shared/api'

import { contentDirection } from '../constants/contentDirection'
import useSnackbar from '../hooks/useSnackbar'
import openExternalUrl from '../utils/openExternalUrl'
import { reportError } from '../utils/sentry'
import Icon from './base/Icon'
import Text from './base/Text'

const Container = styled.View<{ language: string }>`
  justify-content: space-between;
  flex-direction: ${props => contentDirection(props.language)};
`

type AddressInfoProps = {
  location: LocationModel<number>
  language: string
}

const AddressInfo = ({ location, language }: AddressInfoProps): ReactElement => {
  const { address, postcode, town } = location
  const showSnackbar = useSnackbar()
  const theme = useTheme()
  const { t } = useTranslation('pois')

  const copyLocationToClipboard = (): void => {
    Clipboard.setString(`${address}, ${postcode} ${town}`)
    showSnackbar({ text: t('addressCopied') })
  }

  const openExternalMaps = () => {
    const externalMapsUrl = getExternalMapsLink(location, Platform.OS)
    openExternalUrl(externalMapsUrl, showSnackbar).catch(reportError)
  }

  return (
    <Container language={language}>
      <TouchableRipple borderless accessibilityLabel={t('copyAddress')} role='button' onPress={copyLocationToClipboard}>
        <>
          <Text>{address}</Text>
          <Text>
            {postcode} {town}
          </Text>
        </>
      </TouchableRipple>
      <TouchableRipple
        borderless
        style={{ alignSelf: 'center', paddingVertical: 0, paddingHorizontal: 8 }}
        role='link'
        onPress={openExternalMaps}
        accessibilityLabel={t('openExternalMaps')}>
        <Icon color={theme.colors.primary} source='open-in-new' />
      </TouchableRipple>
    </Container>
  )
}

export default AddressInfo
