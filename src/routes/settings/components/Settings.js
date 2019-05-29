// @flow

import * as React from 'react'
import { SectionList, StyleSheet, Switch, AsyncStorage, View } from 'react-native'
import styled from 'styled-components/native'

import SettingItem from './SettingItem'
import type { ThemeType } from '../../../modules/theme/constants/theme'
import type { TFunction } from 'react-i18next'
import type { NavigationScreenProp } from 'react-navigation'
import { mapValues, toPairs } from 'lodash/object'
import type { SettingsType } from '../SettingsType'
import createSettingsSections from '../createSettingsSections'
import { fromPairs } from 'lodash/array'
import type { ChangeSettingFunctionType } from '../createSettingsSections'

type PropsType = {|
  theme: ThemeType,
  language: string,
  t: TFunction,
  navigation: NavigationScreenProp<*>
|}

type StateType = {
  settings: SettingsType,
  settingsLoaded: boolean
}

type ItemType = {
  title: string, description: string,
  hasSwitch?: true,
  onPress?: () => void
}

type SectionType = { title: ?string }

const ItemSeparator = styled.View`
    background-color: ${props => props.theme.colors.textDecorationColor};;
    height: ${StyleSheet.hairlineWidth};
`

const SectionHeader = styled.Text`
    padding: 20px;
    color: ${props => props.theme.colors.textColor};
`

export default class Settings extends React.Component<PropsType, StateType> {
  constructor (props: PropsType) {
    super(props)

    this.state = {settingsLoaded: false, settings: {errorTracking: false, test: false}}

    this.loadSettings()
  }

  async loadSettings () {
    try {
      const settingsKeys = Object.keys(this.state.settings)
      const settingsArray = await AsyncStorage.multiGet(settingsKeys)

      const settings = mapValues(fromPairs(settingsArray), value => JSON.parse(value))

      this.setState({settingsLoaded: true, settings})
    } catch (e) {
      console.error('Failed to load settings.')
    }
  }

  setSetting = async (changeSetting: ChangeSettingFunctionType) => {
    this.setState(
      state => {
        const newSettings = changeSetting(state.settings)
        return {settings: {...state.settings, ...newSettings}}
      },
      async () => {
        const settingsArray = toPairs(mapValues(this.state.settings, value => JSON.stringify(value)))

        try {
          await AsyncStorage.multiSet(settingsArray)
        } catch (e) {
          console.error('Failed to persist settings.')
        }
      }
    )
  }

  renderItem = ({item}: { item: ItemType }) => {
    const {theme} = this.props
    const {errorTracking} = this.state.settings
    const {title, description, hasSwitch, onPress} = item

    return (
      <SettingItem title={title} description={description}
                   onPress={onPress} theme={theme}>
        {hasSwitch && <Switch value={errorTracking} onValueChange={onPress} />}
      </SettingItem>
    )
  }

  renderSectionHeader = ({section: {title}}: { section: SectionType }) =>
    <View><SectionHeader>{title}</SectionHeader></View>

  keyExtractor = (item: ItemType, index: number) => index

  ThemedItemSeparator = () => <ItemSeparator theme={this.props.theme} />

  render () {
    if (!this.state.settingsLoaded) {
      return null
    }

    return (
      <SectionList
        keyExtractor={this.keyExtractor}
        sections={createSettingsSections({setSetting: this.setSetting, ...this.props})}
        extraData={this.state.settings}
        renderItem={this.renderItem}
        renderSectionHeader={this.renderSectionHeader}
        ItemSeparatorComponent={this.ThemedItemSeparator}
        SectionSeparatorComponent={this.ThemedItemSeparator}
        stickySectionHeadersEnabled={false}
      />
    )
  }
}
