import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { ExternalSourcePermissions } from 'shared'

import ConsentListItem from '../components/ConsentListItem'
import Footer from '../components/Footer'
import GeneralHeader from '../components/GeneralHeader'
import Layout from '../components/Layout'
import H1 from '../components/base/H1'
import List from '../components/base/List'
import buildConfig from '../constants/buildConfig'
import useLocalStorage, { EXTERNAL_SOURCES_STORAGE_KEY } from '../hooks/useLocalStorage'

const Description = styled('div')`
  margin-bottom: 24px;
`

type ConsentPageProps = { languageCode: string }
const ConsentPage = ({ languageCode }: ConsentPageProps): ReactElement => {
  const { t } = useTranslation('consent')
  const { value: externalSourcePermissions, updateLocalStorageItem } = useLocalStorage<ExternalSourcePermissions>({
    key: EXTERNAL_SOURCES_STORAGE_KEY,
    initialValue: {},
  })

  const updateSourcePermission = (source: string, permissionGiven: boolean) =>
    updateLocalStorageItem({
      ...externalSourcePermissions,
      [source]: permissionGiven,
    })

  const items = buildConfig().supportedIframeSources.map(item => (
    <ConsentListItem
      key={item}
      description={t('consentDescription', { source: item })}
      allowed={externalSourcePermissions[item] ?? false}
      onPress={permissionGiven => updateSourcePermission(item, permissionGiven)}
    />
  ))

  return (
    <Layout header={<GeneralHeader languageCode={languageCode} />} footer={<Footer />}>
      <H1>{t('title')}</H1>&<Description>{t('description')}</Description>
      <List items={items} NoItemsMessage={t('noSources')} />
    </Layout>
  )
}

export default ConsentPage
