import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { ExternalSourcePermissions } from 'shared'

import Caption from '../components/Caption'
import ConsentSection from '../components/ConsentSection'
import GeneralFooter from '../components/GeneralFooter'
import GeneralHeader from '../components/GeneralHeader'
import Layout from '../components/Layout'
import List from '../components/List'
import buildConfig from '../constants/buildConfig'
import useLocalStorage from '../hooks/useLocalStorage'
import { LOCAL_STORAGE_ITEM_EXTERNAL_SOURCES } from '../utils/iframes'

const Description = styled('div')`
  margin-bottom: 24px;
`

type ConsentPageProps = { languageCode: string }
const ConsentPage = ({ languageCode }: ConsentPageProps): ReactElement => {
  const { t } = useTranslation('consent')
  const { value: externalSourcePermissions, updateLocalStorageItem } = useLocalStorage<ExternalSourcePermissions>({
    key: LOCAL_STORAGE_ITEM_EXTERNAL_SOURCES,
    initialValue: {},
  })

  const updateSourcePermission = (source: string, permissionGiven: boolean) =>
    updateLocalStorageItem({
      ...externalSourcePermissions,
      [source]: permissionGiven,
    })

  const renderConsentItem = (item: string): ReactElement => (
    <ConsentSection
      key={item}
      description={t('consentDescription', { source: item })}
      allowed={externalSourcePermissions[item] ?? false}
      onPress={permissionGiven => updateSourcePermission(item, permissionGiven)}
    />
  )

  return (
    <Layout header={<GeneralHeader languageCode={languageCode} />} footer={<GeneralFooter language={languageCode} />}>
      <Caption title={t('title')} />
      <Description>{t('description')}</Description>
      <List
        items={buildConfig().supportedIframeSources}
        renderItem={renderConsentItem}
        noItemsMessage={t('noSources')}
      />
    </Layout>
  )
}

export default ConsentPage
