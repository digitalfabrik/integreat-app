import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import Caption from '../components/Caption'
import ExternalSourceListItem from '../components/ExternalSourceListItem'
import Layout from '../components/Layout'
import List from '../components/List'
import Text from '../components/base/Text'
import buildConfig from '../constants/buildConfig'
import { useAppContext } from '../hooks/useRegionAppContext'
import useSetRouteTitle from '../hooks/useSetRouteTitle'

const ExternalSources = (): ReactElement | null => {
  const { settings, updateSettings } = useAppContext()
  const { t } = useTranslation()
  const { externalSourcePermissions } = settings

  useSetRouteTitle(t($ => $.settings.externalSources.title))

  const onPress = (source: string) => {
    const updatedSources = { ...externalSourcePermissions, [source]: !externalSourcePermissions[source] }
    updateSettings({ externalSourcePermissions: updatedSources })
  }

  const renderExternalSourcesItem = ({ item }: { item: string }): ReactElement => (
    <ExternalSourceListItem
      key={item}
      title={item}
      description={t($ => $.settings.externalSources.source, { source: item })}
      allowed={externalSourcePermissions[item] ?? false}
      onPress={() => onPress(item)}
    />
  )

  return (
    <Layout>
      <List
        items={buildConfig().supportedIframeSources}
        renderItem={renderExternalSourcesItem}
        header={
          <>
            <Caption title={t($ => $.settings.externalSources.title)} />
            <Text style={{ paddingHorizontal: 16, marginBottom: 24 }}>
              {t($ => $.settings.externalSources.description)}
            </Text>
          </>
        }
        noItemsMessage={t($ => $.settings.externalSources.nothingFound)}
      />
    </Layout>
  )
}

export default ExternalSources
