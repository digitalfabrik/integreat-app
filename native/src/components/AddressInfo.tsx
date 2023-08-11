import Clipboard from '@react-native-clipboard/clipboard'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { getExternalMapsLink, LocationModel } from 'api-client'

import ExternalLinkIcon from '../assets/ExternalLink.svg'
import { contentDirection } from '../constants/contentDirection'
import useSnackbar from '../hooks/useSnackbar'
import openExternalUrl from '../utils/openExternalUrl'
import { reportError } from '../utils/sentry'
import Pressable from './base/Pressable'
import Text from './base/Text'

const Container = styled.View<{ language: string }>`
  justify-content: space-between;
  flex-direction: ${props => contentDirection(props.language)};
`

const IconContainer = styled(Pressable)`
  align-self: center;
  padding: 0 8px;
`

type AddressInfoProps = {
  location: LocationModel<number>
  language: string
}

const AddressInfo = ({ location, language }: AddressInfoProps): ReactElement => {
  const { address, postcode, town } = location
  const showSnackbar = useSnackbar()
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
      <Pressable onPress={copyLocationToClipboard}>
        <Text>{address}</Text>
        <Text>
          {postcode} {town}
        </Text>
      </Pressable>
      <IconContainer onPress={openExternalMaps}>
        <ExternalLinkIcon accessibilityLabel={t('openExternalMaps')} />
      </IconContainer>
    </Container>
  )
}

export default AddressInfo
