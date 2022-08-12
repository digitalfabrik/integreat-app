import { useFocusEffect } from '@react-navigation/native'
import React, { ReactElement, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SectionList, SectionListData, StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'
import { Dispatch } from 'redux'
import styled from 'styled-components/native'

import { SettingsRouteType } from 'api-client'
import { ThemeType } from 'build-configs'

import Layout from '../components/Layout'
import SettingItem from '../components/SettingItem'
import { NavigationPropType, RoutePropType } from '../constants/NavigationTypes'
import useSnackbar from '../hooks/useSnackbar'
import { StateType } from '../redux/StateType'
import { StoreActionType } from '../redux/StoreActionType'
import appSettings, { SettingsType } from '../utils/AppSettings'
import createSettingsSections, { SettingsSectionType } from '../utils/createSettingsSections'
import { log, reportError } from '../utils/sentry'

export type PropsType = {
  theme: ThemeType
  route: RoutePropType<SettingsRouteType>
  navigation: NavigationPropType<SettingsRouteType>
  dispatch: Dispatch<StoreActionType>
}

type SectionType = SectionListData<SettingsSectionType> & {
  title?: string | null
}

const ItemSeparator = styled.View`
  background-color: ${props => props.theme.colors.textDecorationColor};
  height: ${StyleSheet.hairlineWidth}px;
`
const SectionHeader = styled.Text`
  padding: 20px;
  color: ${props => props.theme.colors.textColor};
`

const Settings = ({ navigation }: PropsType): ReactElement => {
  const [settings, setSettings] = useState<SettingsType | null>(null)
  const languageCode = useSelector<StateType, string>((state: StateType) => state.contentLanguage)
  const cityCode = useSelector<StateType, string | null>((state: StateType) => state.cityContent?.city ?? null)
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
    }, [])
  )

  const setSetting = async (
    changeSetting: (settings: SettingsType) => Partial<SettingsType>,
    changeAction?: (settings: SettingsType) => Promise<boolean>
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
    return <SettingItem value={value} {...otherProps} />
  }

  const renderSectionHeader = ({ section: { title } }: { section: SectionType }) => {
    if (!title) {
      return null
    }

    return <SectionHeader>{title}</SectionHeader>
  }

  const keyExtractor = (item: SettingsSectionType, index: number): string => index.toString()

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
      <SectionList
        keyExtractor={keyExtractor}
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
