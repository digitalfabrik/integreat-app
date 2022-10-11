import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, Text, View } from 'react-native'
import styled from 'styled-components/native'

import { JpalTrackingRouteType } from 'api-client'

import Caption from '../components/Caption'
import Layout from '../components/Layout'
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

export type JpalTrackingPropsType = {
  route: RoutePropType<JpalTrackingRouteType>
  navigation: NavigationPropType<JpalTrackingRouteType>
}

const JpalTracking = ({ navigation }: JpalTrackingPropsType): ReactElement => {
  const [trackingEnabled, setTrackingEnabled] = useState<boolean | null>(null)
  const [settingsLoaded, setSettingsLoaded] = useState<boolean>(false)
  const { t } = useTranslation('settings')

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

  useEffect(() => {
    // Load previously set tracking enabled
    appSettings
      .loadSettings()
      .then(settings => {
        setSettingsLoaded(true)
        setTrackingEnabled(settings.jpalTrackingEnabled)
        log(`Using jpal tracking code ${settings.jpalTrackingCode}`)
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
              },
            },
            {
              text: t('allowTracking'),
              style: 'default',
              onPress: () => updateTrackingEnabled(true),
            },
          ])
        }
      }),
    [navigation, trackingEnabled, updateTrackingEnabled, t]
  )

  if (!settingsLoaded) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    )
  }

  return (
    <Layout>
      <View
        style={{
          padding: 40,
        }}>
        <Caption title={t('tracking')} />
        <Text>{t('trackingDescription', { appName: buildConfig().appName })}</Text>

        <DescriptionContainer onPress={toggleTrackingEnabled}>
          <ThemedText>{t('allowTracking')}</ThemedText>
          <SettingsSwitch value={!!trackingEnabled} onPress={toggleTrackingEnabled} />
        </DescriptionContainer>

        <Link url={moreInformationUrl} text={t('trackingMoreInformation')} />
      </View>
    </Layout>
  )
}

export default JpalTracking
