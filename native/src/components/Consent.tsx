import { useFocusEffect } from '@react-navigation/native'
import React, { ReactElement, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import { ExternalSourcePermissions } from 'api-client'

import buildConfig from '../constants/buildConfig'
import appSettings from '../utils/AppSettings'
import { reportError } from '../utils/sentry'
import Caption from './Caption'
import ConsentSection from './ConsentSection'
import Layout from './Layout'
import List from './List'
import ItemSeparator from './base/ItemSeparator'
import Text from './base/Text'

const Description = styled(Text)`
  margin-bottom: 24px;
`
const Consent = (): ReactElement | null => {
  const [externalSourcePermissions, setExternalSourcePermissions] = useState<ExternalSourcePermissions | null>(null)
  const { t } = useTranslation('consent')

  useFocusEffect(
    useCallback(() => {
      appSettings.loadExternalSourcePermissions().then(setExternalSourcePermissions).catch(reportError)
    }, []),
  )

  // permissions not initialized
  if (!externalSourcePermissions) {
    return null
  }

  const onPress = (type: string, allowed: boolean) => {
    const updatedSources: Record<string, boolean> = externalSourcePermissions
    updatedSources[type] = allowed
    setExternalSourcePermissions(updatedSources)
    appSettings.setExternalSourcePermissions(updatedSources).catch(reportError)
  }

  const renderConsentItem = ({ item }: { item: string }): ReactElement => (
    <ConsentSection
      key={item}
      title={item}
      description={t('consentDescription', { source: item })}
      allowed={externalSourcePermissions[item] ?? false}
      onPress={onPress}
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
