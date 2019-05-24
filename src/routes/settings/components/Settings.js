// @flow

import * as React from 'react'
import { SectionList, StyleSheet, Switch, AsyncStorage } from 'react-native'
import styled from 'styled-components/native'

import SettingItem from './SettingItem'
import type { ThemeType } from '../../../modules/theme/constants/theme'
import type { NavigationScreenProp } from 'react-navigation'
import { reduce } from 'lodash/collection'

type PropsType = {
  navigation: NavigationScreenProp<*>,
  theme: ThemeType
}

type SettingsType = {|
  errorTracking: boolean,
  test: boolean
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

const SectionHeaderContainer = styled.View`
`

const SectionHeader = styled.Text`
    padding: 20px;
    color: ${props => props.theme.colors.textColor};
`

export default class Settings extends React.Component<PropsType, StateType> {
  sections = [
    {
      title: 'Placeholder',
      data: [
        {
          title: 'Placeholder',
          description: 'Placeholder'
        },
        {
          title: 'Placeholder',
          description: 'Placeholder'
        }
      ]
    },
    {
      data: [
        {
          title: 'Help to improve Integreat',
          description: 'Automatically sends troubleshooting information',
          hasSwitch: true,
          onPress: () => { this.toggleErrorTracking() }
        },
        {
          title: 'About Integreat'
        },
        {
          title: 'Privacy Policy'
        },
        {
          title: 'Report a bug'
        },
        {
          title: 'Version: ??'
        },
        {
          title: 'Open source licenses'
        }
      ]
    }
  ]

  constructor (props: PropsType) {
    super(props)

    this.state = {settingsLoaded: false, settings: {errorTracking: false, test: false}}

    this.loadSettings()
  }

  async loadSettings () {
    try {
      const settingsKeys = Object.keys(this.state.settings)
      const settingsArray = await AsyncStorage.multiGet(settingsKeys)

      const settings = reduce(settingsArray,
        (accumulator, [key, value]) => {
          accumulator[key] = JSON.parse(value)
          return accumulator
        },
        {})

      this.setState(state => ({...state, settingsLoaded: true, settings}))
    } catch (e) {
      alert(e)
    }
  }

  async setSetting (changeSetting: SettingsType => $Shape<SettingsType>) {
    this.setState(state => {
      const newSettings = changeSetting(state.settings)
      return ({...state, settings: {...state.settings, ...newSettings}})
    })

    const settingsArray = reduce(changeSetting(this.state.settings),
      (accumulator, value, key) => {
        accumulator.push([key, JSON.stringify(value)])
        return accumulator
      },
      [])

    try {
      await AsyncStorage.multiSet(settingsArray)
    } catch (e) {
      alert(e)
    }
  }

  toggleErrorTracking = () => {
    this.setSetting(settings => ({errorTracking: !settings.errorTracking}))
  }

  renderItem = ({item}: { item: ItemType }) => {
    const {theme} = this.props
    const {errorTracking} = this.state.settings
    const {title, description, hasSwitch, onPress} = item

    return (
      <SettingItem title={title} description={description}
                   onPress={onPress} theme={theme}>
        {hasSwitch && <Switch value={errorTracking} onValueChange={this.toggleErrorTracking} />}
      </SettingItem>
    )
  }

  renderSectionHeader = ({section: {title}}: { section: SectionType }) =>
    <SectionHeaderContainer><SectionHeader>{title}</SectionHeader></SectionHeaderContainer>

  keyExtractor = (item: ItemType, index: number) => index

  ThemedItemSeparator = () => <ItemSeparator theme={this.props.theme} />

  render () {
    if (!this.state.settingsLoaded) {
      return null
    }

    return (
      <SectionList
        keyExtractor={this.keyExtractor}
        sections={this.sections}
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
