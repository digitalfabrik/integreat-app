import { TFunction } from 'i18next'
import React, { ReactElement } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { FlatList, StyleSheet, View } from 'react-native'
import { TouchableRipple, useTheme } from 'react-native-paper'
import styled from 'styled-components/native'

import { License, parseLicenses, repoUrl, sbomUrl } from 'shared'
import { useLoadAsync } from 'shared/api'

import Caption from '../components/Caption'
import Layout from '../components/Layout'
import Link from '../components/Link'
import Text from '../components/base/Text'
import NativeConstants from '../constants/NativeConstants'
import buildConfig from '../constants/buildConfig'
import useSetRouteTitle from '../hooks/useSetRouteTitle'
import useOpenExternalUrl from '../utils/openExternalUrl'

const HeaderContainer = styled.View`
  padding: 0 16px;
  gap: 16px;
`

const OpenSourceHeader = ({ t }: { t: TFunction }): ReactElement => (
  <HeaderContainer>
    <Caption title={t($ => $.about.openSource.title)} />
    <Text variant='body2'>
      <Trans
        ns='about'
        i18nKey={$ => $.about.openSource.sourceCode}
        values={{ appName: buildConfig().appName }}
        components={{
          Link: <Link url={repoUrl}>{t($ => $.about.openSource.sourceCode)}</Link>,
        }}
      />
    </Text>
    <Text variant='body2'>
      <Trans
        ns='about'
        i18nKey={$ => $.about.openSource.sbom}
        components={{
          Link: <Link url={sbomUrl(NativeConstants.appVersion)}>{t($ => $.about.openSource.sbom)}</Link>,
        }}
      />
    </Text>
    <Text variant='subtitle1'>{t($ => $.about.openSource.licenses.title)}</Text>
  </HeaderContainer>
)

type OpenSourceItemProps = {
  name: string
  version: string | undefined
  author: string | undefined
  license: string
  onPress: () => void
}

const LicenseItem = (props: OpenSourceItemProps): ReactElement => {
  const { name, version, license, author, onPress } = props
  const { t } = useTranslation()
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
        {version && (
          <Text variant='body2' style={styles.description}>
            {t($ => $.about.openSource.licenses.version, { version })}
          </Text>
        )}
        <Text variant='body2' style={styles.description}>
          {t($ => $.about.openSource.licenses.license, { license })}
        </Text>
      </View>
    </TouchableRipple>
  )
}

const loadLicenses = async () => parseLicenses((await import('../assets/licenses.json')).default)

const OpenSource = (): ReactElement => {
  const { data: licenses } = useLoadAsync(loadLicenses)
  const { t } = useTranslation()
  const openExternalUrl = useOpenExternalUrl()

  useSetRouteTitle(t($ => $.about.openSource.title))

  const renderItem = ({ item }: { item: License }) => {
    const { license, name, repository, version, author } = item
    const openLink = () => (repository ? openExternalUrl(repository) : undefined)
    return <LicenseItem key={name} name={name} author={author} version={version} license={license} onPress={openLink} />
  }

  return (
    <Layout>
      <FlatList data={licenses} renderItem={renderItem} ListHeaderComponent={<OpenSourceHeader t={t} />} />
    </Layout>
  )
}

export default OpenSource
