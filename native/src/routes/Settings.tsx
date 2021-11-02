import { useFocusEffect } from '@react-navigation/native'
import React, { ReactElement, useCallback, useState } from 'react'
import { TFunction } from 'react-i18next'
import { SectionList, SectionListData, StyleSheet } from 'react-native'
import { Dispatch } from 'redux'
import styled from 'styled-components/native'

import { SettingsRouteType } from 'api-client'
import { ThemeType } from 'build-configs'

import LayoutContainer from '../components/LayoutContainer'
import SettingItem from '../components/SettingItem'
import { NavigationPropType, RoutePropType } from '../constants/NavigationTypes'
import useSnackbar from '../hooks/useSnackbar'
import { StoreActionType } from '../redux/StoreActionType'
import AppSettings, { SettingsType } from '../utils/AppSettings'
import createSettingsSections, { SettingsSectionType } from '../utils/createSettingsSections'

export type PropsType = {
  theme: ThemeType
  languageCode: string
  cityCode: string | null | undefined
  t: TFunction
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

const appSettings = new AppSettings()

const Settings = ({ navigation, t, languageCode, cityCode, theme }: PropsType): ReactElement => {
  const [settings, setSettings] = useState<SettingsType | null>(null)
  const showSnackbar = useSnackbar()

  useFocusEffect(
    useCallback(() => {
      appSettings
        .loadSettings()
        .then(settings => setSettings(settings))
        // eslint-disable-next-line no-console
        .catch(e => console.error('Failed to load settings.', e))
    }, [])
  )

  const setSetting = async (
    changeSetting: (settings: SettingsType) => Partial<SettingsType>,
    changeAction?: (settings: SettingsType) => Promise<void>
  ) => {
    if (!settings) {
      return
    }

    const oldSettings = settings
    const newSettings = { ...oldSettings, ...changeSetting(settings) }
    setSettings(newSettings)

    try {
      if (changeAction) {
        await changeAction(newSettings)
      }

      await appSettings.setSettings(newSettings)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
      // eslint-disable-next-line no-console
      console.error('Failed to persist settings.')
      setSettings(oldSettings)
    }
  }

  const renderItem = ({ item }: { item: SettingsSectionType }) => {
    const { getSettingValue, ...otherProps } = item
    const value = !!(settings && getSettingValue && getSettingValue(settings))
    return <SettingItem value={value} theme={theme} t={t} {...otherProps} />
  }

  const renderSectionHeader = ({ section: { title } }: { section: SectionType }) => {
    if (!title) {
      return null
    }

    return <SectionHeader theme={theme}>{title}</SectionHeader>
  }

  const keyExtractor = (item: SettingsSectionType, index: number): string => index.toString()

  const ThemedItemSeparator = () => <ItemSeparator theme={theme} />

  if (!settings) {
    return <LayoutContainer />
  }

  const sections = createSettingsSections({
    setSetting,
    t,
    languageCode,
    cityCode,
    navigation,
    settings,
    showSnackbar
  })

  return (
    <LayoutContainer>
      <SectionList
        keyExtractor={keyExtractor}
        sections={sections}
        extraData={settings}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        ItemSeparatorComponent={ThemedItemSeparator}
        SectionSeparatorComponent={ThemedItemSeparator}
        stickySectionHeadersEnabled={false}
      />
    </LayoutContainer>
  )
}

export default Settings
