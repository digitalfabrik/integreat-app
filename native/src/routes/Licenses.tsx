import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, StyleSheet, View } from 'react-native'
import { TouchableRipple, useTheme } from 'react-native-paper'

import { License, parseLicenses } from 'shared'

import Caption from '../components/Caption'
import Layout from '../components/Layout'
import Text from '../components/base/Text'
import useSnackbar from '../hooks/useSnackbar'
import openExternalUrl from '../utils/openExternalUrl'
import { reportError } from '../utils/sentry'

type LicenseItemProps = {
  name: string
  version: string | undefined
  publisher: string | undefined
  license: string
  onPress: () => void
}

const LicenseItem = (props: LicenseItemProps): ReactElement => {
  const { name, version, license, publisher, onPress } = props
  const { t } = useTranslation('licenses')
  const theme = useTheme()

  const styles = StyleSheet.create({
    description: { color: theme.colors.onSurfaceVariant, paddingLeft: 8 },
    container: {
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
    },
  })

  return (
    <TouchableRipple
      onPress={onPress}
      role='link'
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View>
        <Text variant='body1'>{name}</Text>
        <Text variant='body2' style={styles.description}>
          {publisher}
        </Text>
        <Text variant='body2' style={styles.description}>
          {t('version')} {version}
        </Text>
        <Text variant='body2' style={styles.description}>
          {t('license')} {license}
        </Text>
      </View>
    </TouchableRipple>
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
    const { licenses, name, repository, version, publisher } = item
    const openLink = () => (repository ? openExternalUrl(repository, showSnackbar) : undefined)
    return (
      <LicenseItem
        key={name}
        name={name}
        publisher={publisher}
        version={version}
        license={licenses}
        onPress={openLink}
      />
    )
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
