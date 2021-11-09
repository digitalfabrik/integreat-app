import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, Text, TextInput, View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { JpalTrackingRouteType } from 'api-client'

import Caption from '../components/Caption'
import LayoutContainer from '../components/LayoutContainer'
import Link from '../components/Link'
import LoadingSpinner from '../components/LoadingSpinner'
import SettingsSwitch from '../components/SettingsSwitch'
import { NavigationPropType, RoutePropType } from '../constants/NavigationTypes'
import buildConfig from '../constants/buildConfig'
import appSettings from '../utils/AppSettings'
import { log, reportError } from '../utils/sentry'

const moreInformationUrl = 'https://integrationevaluation.wordpress.com'

const ThemedText = styled.Text`
  display: flex;
  text-align: left;
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.decorativeFontRegular};
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
  border-color: ${props => props.theme.colors.textDisabledColor};
  color: ${props => props.theme.colors.textSecondaryColor};
  text-align-vertical: top;
  height: 50px;
`

export type PropsType = {
  route: RoutePropType<JpalTrackingRouteType>
  navigation: NavigationPropType<JpalTrackingRouteType>
}

const JpalTracking = ({ navigation, route }: PropsType): ReactElement => {
  const [trackingCode, setTrackingCode] = useState<string | null>(null)
  const [trackingEnabled, setTrackingEnabled] = useState<boolean | null>(null)
  const { t } = useTranslation('settings')
  const theme = useTheme()
  const routeTrackingCode = route.params.trackingCode

  const updateTrackingEnabled = useCallback((trackingEnabled: boolean) => {
    setTrackingEnabled(trackingEnabled)
    appSettings.setJpalTrackingEnabled(trackingEnabled).catch(e => {
      setTrackingEnabled(false)
      log('Something went wrong while persisting jpal tracking enabled')
      reportError(e)
    })
  }, [])

  const toggleTrackingEnabled = () => {
    updateTrackingEnabled(!trackingEnabled)
  }

  const updateTrackingCode = useCallback((value: string) => {
    setTrackingCode(value)
    appSettings.setJpalTrackingCode(value).catch(e => {
      log('Something went wrong while persisting jpal tracking code')
      reportError(e)
    })
  }, [])

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
      })
      .catch(e => {
        log('Something went wrong while loading settings')
        reportError(e)
      })
  }, [])

  useEffect(
    () =>
      navigation.addListener('beforeRemove', e => {
        // Show alert if user attempts to leave screen with tracking disabled
        if (!trackingEnabled) {
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
              onPress: () => updateTrackingEnabled(true)
            }
          ])
        }
      }),
    [navigation, trackingEnabled, updateTrackingEnabled, t]
  )

  if (!trackingCode) {
    return (
      <LayoutContainer>
        <LoadingSpinner />
      </LayoutContainer>
    )
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
          <SettingsSwitch theme={theme} value={!!trackingEnabled} onPress={toggleTrackingEnabled} />
        </DescriptionContainer>

        <ThemedText theme={theme}>{t('trackingCode')}</ThemedText>
        <Input value={trackingCode} theme={theme} editable={false} testID='input' />

        <Link url={moreInformationUrl} text={t('trackingMoreInformation')} />
      </View>
    </LayoutContainer>
  )
}

export default JpalTracking
