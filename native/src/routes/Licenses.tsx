import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, View } from 'react-native'
import styled from 'styled-components/native'

import { License, parseLicenses, JsonLicenses } from 'api-client/src/utils/licences'

import Caption from '../components/Caption'
import Layout from '../components/Layout'
import Touchable from '../components/Touchable'
import useSnackbar from '../hooks/useSnackbar'
import openExternalUrl from '../utils/openExternalUrl'
import { reportError } from '../utils/sentry'

const PadView = styled.View`
  padding: 16px;
  flex-direction: row;
  align-items: center;
  background-color: ${props => props.theme.colors.backgroundColor};
  padding-vertical: 8px;
`

const Name = styled.Text`
  color: ${props => props.theme.colors.textColor};
  'font-size: 18px;'
`
const Description = styled.Text`
  color: ${props => props.theme.colors.textSecondaryColor};
  padding-left: 8px;
`

type PropType = {
  name: string
  version: string
  license: string
  onPress: () => void
}

const LicenseItem = (props: PropType): ReactElement => {
  const { name, version, license, onPress } = props
  return (
    <Touchable onPress={onPress}>
      <PadView>
        <View>
          <Name>{name}</Name>
          <Description>{`version: ${version}`}</Description>
          <Description>{`license: ${license}`}</Description>
        </View>
      </PadView>
    </Touchable>
  )
}

const Licenses = (): ReactElement => {
  const [licenses, setLicenses] = useState<License[] | null>(null)
  const showSnackbar = useSnackbar()

  useEffect(() => {
    import('../../../../assets/licenses_native.json')
      // cast is necessary because typescript will throw an error otherwise
      .then(licenseFile => setLicenses(parseLicenses(licenseFile.default as unknown as JsonLicenses)))
      .catch(error => reportError(`error while importing licenses ${error}`))
  }, [])

  const { t } = useTranslation('settings')
  const renderItem = ({ item }: { item: License }) => {
    const openLink = () => openExternalUrl(item.licenseUrl).catch(() => showSnackbar('something went wrong'))
    return <LicenseItem name={item.name} version={item.version ?? ''} license={item.licenses} onPress={openLink} />
  }

  return (
    <Layout>
      <Caption title={t('openSourceLicenses')} />
      <FlatList data={licenses} renderItem={renderItem} keyExtractor={item => item.name} />
    </Layout>
  )
}

export default Licenses
