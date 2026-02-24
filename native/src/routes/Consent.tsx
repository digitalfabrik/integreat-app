import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Divider } from 'react-native-paper'

import Caption from '../components/Caption'
import ConsentSection from '../components/ConsentSection'
import Layout from '../components/Layout'
import List from '../components/List'
import Text from '../components/base/Text'
import buildConfig from '../constants/buildConfig'
import { useAppContext } from '../hooks/useCityAppContext'

const Consent = (): ReactElement | null => {
  const { settings, updateSettings } = useAppContext()
  const { t } = useTranslation('consent')
  const { externalSourcePermissions } = settings

  const onPress = (source: string) => {
    const updatedSources = { ...externalSourcePermissions, [source]: !externalSourcePermissions[source] }
    updateSettings({ externalSourcePermissions: updatedSources })
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
            <Text style={{ paddingHorizontal: 16, marginBottom: 24 }}>{t('descriptionNative')}</Text>
            <Divider />
          </>
        }
        noItemsMessage={t('noSources')}
      />
    </Layout>
  )
}

export default Consent
