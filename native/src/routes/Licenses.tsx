import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, View } from 'react-native'
import styled from 'styled-components/native'

import { License, parseLicenses } from 'shared'

import Caption from '../components/Caption'
import Layout from '../components/Layout'
import Pressable from '../components/base/Pressable'
import useSnackbar from '../hooks/useSnackbar'
import openExternalUrl from '../utils/openExternalUrl'
import { reportError } from '../utils/sentry'

const LicenseItemContainer = styled(Pressable)`
  padding: 16px;
  flex-direction: row;
  align-items: center;
  background-color: ${props => props.theme.legacy.colors.backgroundColor};
`

const Name = styled.Text`
  color: ${props => props.theme.legacy.colors.textColor};
  font-size: 18px;
`
const Description = styled.Text`
  color: ${props => props.theme.legacy.colors.textSecondaryColor};
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
    <LicenseItemContainer onPress={onPress} role='link'>
      <View>
        <Name>{name}</Name>
        <Description>
          {t('version')} {version}
        </Description>
        <Description>
          {t('license')} {license}
        </Description>
      </View>
    </LicenseItemContainer>
  )
}

const Licenses = (): ReactElement => {
  const [licenses, setLicenses] = useState<License[] | null>(null)
  const showSnackbar = useSnackbar()

  useEffect(() => {
    import('../assets/licenses.json')
      .then(licenseFile => setLicenses(parseLicenses(licenseFile.default)))
      .catch(error => reportError(`error while importing licenses ${error}`))
  }, [])

  const { t } = useTranslation('settings')
  const renderItem = ({ item }: { item: License }) => {
    const { licenses, name, licenseUrl, version } = item
    const openLink = () => openExternalUrl(licenseUrl, showSnackbar)
    return <LicenseItem key={name} name={name} version={version ?? ''} license={licenses} onPress={openLink} />
  }

  return (
    <Layout>
      <FlatList
        data={licenses}
        renderItem={renderItem}
        ListHeaderComponent={<Caption title={t('openSourceLicenses')} />}
      />
    </Layout>
  )
}

export default Licenses
