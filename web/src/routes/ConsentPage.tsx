import React, { ReactElement, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import Caption from '../components/Caption'
import ConsentSection from '../components/ConsentSection'
import GeneralFooter from '../components/GeneralFooter'
import GeneralHeader from '../components/GeneralHeader'
import Layout from '../components/Layout'
import List from '../components/List'
import { ExternalSourcePermission } from '../components/RemoteContent'
import buildConfig from '../constants/buildConfig'
import useCookie from '../hooks/useCookie'

const Description = styled.div`
  margin-bottom: 24px;
`

type ConsentPageProps = { languageCode: string }
const ConsentPage = ({ languageCode }: ConsentPageProps): ReactElement => {
  const { t } = useTranslation('consent')
  const { value: sources, updateCookie } = useCookie('externalSources')
  const externalSourcePermissions: ExternalSourcePermission = useMemo(
    () => (sources ? JSON.parse(sources) : {}),
    [sources],
  )

  const onPress = (type: string, allowed: boolean) => {
    externalSourcePermissions[type] = allowed
    updateCookie(JSON.stringify(externalSourcePermissions), '/', window.location.hostname)
  }

  const renderConsentItem = (item: string): ReactElement => (
    <ConsentSection
      key={item}
      title={item}
      description={t('consentDescription', { source: item })}
      allowed={externalSourcePermissions[item] ?? false}
      onPress={onPress}
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
