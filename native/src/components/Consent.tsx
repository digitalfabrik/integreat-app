import { useFocusEffect } from '@react-navigation/native'
import React, { ReactElement, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import buildConfig from '../constants/buildConfig'
import appSettings, { ExternalSourcePermission } from '../utils/AppSettings'
import { reportError } from '../utils/sentry'
import Caption from './Caption'
import ConsentSection from './ConsentSection'
import Layout from './Layout'
import List from './List'
import ItemSeparator from './base/ItemSeparator'

const Consent = (): ReactElement | null => {
  const [externalSourcePermissions, setExternalSourcePermissions] = useState<ExternalSourcePermission | null>(null)
  const { t } = useTranslation('consent')

  useFocusEffect(
    useCallback(() => {
      appSettings.loadExternalSourcePermissions().then(setExternalSourcePermissions).catch(reportError)
    }, []),
  )

  // not permissions initialized
  if (!externalSourcePermissions) {
    return null
  }

  const onPress = (type: string, allowed: boolean) => {
    const updatedSources: Record<string, boolean> = externalSourcePermissions
    updatedSources[type] = allowed
    setExternalSourcePermissions(updatedSources)
    appSettings.setExternalSourcePermissions(updatedSources).catch(reportError)
  }

  const renderConsentItem = ({ item }: { item: string }): ReactElement => {
    return (
      <ConsentSection
        key={item}
        title={item}
        description={t('consentDescription', { source: item })}
        allowed={externalSourcePermissions[item] ?? false}
        onPress={onPress}
      />
    )
  }

  return (
    <Layout>
      <List
        items={buildConfig().supportedIframeSources}
        renderItem={renderConsentItem}
        Header={
          <>
            <Caption title={t('title')} />
            <ItemSeparator />
          </>
        }
        noItemsMessage={t('noSources')}
      />
    </Layout>
  )
}

export default Consent
