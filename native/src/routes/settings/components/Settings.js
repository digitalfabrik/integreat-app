// @flow

import * as React from 'react'
import { SectionList, StyleSheet, Switch, View } from 'react-native'
import styled from 'styled-components/native'
import { type StyledComponent } from 'styled-components'
import SettingItem from './SettingItem'
import type { ThemeType } from '../../../modules/theme/constants'
import type { TFunction } from 'react-i18next'
import type { SettingsType } from '../../../modules/settings/AppSettings'
import createSettingsSections from '../createSettingsSections'
import AppSettings, { defaultSettings } from '../../../modules/settings/AppSettings'
import type { SectionBase } from 'react-native/Libraries/Lists/SectionList'
import type { AccessibilityRole } from 'react-native/Libraries/Components/View/ViewAccessibility'
import type {
  SettingsRouteType,
  NavigationPropType,
  RoutePropType
} from '../../../modules/app/components/NavigationTypes'

type PropsType = {|
  theme: ThemeType,
  languageCode: string,
  cityCode: ?string,
  t: TFunction,
  route: RoutePropType<SettingsRouteType>,
  navigation: NavigationPropType<SettingsRouteType>,
  dispatch: () => {}
|}

type StateType = {
  settings: SettingsType,
  settingsLoaded: boolean
}

type ItemType = {
  title: string, description?: string,
  hasSwitch?: true,
  getSettingValue?: (settings: SettingsType) => boolean | null,
  onPress?: () => void,
  accessibilityRole?: AccessibilityRole
}

type SectionType = SectionBase<ItemType> & {title: ?string}

const ItemSeparator: StyledComponent<{}, ThemeType, *> = styled.View`
    background-color: ${props => props.theme.colors.textDecorationColor};
    height: ${StyleSheet.hairlineWidth}px;
`

const SectionHeader = styled.Text`
    padding: 20px;
    color: ${props => props.theme.colors.textColor};
`

export default class Settings extends React.Component<PropsType, StateType> {
  appSettings: AppSettings

  constructor (props: PropsType) {
    super(props)

    this.state = { settingsLoaded: false, settings: defaultSettings }
    this.appSettings = new AppSettings()

    this.loadSettings()
  }

  async loadSettings () {
    try {
      const settings = await this.appSettings.loadSettings()

      this.setState({ settingsLoaded: true, settings })
    } catch (e) {
      console.error('Failed to load settings.')
    }
  }

  setSetting = async (
    changeSetting: (settings: SettingsType) => $Shape<SettingsType>,
    changeAction?: (settings: SettingsType) => Promise<void>
  ) => {
    this.setState(
      state => {
        const newSettings = changeSetting(state.settings)
        return { settings: { ...state.settings, ...newSettings } }
      },
      async () => {
        const newSettings = this.state.settings
        try {
          if (changeAction) {
            await changeAction(newSettings)
          }
          await this.appSettings.setSettings(newSettings)
        } catch (e) {
          console.error(e)
          console.error('Failed to persist settings.')
        }
      }
    )
  }

  renderItem = ({ item }: { item: ItemType }) => {
    const { theme } = this.props
    const { title, description, hasSwitch, onPress, getSettingValue, accessibilityRole } = item
    const value = getSettingValue ? getSettingValue(this.state.settings) : false

    return (
      <SettingItem accessibilityRole={accessibilityRole} title={title} description={description}
                   onPress={onPress} theme={theme}>
        {hasSwitch && <Switch thumbColor={theme.colors.themeColor} trackColor={{ true: theme.colors.themeColor }}
                              value={value} onValueChange={onPress} />}
      </SettingItem>
    )
  }

  renderSectionHeader = ({ section: { title } }: { section: SectionType }) => {
    if (!title) {
      return null
    }
    return (
      <View><SectionHeader theme={this.props.theme}>{title}</SectionHeader></View>
    )
  }

  keyExtractor = (item: ItemType, index: number): string => index.toString()

  ThemedItemSeparator = () => <ItemSeparator theme={this.props.theme} />

  render () {
    const { t, languageCode, cityCode } = this.props
    const { settings, settingsLoaded } = this.state

    if (!settingsLoaded) {
      return null
    }

    return <SectionList
        keyExtractor={this.keyExtractor}
        sections={createSettingsSections({ setSetting: this.setSetting, t, languageCode, cityCode })}
        extraData={settings}
        renderItem={this.renderItem}
        renderSectionHeader={this.renderSectionHeader}
        ItemSeparatorComponent={this.ThemedItemSeparator}
        SectionSeparatorComponent={this.ThemedItemSeparator}
        stickySectionHeadersEnabled={false}
      />
  }
}
