import React, { useCallback, useEffect, useState } from 'react'
import { ThemeType } from 'build-configs/ThemeType'
import { Switch, Text, TextInput, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import AppSettings, { defaultSettings } from '../../modules/settings/AppSettings'
import { NavigationPropType, RoutePropType } from '../../modules/app/constants/NavigationTypes'
import { JpalTrackingRouteType } from 'api-client'
import styled from 'styled-components/native'
import LayoutContainer from '../../modules/layout/containers/LayoutContainer'
import withTheme from '../../modules/theme/hocs/withTheme'
import Caption from '../../modules/common/components/Caption'

const ThemedText = styled.Text`
  display: flex;
  text-align: left;
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.decorativeFontRegular};
  padding: 10px 0;
`
const ErrorText = styled.Text`
  color: red;
  font-weight: bold;
  padding: 10px 0;
`
const DescriptionContainer = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 15px 0 5px;
`
const Input = styled(TextInput)`
  padding: 15px;
  border-width: 1px;
  border-color: ${props => (props.editable ? props.theme.colors.themeColor : props.theme.colors.textDisabledColor)};
  text-align-vertical: top;
  height: 50px;
`
export type PropsType = {
  theme: ThemeType
  route: RoutePropType<JpalTrackingRouteType>
  navigation: NavigationPropType<JpalTrackingRouteType>
}
const errorDisplayTime = 5000
const appSettings = new AppSettings()

const JpalTracking = (props: PropsType) => {
  const [settings, setSettings] = useState(defaultSettings)
  const [settingsLoaded, setSettingsLoaded] = useState(false)
  const [error, setError] = useState(false)
  const routeTrackingCode = props.route.params.trackingCode
  const { t } = useTranslation(['settings', 'error'])
  const loadSettings = useCallback(async () => {
    try {
      const loadedSettings = await appSettings.loadSettings().catch()
      setSettingsLoaded(true)
      setSettings(loadedSettings)
      const timeout = setTimeout(() => setError(false), errorDisplayTime)
      return () => clearTimeout(timeout)
    } catch (e) {
      setError(true)
    }
  }, [])
  useEffect(() => {
    if (routeTrackingCode) {
      appSettings
        .setJpalTrackingCode(routeTrackingCode)
        .then(() => loadSettings())
        .catch(() => {
          setError(true)
          loadSettings()
        })
    }
  }, [routeTrackingCode, loadSettings])
  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  const toggleTrackingEnabled = () => {
    setSettings({ ...settings, jpalTrackingEnabled: !settings.jpalTrackingEnabled })
    appSettings.setJpalTrackingEnabled(!settings.jpalTrackingEnabled).catch(() => {
      setError(true)
      loadSettings()
    })
  }

  const setTrackingCode = (value: string) => {
    setSettings({ ...settings, jpalTrackingCode: value })
    appSettings.setJpalTrackingCode(value).catch(() => {
      setError(true)
      loadSettings()
    })
  }

  if (!settingsLoaded) {
    return <LayoutContainer />
  }

  const { theme } = props
  return (
    <LayoutContainer>
      <View
        style={{
          padding: 40
        }}>
        <Caption title={t('tracking')} theme={theme} />
        <Text>{t('trackingDescription')}</Text>

        {error && <ErrorText>{t('error:generalError')}</ErrorText>}

        <DescriptionContainer onPress={toggleTrackingEnabled}>
          <ThemedText theme={props.theme}>{t('allowTracking')}</ThemedText>
          <Switch
            thumbColor={props.theme.colors.themeColor}
            trackColor={{
              true: props.theme.colors.themeColor,
              false: props.theme.colors.backgroundAccentColor
            }}
            value={!!settings.jpalTrackingEnabled}
            onValueChange={toggleTrackingEnabled}
            testID='switch'
          />
        </DescriptionContainer>

        <ThemedText theme={props.theme}>{t('trackingCode')}</ThemedText>
        <Input
          value={settings.jpalTrackingCode}
          onChangeText={setTrackingCode}
          theme={theme}
          editable={settings.jpalTrackingEnabled}
          testID='input'
        />
      </View>
    </LayoutContainer>
  )
}

export default withTheme<PropsType>(JpalTracking)
