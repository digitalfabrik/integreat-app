import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList } from 'react-native'
import { Divider } from 'react-native-paper'

import { REGIONS_ROUTE, SettingsRouteType } from 'shared'

import Caption from '../components/Caption'
import LayoutedScrollView from '../components/LayoutedScrollView'
import SettingItem from '../components/SettingItem'
import SwitchCmsUrlButton from '../components/SwitchCmsUrlButton'
import { NavigationProps } from '../constants/NavigationTypes'
import { useAppContext } from '../hooks/useRegionAppContext'
import useSnackbar from '../hooks/useSnackbar'
import dataContainer from '../utils/DefaultDataContainer'
import createSettingsSections, { SettingsSectionType } from '../utils/createSettingsSections'
import { log, reportError } from '../utils/sentry'

type SettingsProps = {
  navigation: NavigationProps<SettingsRouteType>
}

const Settings = ({ navigation }: SettingsProps): ReactElement => {
  const appContext = useAppContext()
  const showSnackbar = useSnackbar()
  const { t } = useTranslation('settings')
  const { settings } = appContext

  const clearResourcesAndCache = () => {
    dataContainer.clearInMemoryCache()
    dataContainer._clearOfflineCache().catch(reportError)
    navigation.reset({ index: 0, routes: [{ name: REGIONS_ROUTE }] })
  }

  const safeOnPress = (update: () => Promise<void> | void) => async () => {
    const oldSettings = settings
    try {
      await update()
    } catch (e) {
      log('Failed to persist settings.', { level: 'error' })
      reportError(e)
      appContext.updateSettings(oldSettings)
      showSnackbar({ text: t('error:settingsError') })
    }
  }

  const renderItem = ({ item }: { item: SettingsSectionType }) => {
    const { getSettingValue, onPress, ...otherProps } = item
    const value = getSettingValue ? !!getSettingValue(settings) : null
    return <SettingItem value={value} key={otherProps.title} onPress={safeOnPress(onPress)} {...otherProps} />
  }

  const sections = createSettingsSections({
    appContext,
    navigation,
    showSnackbar,
    t,
    clearResourcesAndCache,
  }).filter((it): it is SettingsSectionType => it !== null)

  return (
    <LayoutedScrollView>
      <Caption title={t('layout:settings')} />
      <SwitchCmsUrlButton clearResourcesAndCache={clearResourcesAndCache} />
      <Divider />
      <FlatList
        data={sections}
        extraData={appContext.settings}
        renderItem={renderItem}
        ItemSeparatorComponent={Divider}
        ListFooterComponent={Divider}
        // Fixes VirtualizedList should never be nested inside plain ScrollViews
        scrollEnabled={false}
      />
    </LayoutedScrollView>
  )
}

export default Settings
