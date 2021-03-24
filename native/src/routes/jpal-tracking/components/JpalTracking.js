// @flow

import React, { useEffect, useState } from 'react'

import Caption from '../../../modules/common/components/Caption'
import type { ThemeType } from 'build-configs/ThemeType'
import { Switch, Text, TextInput, View } from 'react-native'
import type { TFunction } from 'react-i18next'
import type { StateType } from '../../../modules/app/StateType'
import AppSettings, { defaultSettings } from '../../../modules/settings/AppSettings'
import type { NavigationPropType, RoutePropType } from '../../../modules/app/constants/NavigationTypes'
import type { JpalTrackingRouteType } from 'api-client'
import styled from 'styled-components/native'
import LayoutContainer from '../../../modules/layout/containers/LayoutContainer'

const ThemedText = styled.Text`
  display: flex;
  text-align: left;
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.decorativeFontRegular};
  padding: 10px 0;
`

const DescriptionContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 15px 0 5px;
`

const Input = styled(TextInput)`
  padding: 15px;
  border-width: 1px;
  border-color: ${props => props.theme.colors.themeColor};
  text-align-vertical: top;
  height: 50px;
`

export type PropsType = {|
  theme: ThemeType,
  t: TFunction,
  route: RoutePropType<JpalTrackingRouteType>,
  navigation: NavigationPropType<JpalTrackingRouteType>
|}

const JpalTracking = (props: PropsType, state: StateType) => {
  const [appSettings] = useState(new AppSettings())
  const [settings, setSettings] = useState(defaultSettings)
  const [settingsLoaded, setSettingsLoaded] = useState(false)
  const [settingsUpdated, setSettingsUpdated] = useState(false)
  const [displayedTrackingCode, setDisplayedTrackingCode] = useState('')
  const routeTrackingCode = props.route.params.trackingCode

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const loadedSettings = await appSettings.loadSettings()
        if(routeTrackingCode) {
          appSettings.setJpalTrackingCode(routeTrackingCode)
        }
        setSettingsLoaded(true)
        setSettingsUpdated(false)
        setSettings(loadedSettings)
        setDisplayedTrackingCode(loadedSettings.jpalTrackingCode)
      } catch (e) {
        console.error('Failed to load settings.')
      }
    }
    loadSettings()
  }, [appSettings, settingsUpdated, routeTrackingCode])

  const onPress = () => {
    appSettings.setJpalTrackingEnabled(!settings.jpalTrackingEnabled).then(setSettingsUpdated(true))
  }

  const setTrackingCode = (value: string) => {
    setDisplayedTrackingCode(value)
    appSettings.setJpalTrackingCode(value).then(setSettingsUpdated(true))
    props.navigation.setParams({ trackingCode: value })
  }

  if (!settingsLoaded) {
    return <LayoutContainer />
  }

  const { t, theme } = props
  const { jpalTrackingEnabled } = settings

  return (
    <View style={{ padding: 40 }}>
      <Caption title={t('tracking')} theme={theme} />
      <Text>{t('trackingDescription')}</Text>

      <DescriptionContainer>
        <ThemedText theme={props.theme}>{t('trackingAllowed')}</ThemedText>
        <Switch
          thumbColor={props.theme.colors.themeColor}
          trackColor={{ true: props.theme.colors.themeColor }}
          value={jpalTrackingEnabled}
          onValueChange={onPress}
          testID='switch'
        />
      </DescriptionContainer>

      <ThemedText theme={props.theme}>{t('trackingCode')}</ThemedText>
      <Input
        value={displayedTrackingCode}
        onChangeText={setTrackingCode}
        theme={theme}
        editable={jpalTrackingEnabled}
        testID='input'></Input>
    </View>
  )
}

export default JpalTracking
