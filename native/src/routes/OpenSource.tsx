import { TFunction } from 'i18next'
import React, { ReactElement } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { FlatList, StyleSheet, View } from 'react-native'
import { TouchableRipple, useTheme } from 'react-native-paper'
import styled from 'styled-components/native'

import { License, parseLicenses } from 'shared'
import { useLoadAsync } from 'shared/api'

import Caption from '../components/Caption'
import Layout from '../components/Layout'
import Link from '../components/Link'
import Text from '../components/base/Text'
import NativeConstants from '../constants/NativeConstants'
import buildConfig from '../constants/buildConfig'
import useSetRouteTitle from '../hooks/useSetRouteTitle'
import useOpenExternalUrl from '../utils/openExternalUrl'

const HeaderView = styled.View`
  padding: 0 16px;
  gap: 8px;
`

type OpenSourceHeaderProps = {
  openExternalUrl: (url: string) => void
  t: TFunction
}

export const OpenSourceHeader = ({ t, openExternalUrl }: OpenSourceHeaderProps): ReactElement => {
  const linkToGithub = 'https://github.com/digitalfabrik/integreat-app'
  const linkToSBoM = `https://github.com/digitalfabrik/integreat-app/releases/tag/${NativeConstants.appVersion}/sbom.spdx.json`

  return (
    <HeaderView>
      <Caption title={t($ => $.about.openSources.title)} />
      <Text variant='body1'>
        <Trans
          ns='about'
          i18nKey={$ => $.about.openSources.sourceCode}
          values={{ appName: buildConfig().appName }}
          components={{
            Link: <Link onPress={() => openExternalUrl(linkToGithub)}>{t($ => $.about.openSources.sourceCode)}</Link>,
          }}
        />
      </Text>
      <Text variant='body1'>
        <Trans
          ns='about'
          i18nKey={$ => $.about.openSources.sbom}
          components={{
            Link: <Link onPress={() => openExternalUrl(linkToSBoM)}>{t($ => $.about.openSources.sbom)}</Link>,
          }}
        />
      </Text>
      <Text variant='subtitle1'>{t($ => $.about.openSources.licenses.title)}</Text>
    </HeaderView>
  )
}

type OpenSourceItemProps = {
  name: string
  version: string | undefined
  author: string | undefined
  license: string
  onPress: () => void
}

const OpenSourceItem = (props: OpenSourceItemProps): ReactElement => {
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
            {t($ => $.about.openSources.licenses.version, { version })}
          </Text>
        )}
        <Text variant='body2' style={styles.description}>
          {t($ => $.about.openSources.licenses.license, { license })}
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

  useSetRouteTitle(t($ => $.about.openSources.title))

  const renderItem = ({ item }: { item: License }) => {
    const { license, name, repository, version, author } = item
    const openLink = () => (repository ? openExternalUrl(repository) : undefined)
    return (
      <OpenSourceItem key={name} name={name} author={author} version={version} license={license} onPress={openLink} />
    )
  }

  return (
    <Layout>
      <FlatList
        data={licenses}
        renderItem={renderItem}
        ListHeaderComponent={<OpenSourceHeader t={t} openExternalUrl={openExternalUrl} />}
      />
    </Layout>
  )
}

export default OpenSource
