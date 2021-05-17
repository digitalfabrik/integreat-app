import React, { useCallback, useState } from 'react'
import { Dispatch } from 'redux'
import { SectionList, StyleSheet } from 'react-native'
import styled from 'styled-components/native'
import { StyledComponent } from 'styled-components'
import SettingItem from './SettingItem'
import { ThemeType } from 'build-configs/ThemeType'
import { TFunction } from 'react-i18next'
import AppSettings, { SettingsType } from '../../../modules/settings/AppSettings'
import createSettingsSections, { SettingsSectionType } from '../createSettingsSections'
import { SectionBase } from 'react-native/Libraries/Lists/SectionList'
import { NavigationPropType, RoutePropType } from '../../../modules/app/constants/NavigationTypes'
import LayoutContainer from '../../../modules/layout/containers/LayoutContainer'
import { SettingsRouteType } from 'api-client/src/routes'
import { StoreActionType } from '../../../modules/app/StoreActionType'
import { useFocusEffect } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
export type PropsType = {
  theme: ThemeType
  languageCode: string
  cityCode: string | null | undefined
  t: TFunction
  route: RoutePropType<SettingsRouteType>
  navigation: NavigationPropType<SettingsRouteType>
  dispatch: Dispatch<StoreActionType>
}

type SectionType = SectionBase<SettingsSectionType> & {
  title: string | null | undefined
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

const Settings = ({ navigation, t, languageCode, cityCode, theme }: PropsType) => {
  const [settings, setSettings] = useState<SettingsType | null>(null)
  const dispatch = useDispatch()

  const loadSettings = useCallback(async () => {
    try {
      const settings = await appSettings.loadSettings()
      setSettings(settings)
    } catch (e) {
      console.error('Failed to load settings.')
    }
  }, [])

  useFocusEffect(() => {
    // Reload settings if navigating back from another route
    loadSettings()
  })

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
      console.error(e)
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

  const showSnackbar = (key: string) =>
    dispatch({
      type: 'ENQUEUE_SNACKBAR',
      params: {
        text: key
      }
    })

  if (!settings) {
    return <LayoutContainer />
  }

  return (
    <LayoutContainer>
      <SectionList
        keyExtractor={keyExtractor}
        sections={createSettingsSections({
          setSetting,
          t,
          languageCode,
          cityCode,
          navigation,
          settings,
          showSnackbar
        })}
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
