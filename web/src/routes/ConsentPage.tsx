import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { ExternalSourcePermissions } from 'api-client'

import Caption from '../components/Caption'
import ConsentSection from '../components/ConsentSection'
import GeneralFooter from '../components/GeneralFooter'
import GeneralHeader from '../components/GeneralHeader'
import Layout from '../components/Layout'
import List from '../components/List'
import buildConfig from '../constants/buildConfig'
import useCookie from '../hooks/useCookie'
import { EXTERNAL_SOURCES_COOKIE_NAME } from '../utils/iframes'

const Description = styled.div`
  margin-bottom: 24px;
`

type ConsentPageProps = { languageCode: string }
const ConsentPage = ({ languageCode }: ConsentPageProps): ReactElement => {
  const { t } = useTranslation('consent')
  const { value: externalSourcePermissions, updateCookie } =
    useCookie<ExternalSourcePermissions>(EXTERNAL_SOURCES_COOKIE_NAME)

  const updateSourcePermission = (source: string, permissionGiven: boolean) => {
    externalSourcePermissions[source] = permissionGiven
    updateCookie(externalSourcePermissions)
  }

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
