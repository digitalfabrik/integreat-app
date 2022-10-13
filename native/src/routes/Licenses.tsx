import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, View } from 'react-native'
import styled from 'styled-components/native'

import { License, parseLicenses } from 'api-client'

import Caption from '../components/Caption'
import Layout from '../components/Layout'
import useSnackbar from '../hooks/useSnackbar'
import openExternalUrl from '../utils/openExternalUrl'
import { reportError } from '../utils/sentry'

const StyledPressable = styled.Pressable`
  padding: 16px;
  flex-direction: row;
  align-items: center;
  background-color: ${props => props.theme.colors.backgroundColor};
  padding-vertical: 8px;
`

const Name = styled.Text`
  color: ${props => props.theme.colors.textColor};
  font-size: 18px;
`
const Description = styled.Text`
  color: ${props => props.theme.colors.textSecondaryColor};
  padding-left: 8px;
`

type LicenseItemProps = {
  name: string
  version: string
  license: string
  onPress: () => void
}

const LicenseItem = (props: LicenseItemProps): ReactElement => {
  const { name, version, license, onPress } = props
  const { t } = useTranslation('licenses')
  return (
    <StyledPressable onPress={onPress}>
      <View>
        <Name>{name}</Name>
        <Description>
          {t('version')} {version}
        </Description>
        <Description>
          {t('license')} {license}
        </Description>
      </View>
    </StyledPressable>
  )
}

const Licenses = (): ReactElement => {
  const [licenses, setLicenses] = useState<License[] | null>(null)
  const showSnackbar = useSnackbar()

  useEffect(() => {
    import('../assets/licenses.json')
      // @ts-expect-error JSON is guaranteed to be of type JsonLicenses
      .then(licenseFile => setLicenses(parseLicenses(licenseFile.default)))
      .catch(error => reportError(`error while importing licenses ${error}`))
  }, [])

  const { t } = useTranslation('settings')
  const renderItem = ({ item }: { item: License }) => {
    const { licenses, name, licenseUrl, version } = item
    const openLink = () => openExternalUrl(licenseUrl).catch(() => showSnackbar(t('error:unknownError')))
    return <LicenseItem key={name} name={name} version={version ?? ''} license={licenses} onPress={openLink} />
  }

  return (
    <Layout>
      <Caption title={t('openSourceLicenses')} />
      <FlatList data={licenses} renderItem={renderItem} />
    </Layout>
  )
}

export default Licenses
