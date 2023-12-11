import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import { ExternalSourcePermissions } from 'api-client'

import Caption from '../components/Caption'
import ConsentSection from '../components/ConsentSection'
import Layout from '../components/Layout'
import List from '../components/List'
import ItemSeparator from '../components/base/ItemSeparator'
import Text from '../components/base/Text'
import buildConfig from '../constants/buildConfig'
import appSettings from '../utils/AppSettings'
import { reportError } from '../utils/sentry'

const Description = styled(Text)`
  margin-bottom: 24px;
`
const Consent = (): ReactElement | null => {
  const [externalSourcePermissions, setExternalSourcePermissions] = useState<ExternalSourcePermissions | null>(null)
  const { t } = useTranslation('consent')

  useEffect(() => {
    appSettings.loadExternalSourcePermissions().then(setExternalSourcePermissions).catch(reportError)
  }, [])

  if (!externalSourcePermissions) {
    return null
  }

  const onPress = (source: string) => {
    const updatedSources = { ...externalSourcePermissions, [source]: !externalSourcePermissions[source] }
    setExternalSourcePermissions(updatedSources)
    appSettings.setExternalSourcePermissions(updatedSources).catch(reportError)
  }

  const renderConsentItem = ({ item }: { item: string }): ReactElement => (
    <ConsentSection
      key={item}
      title={item}
      description={t('consentDescription', { source: item })}
      allowed={externalSourcePermissions[item] ?? false}
      onPress={() => onPress(item)}
    />
  )

  return (
    <Layout>
      <List
        items={buildConfig().supportedIframeSources}
        renderItem={renderConsentItem}
        Header={
          <>
            <Caption title={t('title')} />
            <Description>{t('descriptionNative')}</Description>
            <ItemSeparator />
          </>
        }
        noItemsMessage={t('noSources')}
      />
    </Layout>
  )
}

export default Consent
