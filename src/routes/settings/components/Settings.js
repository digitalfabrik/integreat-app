// @flow

import * as React from 'react'
import { SectionList, StyleSheet, Switch, AsyncStorage, Linking, View } from 'react-native'
import styled from 'styled-components/native'

import SettingItem from './SettingItem'
import type { ThemeType } from '../../../modules/theme/constants/theme'
import { reduce } from 'lodash/collection'
import type { TFunction } from 'react-i18next'
import type { NavigationScreenProp } from 'react-navigation'
import { mapValues, toPairs } from 'lodash/object'

type PropsType = {|
  theme: ThemeType,
  language: string,
  t: TFunction,
  navigation: NavigationScreenProp<*>
|}

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

const SectionHeader = styled.Text`
    padding: 20px;
    color: ${props => props.theme.colors.textColor};
`

export default class Settings extends React.Component<PropsType, StateType> {
  sections = () => {
    const {t, language} = this.props

    return ([
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
            title: t('troubleshooting'),
            description: t('troubleshootingDescription'),
            hasSwitch: true,
            onPress: () => { this.toggleErrorTracking() }
          },
          {
            title: t('about'),
            onPress: () => {
              if (language === 'de') {
                Linking.openURL('https://integreat-app.de/')
              } else {
                Linking.openURL('https://integreat-app.de/en/')
              }
            }
          },
          {
            title: t('privacyPolicy'),
            onPress: () => {
              if (language === 'de') {
                Linking.openURL('https://integreat-app.de/datenschutz-webseite/')
              } else {
                Linking.openURL('https://integreat-app.de/en/privacy-website/')
              }
            }
          },
          {
            title: t('version', {version: '??'})
          },
          {
            title: t('openSourceLicenses'),
            onPress: () => { console.warn('Not yet implemented.') }
          }
        ]
      }
    ])
  }

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

      this.setState({settingsLoaded: true, settings})
    } catch (e) {
      console.error('Failed to load settings.')
    }
  }

  async setSetting (changeSetting: SettingsType => $Shape<SettingsType>) {
    this.setState(
      state => {
        const newSettings = changeSetting(state.settings)
        return {settings: {...state.settings, ...newSettings}}
      },
      async () => {
        const settingsArray = toPairs(mapValues(changeSetting(this.state.settings), value => JSON.stringify(value)))

        try {
          await AsyncStorage.multiSet(settingsArray)
        } catch (e) {
          console.error('Failed to persist settings.')
        }
      }
    )
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
        sections={this.sections()}
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
