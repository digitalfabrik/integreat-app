import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, Switch, Text, TextInput, View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { JpalTrackingRouteType } from 'api-client'

import Caption from '../components/Caption'
import LayoutContainer from '../components/LayoutContainer'
import Link from '../components/Link'
import { NavigationPropType, RoutePropType } from '../constants/NavigationTypes'
import buildConfig from '../constants/buildConfig'
import appSettings from '../utils/AppSettings'

const moreInformationUrl = 'https://integrationevaluation.wordpress.com'

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
const Input = styled(TextInput)<{ editable: boolean; error: boolean }>`
  padding: 15px;
  border-width: 1px;
  border-color: ${props => (props.editable ? props.theme.colors.themeColor : props.theme.colors.textDisabledColor)};
  ${props => (props.error ? 'border-color: red;' : '')};
  color: ${props => props.theme.colors.textColor};
  text-align-vertical: top;
  height: 50px;
`

export type PropsType = {
  route: RoutePropType<JpalTrackingRouteType>
  navigation: NavigationPropType<JpalTrackingRouteType>
}

const TRACKING_CODE_LENGTH = 7

const JpalTracking = ({ navigation, route }: PropsType): ReactElement => {
  const [trackingCode, setTrackingCode] = useState<string | null>(null)
  const [trackingEnabled, setTrackingEnabled] = useState<boolean | null>(null)
  const [settingsLoaded, setSettingsLoaded] = useState<boolean>(false)
  const [invalid, setInvalid] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const { t } = useTranslation(['settings', 'error'])
  const theme = useTheme()
  const routeTrackingCode = route.params.trackingCode

  const updateTrackingEnabled = useCallback((trackingEnabled: boolean) => {
    setTrackingEnabled(trackingEnabled)
    appSettings
      .setJpalTrackingEnabled(trackingEnabled)
      .then(() => setError(null))
      .catch(() => setError('generalError'))
  }, [])

  const toggleTrackingEnabled = () => {
    updateTrackingEnabled(!trackingEnabled)
  }

  const updateTrackingCode = useCallback((value: string) => {
    setTrackingCode(value)
    appSettings
      .setJpalTrackingCode(value)
      .then(() => setError(null))
      .catch(() => setError('generalError'))
  }, [])

  useEffect(
    () =>
      navigation.addListener('beforeRemove', e => {
        if (!routeTrackingCode) {
          // User probably just opened the settings out of interest, don't annoy em by opening an alert
          return
        }
        if (trackingCode?.length === TRACKING_CODE_LENGTH && trackingEnabled) {
          // Tracking enabled and (hopefully) valid code entered, so we are good to leave the screen
          return
        }

        e.preventDefault()

        Alert.alert(t('trackingLeaveTitle'), t('trackingLeaveDescription', { appName: buildConfig().appName }), [
          {
            text: t('decline'),
            style: 'destructive',
            onPress: () => {
              updateTrackingEnabled(false)
              navigation.dispatch(e.data.action)
            }
          },
          {
            text: t('allowTracking'),
            style: 'default',
            onPress: () => setInvalid(true)
          }
        ])
      }),
    [navigation, trackingCode, trackingEnabled, updateTrackingEnabled, t, routeTrackingCode]
  )

  // Save tracking code passed with route params
  useEffect(() => {
    if (routeTrackingCode) {
      updateTrackingCode(routeTrackingCode)
    }
  }, [routeTrackingCode, updateTrackingCode])

  // Load previously set tracking enabled and code
  useEffect(() => {
    appSettings
      .loadSettings()
      .then(settings => {
        // Do not override previous set tracking code (e.g. from route params)
        setTrackingCode(previous => previous ?? settings.jpalTrackingCode)
        setTrackingEnabled(settings.jpalTrackingEnabled)
        setSettingsLoaded(true)
      })
      .catch(() => setError('generalError'))
  }, [])

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
        <Text>{t('trackingDescription', { appName: buildConfig().appName })}</Text>
        <Text>{t('trackingParticipation', { appName: buildConfig().appName })}</Text>

        <DescriptionContainer onPress={toggleTrackingEnabled}>
          <ThemedText theme={theme}>{t('allowTracking')}</ThemedText>
          <Switch
            thumbColor={invalid && !trackingEnabled ? 'red' : theme.colors.themeColor}
            trackColor={{
              true: theme.colors.themeColor,
              false: theme.colors.backgroundAccentColor
            }}
            value={!!trackingEnabled}
            onValueChange={toggleTrackingEnabled}
            testID='switch'
          />
        </DescriptionContainer>

        <ThemedText theme={theme}>{t('trackingCode')}</ThemedText>
        <Input
          error={invalid && trackingCode?.length !== TRACKING_CODE_LENGTH}
          value={trackingCode ?? ''}
          onChangeText={updateTrackingCode}
          theme={theme}
          editable={!!trackingEnabled}
          testID='input'
        />

        {error && <ErrorText>{t(error)}</ErrorText>}
        <Link url={moreInformationUrl} text={t('trackingMoreInformation')} />
      </View>
    </LayoutContainer>
  )
}

export default JpalTracking
