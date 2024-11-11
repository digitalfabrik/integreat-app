import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { SectionList, SectionListData } from 'react-native'
import styled from 'styled-components/native'

import { SettingsRouteType } from 'shared'

import Caption from '../components/Caption'
import Layout from '../components/Layout'
import SettingItem from '../components/SettingItem'
import ItemSeparator from '../components/base/ItemSeparator'
import { NavigationProps } from '../constants/NavigationTypes'
import useCityAppContext from '../hooks/useCityAppContext'
import useSnackbar from '../hooks/useSnackbar'
import createSettingsSections, { SettingsSectionType } from '../utils/createSettingsSections'
import { log, reportError } from '../utils/sentry'

type SettingsProps = {
  navigation: NavigationProps<SettingsRouteType>
}

type SectionType = SectionListData<SettingsSectionType> & {
  title?: string | null
}

const SectionHeader = styled.Text`
  padding: 20px;
  color: ${props => props.theme.colors.textColor};
`

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
      log('Failed to persist settings.', 'error')
      reportError(e)
      appContext.updateSettings(oldSettings)
      showSnackbar({ text: t('error:unknownError') })
    }
  }

  const renderItem = ({ item }: { item: SettingsSectionType }) => {
    const { getSettingValue, onPress, ...otherProps } = item
    const value = !!(getSettingValue && getSettingValue(settings))
    return <SettingItem value={value} key={otherProps.title} onPress={safeOnPress(onPress)} {...otherProps} />
  }

  const renderSectionHeader = ({ section: { title } }: { section: SectionType }) => {
    if (!title) {
      return null
    }

    return <SectionHeader>{title}</SectionHeader>
  }

  const sections = createSettingsSections({
    appContext,
    navigation,
    showSnackbar,
    t,
  })

  return (
    <Layout>
      <Caption title={t('layout:settings')} />
      <SectionList
        sections={sections}
        extraData={settings}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        ItemSeparatorComponent={ItemSeparator}
        SectionSeparatorComponent={ItemSeparator}
        stickySectionHeadersEnabled={false}
      />
    </Layout>
  )
}

export default Settings
