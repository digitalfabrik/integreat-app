import { useFocusEffect } from '@react-navigation/native'
import React, { ReactElement, useCallback, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SectionList, SectionListData } from 'react-native'
import styled from 'styled-components/native'

import { SettingsRouteType } from 'shared'

import Caption from '../components/Caption'
import Layout from '../components/Layout'
import SettingItem from '../components/SettingItem'
import ItemSeparator from '../components/base/ItemSeparator'
import { NavigationProps } from '../constants/NavigationTypes'
import { AppContext } from '../contexts/AppContextProvider'
import useSnackbar from '../hooks/useSnackbar'
import appSettings, { SettingsType } from '../utils/AppSettings'
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
  const [settings, setSettings] = useState<SettingsType | null>(null)
  const { cityCode, languageCode } = useContext(AppContext)
  const showSnackbar = useSnackbar()
  const { t } = useTranslation('settings')

  useFocusEffect(
    useCallback(() => {
      appSettings
        .loadSettings()
        .then(settings => setSettings(settings))
        .catch(e => {
          log('Failed to load settings.', 'error')
          reportError(e)
        })
    }, []),
  )

  const setSetting = async (
    changeSetting: (settings: SettingsType) => Partial<SettingsType>,
    changeAction?: (settings: SettingsType) => Promise<boolean>,
  ) => {
    if (!settings) {
      return
    }

    const oldSettings = settings
    const newSettings = { ...oldSettings, ...changeSetting(settings) }
    setSettings(newSettings)

    try {
      const successful = changeAction ? await changeAction(newSettings) : true

      if (successful) {
        await appSettings.setSettings(newSettings)
      } else {
        setSettings(oldSettings)
      }
    } catch (e) {
      log('Failed to persist settings.', 'error')
      reportError(e)
      setSettings(oldSettings)
    }
  }

  const renderItem = ({ item }: { item: SettingsSectionType }) => {
    const { getSettingValue, ...otherProps } = item
    const value = !!(settings && getSettingValue && getSettingValue(settings))
    return <SettingItem value={value} key={otherProps.title} {...otherProps} />
  }

  const renderSectionHeader = ({ section: { title } }: { section: SectionType }) => {
    if (!title) {
      return null
    }

    return <SectionHeader>{title}</SectionHeader>
  }

  if (!settings) {
    return <Layout />
  }

  const sections = createSettingsSections({
    setSetting,
    t,
    languageCode,
    cityCode,
    navigation,
    settings,
    showSnackbar,
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
