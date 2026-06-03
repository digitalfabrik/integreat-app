import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, StyleSheet, View } from 'react-native'
import { TouchableRipple, useTheme } from 'react-native-paper'

import { License, parseLicenses } from 'shared'
import { useLoadAsync } from 'shared/api'

import Caption from '../components/Caption'
import Layout from '../components/Layout'
import Text from '../components/base/Text'
import useSnackbar from '../hooks/useSnackbar'
import openExternalUrl from '../utils/openExternalUrl'

type LicenseItemProps = {
  name: string
  version: string | undefined
  author: string | undefined
  license: string
  onPress: () => void
}

const LicenseItem = (props: LicenseItemProps): ReactElement => {
  const { name, version, license, author, onPress } = props
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
          {author}
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

const loadLicenses = async () => parseLicenses((await import('../assets/licenses.json')).default)

const Licenses = (): ReactElement => {
  const { data: licenses } = useLoadAsync(loadLicenses)
  const { t } = useTranslation('settings')
  const showSnackbar = useSnackbar()

  const renderItem = ({ item }: { item: License }) => {
    const { license, name, repository, version, author } = item
    const openLink = () => (repository ? openExternalUrl(repository, showSnackbar) : undefined)
    return <LicenseItem key={name} name={name} author={author} version={version} license={license} onPress={openLink} />
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
