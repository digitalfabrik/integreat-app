// @flow

import * as React from 'react'
import { SectionList, StyleSheet, Switch } from 'react-native'
import styled from 'styled-components/native'

import SettingItem from './SettingItem'
import type { ThemeType } from '../../../modules/theme/constants/theme'
import type { NavigationScreenProp } from 'react-navigation'

const sections = [
  {
    title: 'Title1',
    data: [
      {
        title: 'Airplane Mode',
        description: 'Airplane Mode'
      },
      {
        title: 'Airplane Mode',
        description: 'Airplane Mode'
      }
    ]
  },
  {
    data: [
      {
        title: 'Airplane Mode',
        description: 'Airplane Mode'
      },
      {
        title: 'Airplane Mode',
        description: 'Airplane Mode'
      },
      {
        title: 'Airplane Mode',
        description: 'Airplane Mode'
      }
    ]
  }
]

type PropsType = {
  navigation: NavigationScreenProp<*>,
  theme: ThemeType
}

type SettingsType = {|
  errorTracking: boolean,
  test: boolean
|}

type StateType = {
  settings: SettingsType
}

type ItemType = { title: string, description: string }
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
  constructor (props: PropsType) {
    super(props)

    this.state = {settings: {errorTracking: false, test: false}}
  }

  setSetting (changeSetting: SettingsType => $Shape<SettingsType>) {
    this.setState(state => {
      const newSettings = changeSetting(state.settings)

      return ({...state, settings: {...state.settings, ...newSettings}})
    })
  }

  toggleErrorTracking = () => {
    this.setSetting(settings => ({errorTracking: !settings.errorTracking}))
  }

  renderItem = ({item}: { item: ItemType }) => {
    const {theme} = this.props
    const {errorTracking} = this.state.settings
    const {title, description} = item

    return (
      <SettingItem title={title} description={description}
                   onPress={this.toggleErrorTracking} theme={theme}>
        <Switch value={errorTracking} onValueChange={this.toggleErrorTracking} />
      </SettingItem>
    )
  }

  renderSectionHeader = ({section: {title}}: { section: SectionType }) =>
    <SectionHeaderContainer><SectionHeader>{title}</SectionHeader></SectionHeaderContainer>

  keyExtractor = (item: ItemType, index: number) => index

  ThemedItemSeparator = () => <ItemSeparator theme={this.props.theme} />

  render () {
    return (
      <SectionList
        keyExtractor={this.keyExtractor}
        sections={sections}
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
