import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList } from 'react-native'
import { Divider } from 'react-native-paper'

import { SettingsRouteType } from 'shared'

import Caption from '../components/Caption'
import Layout from '../components/Layout'
import SettingItem from '../components/SettingItem'
import { NavigationProps } from '../constants/NavigationTypes'
import useCityAppContext from '../hooks/useCityAppContext'
import useSnackbar from '../hooks/useSnackbar'
import createSettingsSections, { SettingsSectionType } from '../utils/createSettingsSections'
import { log, reportError } from '../utils/sentry'

type SettingsProps = {
  navigation: NavigationProps<SettingsRouteType>
}

const Settings = ({ navigation }: SettingsProps): ReactElement => {
  const appContext = useCityAppContext()
  const showSnackbar = useSnackbar()
  const { t } = useTranslation('settings')
  const { settings } = appContext

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

  const sections = createSettingsSections({ appContext, navigation, showSnackbar, t }).filter(
    (it): it is SettingsSectionType => it !== null,
  )

  return (
    <Layout>
      <Caption title={t('layout:settings')} />
      <Divider />
      <FlatList
        data={sections}
        extraData={appContext.settings}
        renderItem={renderItem}
        ItemSeparatorComponent={Divider}
        ListFooterComponent={Divider}
      />
    </Layout>
  )
}

export default Settings
