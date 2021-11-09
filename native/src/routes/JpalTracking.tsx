import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Text, TextInput, View } from 'react-native'
import styled from 'styled-components/native'

import { JpalTrackingRouteType } from 'api-client'
import { ThemeType } from 'build-configs'

import Caption from '../components/Caption'
import LayoutContainer from '../components/LayoutContainer'
import SettingsSwitch from '../components/SettingsSwitch'
import { NavigationPropType, RoutePropType } from '../constants/NavigationTypes'
import withTheme from '../hocs/withTheme'
import appSettings from '../utils/AppSettings'

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
  color: ${props => props.theme.colors.textColor};
  text-align-vertical: top;
  height: 50px;
`

export type PropsType = {
  theme: ThemeType
  route: RoutePropType<JpalTrackingRouteType>
  navigation: NavigationPropType<JpalTrackingRouteType>
}

const JpalTracking = ({ route, theme }: PropsType) => {
  const [trackingCode, setTrackingCode] = useState<string | null>(null)
  const [trackingEnabled, setTrackingEnabled] = useState<boolean | null>(null)
  const [settingsLoaded, setSettingsLoaded] = useState(false)
  const [error, setError] = useState<boolean>(false)
  const { t } = useTranslation(['settings', 'error'])
  const routeTrackingCode = route.params.trackingCode

  const updateTrackingCode = (value: string) => {
    setTrackingCode(value)
    appSettings
      .setJpalTrackingCode(value)
      .then(() => setError(false))
      .catch(() => setError(true))
  }

  useEffect(() => {
    if (routeTrackingCode) {
      updateTrackingCode(routeTrackingCode)
    }
  }, [routeTrackingCode])

  useEffect(() => {
    appSettings
      .loadSettings()
      .then(settings => {
        // Do not override previous set tracking code (e.g. from route params)
        setTrackingCode(previous => previous ?? settings.jpalTrackingCode)
        setTrackingEnabled(settings.jpalTrackingEnabled)
        setSettingsLoaded(true)
      })
      .catch(() => setError(true))
  }, [])

  const toggleTrackingEnabled = () => {
    const newTrackingEnabled = !trackingEnabled
    setTrackingEnabled(newTrackingEnabled)
    appSettings
      .setJpalTrackingEnabled(newTrackingEnabled)
      .then(() => setError(false))
      .catch(() => setError(true))
  }

  if (!settingsLoaded) {
    return <LayoutContainer />
  }

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
          <ThemedText theme={theme}>{t('allowTracking')}</ThemedText>
          <SettingsSwitch theme={theme} value={!!trackingEnabled} onPress={toggleTrackingEnabled} />
        </DescriptionContainer>

        <ThemedText theme={theme}>{t('trackingCode')}</ThemedText>
        <Input
          value={trackingCode ?? ''}
          onChangeText={updateTrackingCode}
          theme={theme}
          editable={!!trackingEnabled}
          testID='input'
        />
      </View>
    </LayoutContainer>
  )
}

export default withTheme<PropsType>(JpalTracking)
